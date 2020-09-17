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
const tspath_result_model_1 = require("./tspath-result-model");
let fs = require("fs");
let path = require('path');
let esprima = require("esprima");
let escodegen = require("escodegen");
let chalk = require("chalk");
const utils_1 = require("./utils");
const json_comment_stripper_1 = require("./utils/json-comment-stripper");
const project_options_1 = require("./project-options");
const type_definitions_1 = require("./type-definitions");
const type_definitions_2 = require("./type-definitions");
const tsconfig_parser_1 = require("./parsers/tsconfig-parser");
const os = require("os");
const tspath_log_1 = require("./tspath-log");
const tspath_settings_1 = require("./tspath-settings");
const log = console.log;
class ParserEngine {
    constructor() {
        this.nrFilesProcessed = 0;
        this.nrPathsProcessed = 0;
        this.compactMode = true;
    }
    exit(code = 5) {
        console.log("Terminating...");
        process.exit(code);
    }
    setProjectPath(projectPath) {
        if (!utils_1.Utils.isEmpty(projectPath) && !this.validateProjectPath(projectPath)) {
            log(chalk.red.bold("Project Path \"" + chalk.underline(projectPath) + "\" is invalid!"));
            return false;
        }
        this.projectPath = projectPath;
        return true;
    }
    /**
     * Set the accepted file extensions, ensure leading . (dot)
     * @param {Array<string>} filter
     */
    setFileFilter(filter) {
        this.fileFilter = filter.map((e) => {
            return !e.startsWith(".") ? "." + e : e;
        });
    }
    validateProjectPath(projectPath) {
        let result = true;
        let configFile = utils_1.Utils.ensureTrailingPathDelimiter(projectPath);
        configFile += type_definitions_1.TS_CONFIG;
        if (!fs.existsSync(projectPath)) {
            result = false;
        }
        if (!fs.existsSync(configFile)) {
            log("TypeScript Compiler Configuration file " + chalk.underline.bold(type_definitions_1.TS_CONFIG) + " is missing!");
        }
        return result;
    }
    /**
     * Attempts to read the name property form package.json
     * @returns {string}
     */
    readProjectName() {
        let commentStripper = new json_comment_stripper_1.JsonCommentStripper();
        let projectName = null;
        let filename = path.resolve(this.projectPath, "package.json");
        if (fs.existsSync(filename)) {
            let contents = fs.readFileSync(filename, 'utf8');
            contents = commentStripper.stripComments(contents);
            let jsonObj = JSON.parse(contents);
            projectName = jsonObj.name;
            if (tspath_settings_1.TSpathSettings.DebugMode) {
                tspath_log_1.Log.info("---");
                tspath_log_1.Log.info("Package contents:");
                tspath_log_1.Log.info(contents);
                tspath_log_1.Log.info("---");
            }
        }
        return projectName;
    }
    /**
     * Parse project and resolve paths
     */
    execute() {
        const PROCESS_TIME = "Operation finished in";
        console.time(PROCESS_TIME);
        let tickStart = new Date().getTime();
        if (!this.validateProjectPath(this.projectPath)) {
            log(chalk.bold.red("Invalid project path"));
            this.exit(10);
        }
        this.projectOptions = this.readConfig();
        let projectName = this.readProjectName();
        if (!utils_1.Utils.isEmpty(projectName)) {
            log(chalk.yellow("Parsing project: ") + chalk.bold(projectName) + " " + chalk.underline(this.projectPath));
        }
        else {
            log(chalk.yellow.bold("Parsing project at: ") + '"' + this.projectPath + '"');
        }
        this.appRoot = path.resolve(this.projectPath, this.projectOptions.baseUrl);
        this.distRoot = path.resolve(this.projectPath, this.projectOptions.outDir);
        let fileList = new Array();
        return new Promise((resolve, reject) => {
            try {
                this.walkSync(this.distRoot, fileList, ".js");
                for (let i = 0; i < fileList.length; i++) {
                    let filename = fileList[i];
                    this.processFile(filename);
                }
                let processTime = (new Date().getTime() - tickStart);
                let result = new tspath_result_model_1.TSPathResult(true, this.nrFilesProcessed, this.nrPathsProcessed, processTime);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /**
     *
     * @param sourceFilename
     * @param jsRequire - require in javascript source "require("jsRequire")
     * @returns {string}
     */
    getRelativePathForRequiredFile(sourceFilename, jsRequire) {
        let options = this.projectOptions;
        for (let alias in options.pathMappings) {
            let mapping = options.pathMappings[alias];
            //TODO: Handle * properly
            alias = utils_1.Utils.stripWildcard(alias);
            mapping = utils_1.Utils.stripWildcard(mapping);
            // 2018-06-02: Workaround for bug with same prefix Aliases e.g @db and @dbCore
            // Cut alias prefix for mapping comparison
            let requirePrefix = jsRequire.substring(0, jsRequire.indexOf(path.sep));
            if (requirePrefix == alias) {
                let result = jsRequire.replace(alias, mapping);
                utils_1.Utils.replaceDoubleSlashes(result);
                result = utils_1.Utils.ensureTrailingPathDelimiter(result);
                let absoluteJsRequire = path.join(this.distRoot, result);
                let sourceDir = path.dirname(sourceFilename);
                let relativePath = path.relative(sourceDir, absoluteJsRequire);
                /* If the path does not start with .. it´ not a sub directory
                 * as in ../ or ..\ so assume it´ the same dir...
                 */
                if (relativePath[0] != ".") {
                    relativePath = "./" + relativePath;
                }
                jsRequire = relativePath;
                break;
            }
        }
        return jsRequire;
    }
    /**
     * Processes the filename specified in require("filename")
     * @param node
     * @param sourceFilename
     * @returns {any}
     */
    processJsRequire(node, sourceFilename) {
        let resultNode = node;
        let requireInJsFile = utils_1.Utils.safeGetAstNodeValue(node);
        /* Only proceed if the "require" contains a full file path, not
         * single references like "inversify"
         */
        if (!utils_1.Utils.isEmpty(requireInJsFile) && utils_1.Utils.fileHavePath(requireInJsFile)) {
            let relativePath = this.getRelativePathForRequiredFile(sourceFilename, requireInJsFile);
            resultNode = { type: "Literal", value: relativePath, raw: relativePath };
            this.nrPathsProcessed++;
        }
        return resultNode;
    }
    preProcess() { }
    /**
     * Extracts all the requires from a single file and processes the paths
     * @param filename
     */
    processFile(filename) {
        const SHEBANG = "#!";
        this.nrFilesProcessed++;
        let scope = this;
        let inputSourceCode = fs.readFileSync(filename, type_definitions_2.FILE_ENCODING);
        let sbLine = null;
        //
        // Quick Hack: Parse file header to allow a single shebang
        // TODO: Consider parser pre step or even switching parser engine
        //
        if (inputSourceCode.substr(0, 2) === SHEBANG) {
            let eol = inputSourceCode.indexOf(os.EOL, 0);
            sbLine = inputSourceCode.substr(0, eol);
            tspath_log_1.Log.error("SHEBANG Detected" + sbLine + " :: ", filename);
            tspath_log_1.Log.error(`Stepping over Shebang "${SHEBANG}"...`);
            inputSourceCode = inputSourceCode.substr(eol, inputSourceCode.length);
        }
        let ast = null;
        try {
            ast = esprima.parse(inputSourceCode); //, { raw: true, tokens: true, range: true, comment: true });
        }
        catch (error) {
            console.log("Unable to parse file:", filename);
            console.log("Error:", error);
            this.exit();
        }
        this.traverseSynTree(ast, this, function (node) {
            if (node != undefined && node.type == "CallExpression" && node.callee.name == "require") {
                node.arguments[0] = scope.processJsRequire(node.arguments[0], filename);
            }
        });
        let option = { comment: true, format: { compact: this.compactMode, quotes: '"' } };
        let finalSource = escodegen.generate(ast, option);
        try {
            // Put back the shebang (if any)
            if (sbLine !== null) {
                finalSource = sbLine + os.EOL + finalSource;
            }
            this.saveFileContents(filename, finalSource);
        }
        catch (error) {
            log(chalk.bold.red("Unable to write file:"), filename);
            this.exit();
        }
    }
    /**
     * Saves file contents to disk
     * @param filename
     * @param fileContents
     */
    saveFileContents(filename, fileContents) {
        let error = false;
        fs.writeFileSync(filename, fileContents, type_definitions_2.FILE_ENCODING, error);
        if (error) {
            throw Error("Could not save file: " + filename);
        }
    }
    /**
     * Read and parse the TypeScript configuration file
     * @param configFilename
     */
    readConfig(configFilename = type_definitions_1.TS_CONFIG) {
        let fileName = path.resolve(this.projectPath, configFilename);
        let fileData = fs.readFileSync(path.resolve(this.projectPath, fileName), type_definitions_2.FILE_ENCODING);
        let jsonCS = new json_comment_stripper_1.JsonCommentStripper();
        fileData = jsonCS.stripComments(fileData);
        let tsConfig = tsconfig_parser_1.TSConfigParser.toTsConfigData(fileData);
        let compilerOpt = tsConfig.compilerOptions;
        let reqFields = [];
        reqFields["baseUrl"] = compilerOpt.baseUrl;
        reqFields["outDir"] = compilerOpt.outDir;
        for (let key in reqFields) {
            let field = reqFields[key];
            if (utils_1.Utils.isEmpty(field)) {
                log(chalk.red.bold("Missing required field:") + ' "' + chalk.bold.underline(key) + '"');
                this.exit(22);
            }
        }
        return new project_options_1.ProjectOptions(this.projectPath, tsConfig);
    }
    /**
     *
     * @param ast
     * @param scope
     * @param func
     */
    traverseSynTree(ast, scope, func) {
        func(ast);
        for (let key in ast) {
            if (ast.hasOwnProperty(key)) {
                let child = ast[key];
                if (typeof child === 'object' && child !== null) {
                    if (Array.isArray(child)) {
                        child.forEach(function (ast) {
                            scope.traverseSynTree(ast, scope, func);
                        });
                    }
                    else {
                        scope.traverseSynTree(child, scope, func);
                    }
                }
            }
        }
    }
    /**
     * Match a given file extension with the configured extensions
     * @param {string} fileExtension - ".xxx" or "xxx
     * @returns {boolean}
     */
    matchExtension(fileExtension) {
        if (utils_1.Utils.isEmpty(fileExtension) || this.fileFilter.length == 0)
            return false;
        return this.fileFilter.indexOf(fileExtension) > -1;
    }
    /**
     * Recursively walking a directory structure and collect files
     * @param dir
     * @param filelist
     * @param fileExtension
     * @returns {Array<string>}
     */
    walkSync(dir, filelist, fileExtension) {
        let scope = this;
        let files = fs.readdirSync(dir);
        filelist = filelist || [];
        fileExtension = fileExtension === undefined ? "" : fileExtension;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                filelist = this.walkSync(path.join(dir, file), filelist, fileExtension);
            }
            else {
                let tmpExt = path.extname(file);
                if ((fileExtension.length > 0 && scope.matchExtension(tmpExt))
                    || (fileExtension.length < 1)
                    || (fileExtension == "*.*")) {
                    let fullFilename = path.join(dir, file);
                    filelist.push(fullFilename);
                }
            }
        }
        return filelist;
    }
}
exports.ParserEngine = ParserEngine;
