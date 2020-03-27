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

import { ISettings } from "./type-definitions";
import { Log }       from "./tspath-log";
import {TSConfigData} from "./parsers/tsconfig-parser";

export class ProjectOptions {
	public tsConfig: TSConfigData;
	public outDir: string;
	public baseUrl: string;
	public pathMappings: ISettings;
	public excludePaths: Array<string>;

	//TODO: Support fallbacks
	private processMappings(mappings: any) {
		for (let alias in mappings) {
			this.pathMappings[alias] = mappings[alias][0]; // No support for fallbacks yet...
		}
	}

	private parseExclude(excludes: any): void {
		Log.debug("PARSE EXCLUDES", excludes);
		for (let index in excludes) {
			Log.debug("Exclude path ::", excludes[index]);
		}
	}

	constructor(projectPath: string, tsConfig: TSConfigData) {
		this.tsConfig = tsConfig;
		this.pathMappings = {};
		this.excludePaths = new Array<string>();
		this.outDir = tsConfig.compilerOptions.outDir;
		this.baseUrl = tsConfig.compilerOptions.baseUrl;
		this.processMappings(tsConfig.compilerOptions.paths);
		this.parseExclude(tsConfig.exclude);
	}
}