"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path_1 = __importDefault(require("path"));
var filepath = path_1.default.join(__dirname, "/localizationData.js");
var compiler = loadCompiler();
doCompile();
var fsWait = false;
fs.watch(filepath, function (event, filename) {
    if (filename && event === 'change') {
        if (fsWait)
            return;
        fsWait = setTimeout(function () {
            fsWait = false;
        }, 100);
        // Create a new compiler class
        compiler = loadCompiler();
        compiler.OnLocalizationDataChanged();
    }
});
function doCompile() {
    console.log("Data changed, compiling");
    compiler.OnLocalizationDataChanged();
    console.log("Data finished compilation.");
}
function loadCompiler() {
    // Clear require cache
    delete require.cache[require.resolve("./localizationCompiler")];
    delete require.cache[require.resolve("./localizationData")];
    // Require latest compiler version
    var compilerClass = require("./localizationCompiler").LocalizationCompiler;
    return new compilerClass();
}
