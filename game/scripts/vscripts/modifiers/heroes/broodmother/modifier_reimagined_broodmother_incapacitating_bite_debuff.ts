import { BaseModifier, registerModifier, } from "../../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_reimagined_broodmother_incapacitating_bite_debuff extends BaseModifier
{
    // Modifier properties
    caster: CDOTA_BaseNPC = this.GetCaster()!;
    ability: CDOTABaseAbility = this.GetAbility()!;
    parent: CDOTA_BaseNPC = this.GetParent();
    particle_debuff: string = "particles/units/heroes/hero_broodmother/broodmother_incapacitatingbite_debuff.vpcf";

    // Modifier specials
    miss_chance?: number;
    bonus_movespeed?: number;

    // Reimagined specials
    paralytic_cast_speed_slow_pct?: number;
    paralytic_attack_speed_slow?: number;

    IsHidden() {return false}
    IsDebuff() {return true}
    IsPurgable() {return true}

    OnCreated(): void
    {
        // Modifier specials
        this.miss_chance = this.ability.GetSpecialValueFor("miss_chance");
        this.bonus_movespeed = this.ability.GetSpecialValueFor("bonus_movespeed");

        // Reimagined specials
        this.paralytic_cast_speed_slow_pct = this.ability.GetSpecialValueFor("paralytic_cast_speed_slow_pct");
        this.paralytic_attack_speed_slow = this.ability.GetSpecialValueFor("paralytic_attack_speed_slow");
    }

    DeclareFunctions(): ModifierFunction[]
    {
        return [ModifierFunction.MISS_PERCENTAGE,
                ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,

                // Reimagined: Paralytic Toxics: Attack speed is reduced by x and cast speed y% for affected units for the duration.
                ModifierFunction.CASTTIME_PERCENTAGE,
                ModifierFunction.ATTACKSPEED_BONUS_CONSTANT]
    }

    GetModifierMiss_Percentage(): number
    {
        return this.miss_chance!;
    }

    GetModifierMoveSpeedBonus_Percentage(): number
    {
        return this.bonus_movespeed! * (-1);
    }

    GetModifierPercentageCasttime(): number
    {
        // Reimagined: Paralytic Toxics: Attack speed is reduced by x and cast speed y% for affected units for the duration.
        return this.ReimaginedParalyticToxinsCastSpeed();
    }

    ReimaginedParalyticToxinsCastSpeed(): number
    {
        return this.paralytic_cast_speed_slow_pct! * (-1);
    }

    GetModifierAttackSpeedBonus_Constant(): number
    {
        // Reimagined: Paralytic Toxics: Attack speed is reduced by x and cast speed y% for affected units for the duration.
        return this.ReimaginedParalyticToxinsAttackSpeed();
    }

    ReimaginedParalyticToxinsAttackSpeed(): number
    {
        return this.paralytic_attack_speed_slow! * (-1);
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