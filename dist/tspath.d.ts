#! /usr/bin/env node
export declare class TSPath {
    private engine;
    private parsers;
    private projectPath;
    private preproc;
    constructor();
    private showInfo;
    /**
     * Display TSPath processor results
     * @param {TSPathResult} resultData
     */
    private displayResults;
    private execute;
    /**
     * Execute the parser engine
     * @param {string} projectPath
     */
    private processPath;
}
