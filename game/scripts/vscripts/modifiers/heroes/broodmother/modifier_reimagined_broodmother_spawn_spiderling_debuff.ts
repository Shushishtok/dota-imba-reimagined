import { reimagined_broodmother_spawn_spiderlings } from "../../../abilities/heroes/broodmother/reimagined_broodmother_spawn_spiderlings";
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_reimagined_broodmother_spawn_spiderling_debuff extends BaseModifier
{
    // Modifier properties
    caster: CDOTA_BaseNPC = this.GetCaster()!;
    ability: CDOTABaseAbility = this.GetAbility()!;
    parent: CDOTA_BaseNPC = this.GetParent();
    particle_debuff: string = "particles/units/heroes/hero_broodmother/broodmother_spiderlings_debuff.vpcf";
    sound_spiderlings: string = "Hero_Broodmother.SpawnSpiderlings";
    particle_spiderlings_spawn: string = "particles/units/heroes/hero_broodmother/broodmother_spiderlings_spawn.vpcf";
    particle_spiderlings_spawn_fx?: ParticleID;
    spiderling_unit_name: string = "npc_dota_broodmother_spiderling";

    // Modifier specials
    spiderling_duration?: number;
    count?: number;

    IsHidden() {return false}
    IsDebuff() {return true}
    IsPurgable() {return true}

    OnCreated(): void
    {
        // Modifier specials
        this.spiderling_duration = this.ability.GetSpecialValueFor("spiderling_duration");
        this.count = this.ability.GetSpecialValueFor("count");
    }

    DeclareFunctions(): ModifierFunction[]
    {
        return [ModifierFunction.ON_DEATH,
                ModifierFunction.TOOLTIP]
    }

    OnTooltip(): number
    {
        return this.count!;
    }

    OnDeath(event: ModifierAttackEvent)
    {
        if (!IsServer()) return;

        // Only apply on the parent dying
        if (event.unit != this.parent) return;

        const death_position = this.parent.GetAbsOrigin();

        // Play spiderling sound
		EmitSoundOn(this.sound_spiderlings, this.parent);

        // Create particle effect on position
        this.particle_spiderlings_spawn_fx = ParticleManager.CreateParticle(this.particle_spiderlings_spawn, ParticleAttachment.ABSORIGIN, this.parent);
		ParticleManager.SetParticleControl(this.particle_spiderlings_spawn_fx, 0, death_position);
		ParticleManager.ReleaseParticleIndex(this.particle_spiderlings_spawn_fx);

        // Spawn Spiderling at the parent's location
        for (let index = 0; index < this.count!; index++)
        {
            CreateUnitByNameAsync(this.spiderling_unit_name, death_position, true, this.caster, this.caster, this.caster.GetTeamNumber(), (unit: CDOTA_BaseNPC) =>
            {
                // Configure the spiderling
                unit.SetOwner(this.caster);
                unit.SetControllableByPlayer((this.caster as CDOTA_BaseNPC_Hero).GetPlayerID(), false);
                FindClearSpaceForUnit(unit, death_position, true);
                ResolveNPCPositions(death_position, unit.GetHullRadius());

                // Set ability levels
                for (let index = 0; index < unit.GetAbilityCount(); index++)
                {
                    const ability = unit.GetAbilityByIndex(index);
                    if (ability)
                    {
                        ability.SetLevel(this.ability.GetLevel());
                    }
                }

                // Spiderling Academy: Spiderlings's damage, health, armor and magic resistance increase by x, y, z and t% respectively for each level Broodmother has earned.
                ((this.ability as reimagined_broodmother_spawn_spiderlings).ReimaginedSpiderlingAcademy(unit, false));

                // Add the kill timer modifier
                unit.AddNewModifier(this.caster, this.ability, BuiltInModifier.KILL, {duration: this.spiderling_duration!});
            });
        }
    }

    GetEffectName(): string
    {
        return this.particle_debuff;
    }

    GetEffectAttachType(): ParticleAttachment
    {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}
