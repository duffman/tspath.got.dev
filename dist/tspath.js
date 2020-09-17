#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('../package.json');
let fs = require("fs");
let path = require("path");
let Confirm = require('prompt-confirm');
let yargs = require("yargs").argv;
const parser_engine_1 = require("./parser-engine");
const parent_file_finder_1 = require("./utils/parent-file-finder");
const type_definitions_1 = require("./type-definitions");
const process_execute_1 = require("./process-execute");
const tspath_log_1 = require("./tspath-log");
const js_parser_1 = require("./parsers/js-parser");
const logo_1 = require("./misc/logo");
class TSPath {
    constructor() {
        this.engine = new parser_engine_1.ParserEngine();
        this.preproc = null;
        this.showInfo();
        let filter = ["js"];
        let force = (yargs.force || yargs.f);
        this.preproc = yargs.preproc;
        let projectPath = process.cwd();
        let compactOutput = yargs.preserve ? false : true;
        let findResult = parent_file_finder_1.ParentFileFinder.findFile(projectPath, type_definitions_1.TS_CONFIG);
        let scope = this;
        // Register Parsers
        this.parsers = new Array();
        this.parsers.push(new js_parser_1.JsParser());
        if (yargs.ext || yargs.filter) {
            let argFilter = yargs.ext ? yargs.ext : yargs.filter;
            filter = argFilter.split(",").map((ext) => {
                return ext.replace(/\s/g, "");
            });
        }
        if (filter.length === 0) {
            tspath_log_1.Log.fatalError("File filter missing!");
            process.exit(23);
        }
        this.engine.compactMode = compactOutput;
        this.engine.setFileFilter(filter);
        if (yargs.preproc) {
            tspath_log_1.Log.logPurple("Running Process", yargs.preproc);
        }
        if (force && findResult.fileFound) {
            scope.execute(findResult.path);
        }
        else if (findResult.fileFound) {
            let confirm = new Confirm("Process project at: <" + findResult.path + "> ?")
                .ask((answer) => {
                if (answer) {
                    scope.execute(findResult.path);
                }
            });
        }
        else {
            tspath_log_1.Log.fatalError("No project root found!");
        }
    }
    showInfo() {
        logo_1.DrawLogo();
        tspath_log_1.Log.info("TSPath ", pkg.version);
        tspath_log_1.Log.info("Experimental Version");
    }
    /**
     * Display TSPath processor results
     * @param {TSPathResult} resultData
     */
    displayResults(resultData) {
        console.log("pokpokpok ::::", resultData);
        tspath_log_1.Log.info("Total files processed:", resultData.nrFilesProcessed);
        tspath_log_1.Log.info("Total paths processed:", resultData.nrPathsProcessed);
        tspath_log_1.Log.infoSummary(`Operation took: ${resultData.processTime} ms`);
        tspath_log_1.Log.logGreen(`Project is prepared, now run it normally!`);
    }
    execute(projectPath) {
        if (!this.preproc) {
            this.processPath(projectPath);
            return;
        }
        let proc = new process_execute_1.ProcessExecute();
        proc.execute(this.preproc).then((success) => {
            if (!success) {
                console.log("Prepr failed!");
                return;
            }
            this.processPath(projectPath);
        }).catch((err) => {
            tspath_log_1.Log.error("Compile error", err);
        });
    }
    /**
     * Execute the parser engine
     * @param {string} projectPath
     */
    processPath(projectPath) {
        if (this.engine.setProjectPath(projectPath)) {
            this.engine.execute().then((result) => {
                this.displayResults(result);
            }).catch((err) => {
                tspath_log_1.Log.error("Parser Error", err);
            });
        }
    }
}
exports.TSPath = TSPath;
let tspath = new TSPath();
