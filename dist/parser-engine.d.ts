import { TSPathResult } from "./tspath-result-model";
import { ProjectOptions } from "./project-options";
export declare class ParserEngine {
    projectPath: string;
    nrFilesProcessed: number;
    nrPathsProcessed: number;
    appRoot: string;
    distRoot: string;
    compactMode: boolean;
    projectOptions: ProjectOptions;
    fileFilter: Array<string>;
    constructor();
    exit(code?: number): void;
    setProjectPath(projectPath: string): boolean;
    /**
     * Set the accepted file extensions, ensure leading . (dot)
     * @param {Array<string>} filter
     */
    setFileFilter(filter: Array<string>): void;
    private validateProjectPath;
    /**
     * Attempts to read the name property form package.json
     * @returns {string}
     */
    private readProjectName;
    /**
     * Parse project and resolve paths
     */
    execute(): Promise<TSPathResult>;
    /**
     *
     * @param sourceFilename
     * @param jsRequire - require in javascript source "require("jsRequire")
     * @returns {string}
     */
    getRelativePathForRequiredFile(sourceFilename: string, jsRequire: string): string;
    /**
     * Processes the filename specified in require("filename")
     * @param node
     * @param sourceFilename
     * @returns {any}
     */
    processJsRequire(node: any, sourceFilename: string): any;
    private preProcess;
    /**
     * Extracts all the requires from a single file and processes the paths
     * @param filename
     */
    private processFile;
    /**
     * Saves file contents to disk
     * @param filename
     * @param fileContents
     */
    saveFileContents(filename: string, fileContents: string): void;
    /**
     * Read and parse the TypeScript configuration file
     * @param configFilename
     */
    private readConfig;
    /**
     *
     * @param ast
     * @param scope
     * @param func
     */
    traverseSynTree(ast: any, scope: any, func: any): void;
    /**
     * Match a given file extension with the configured extensions
     * @param {string} fileExtension - ".xxx" or "xxx
     * @returns {boolean}
     */
    private matchExtension;
    /**
     * Recursively walking a directory structure and collect files
     * @param dir
     * @param filelist
     * @param fileExtension
     * @returns {Array<string>}
     */
    walkSync(dir: string, filelist: Array<string>, fileExtension?: string): string[];
}
