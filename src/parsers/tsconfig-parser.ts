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

export interface TSConfigData {
	compilerOptions?: CompilerOptions;
	exclude?:         string[];
	include?:         string[];
}

export interface CompilerOptions {
	target?:                       string;
	module?:                       string;
	lib?:                          any[];
	allowJs?:                      boolean;
	checkJs?:                      boolean;
	jsx?:                          string;
	declaration?:                  boolean;
	declarationMap?:               boolean;
	sourceMap?:                    boolean;
	outFile?:                      string;
	outDir?:                       string;
	rootDir?:                      string;
	composite?:                    boolean;
	removeComments?:               boolean;
	noEmit?:                       boolean;
	importHelpers?:                boolean;
	downlevelIteration?:           boolean;
	isolatedModules?:              boolean;
	strict?:                       boolean;
	noImplicitAny?:                boolean;
	strictNullChecks?:             boolean;
	strictFunctionTypes?:          boolean;
	strictPropertyInitialization?: boolean;
	noImplicitThis?:               boolean;
	alwaysStrict?:                 boolean;
	noUnusedLocals?:               boolean;
	noUnusedParameters?:           boolean;
	noImplicitReturns?:            boolean;
	noFallthroughCasesInSwitch?:   boolean;
	moduleResolution?:             string;
	baseUrl?:                      string;
	paths?:                        Paths;
	rootDirs?:                     any[];
	typeRoots?:                    any[];
	types?:                        any[];
	allowSyntheticDefaultImports?: boolean;
	esModuleInterop?:              boolean;
	preserveSymlinks?:             boolean;
	sourceRoot?:                   string;
	mapRoot?:                      string;
	inlineSourceMap?:              boolean;
	inlineSources?:                boolean;
	experimentalDecorators?:       boolean;
	emitDecoratorMetadata?:        boolean;
}

export interface Paths {
}

export namespace TSConfigParser {
	export function toTsConfigData(json: string): TSConfigData {
		return JSON.parse(json);
	}

	export function tsConfigDataToJson(value: TSConfigData): string {
		return JSON.stringify(value);
	}
}