"use strict";
/*=--------------------------------------------------------------=

 TSPath - Typescript Path Resolver

 Author : Patrik Forsberg
 Email  : patrik.forsberg@coldmind.com
 GitHub : https://github.com/duffman

 I hope this piece of software brings joy into your life, makes
 you sleep better knowing that you are no longer in path hell!

 Use this software free of charge, the only thing I ask is that
 you obey to the terms stated in the license, i would also like
 you to keep the file header intact.

 Also, I would love to see you getting involved in the project!

 Enjoy!

 This software is subject to the LGPL v2 License, please find
 the full license attached in LICENCE.md

 =----------------------------------------------------------------= */
Object.defineProperty(exports, "__esModule", { value: true });
const tspath_log_1 = require("./tspath-log");
class ProjectOptions {
    //TODO: Support fallbacks
    processMappings(mappings) {
        for (let alias in mappings) {
            this.pathMappings[alias] = mappings[alias][0]; // No support for fallbacks yet...
        }
    }
    parseExclude(excludes) {
        tspath_log_1.Log.debug("PARSE EXCLUDES", excludes);
        for (let index in excludes) {
            tspath_log_1.Log.debug("Exclude path ::", excludes[index]);
        }
    }
    constructor(projectPath, tsConfig) {
        this.tsConfig = tsConfig;
        this.pathMappings = {};
        this.excludePaths = new Array();
        this.outDir = tsConfig.compilerOptions.outDir;
        this.baseUrl = tsConfig.compilerOptions.baseUrl;
        this.processMappings(tsConfig.compilerOptions.paths);
        this.parseExclude(tsConfig.exclude);
    }
}
exports.ProjectOptions = ProjectOptions;
