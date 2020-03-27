export interface TSConfigData {
    compilerOptions?: CompilerOptions;
    exclude?: string[];
    include?: string[];
}
export interface CompilerOptions {
    target?: string;
    module?: string;
    lib?: any[];
    allowJs?: boolean;
    checkJs?: boolean;
    jsx?: string;
    declaration?: boolean;
    declarationMap?: boolean;
    sourceMap?: boolean;
    outFile?: string;
    outDir?: string;
    rootDir?: string;
    composite?: boolean;
    removeComments?: boolean;
    noEmit?: boolean;
    importHelpers?: boolean;
    downlevelIteration?: boolean;
    isolatedModules?: boolean;
    strict?: boolean;
    noImplicitAny?: boolean;
    strictNullChecks?: boolean;
    strictFunctionTypes?: boolean;
    strictPropertyInitialization?: boolean;
    noImplicitThis?: boolean;
    alwaysStrict?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    noImplicitReturns?: boolean;
    noFallthroughCasesInSwitch?: boolean;
    moduleResolution?: string;
    baseUrl?: string;
    paths?: Paths;
    rootDirs?: any[];
    typeRoots?: any[];
    types?: any[];
    allowSyntheticDefaultImports?: boolean;
    esModuleInterop?: boolean;
    preserveSymlinks?: boolean;
    sourceRoot?: string;
    mapRoot?: string;
    inlineSourceMap?: boolean;
    inlineSources?: boolean;
    experimentalDecorators?: boolean;
    emitDecoratorMetadata?: boolean;
}
export interface Paths {
}
export declare namespace TSConfigParser {
    function toTsConfigData(json: string): TSConfigData;
    function tsConfigDataToJson(value: TSConfigData): string;
}
