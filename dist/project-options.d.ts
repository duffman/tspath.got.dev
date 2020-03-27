import { ISettings } from "./type-definitions";
import { TSConfigData } from "./parsers/tsconfig-parser";
export declare class ProjectOptions {
    tsConfig: TSConfigData;
    outDir: string;
    baseUrl: string;
    pathMappings: ISettings;
    excludePaths: Array<string>;
    private processMappings;
    private parseExclude;
    constructor(projectPath: string, tsConfig: TSConfigData);
}
