"use strict";
/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 * 2020-09-18
 */
exports.__esModule = true;
var fs = require("fs");
var tspath_log_1 = require("./tspath-log");
var SHE_BANG_PREFIX = '#!';
var ParserPreProcess = /** @class */ (function () {
    function ParserPreProcess() {
        this._instance = null;
    }
    ParserPreProcess.prototype.setDebugMode = function (value) {
        if (value === void 0) { value = true; }
        this._debugMode = value;
    };
    /**
     * Simple non "thread safe" singleton implementation
     * @param {boolean} debugMode
     * @returns {ParserPreProcess}
     */
    ParserPreProcess.prototype.instance = function (debugMode) {
        if (debugMode === void 0) { debugMode = false; }
        if (!this._instance) {
            this._instance = new ParserPreProcess();
            this._instance.setDebugMode(debugMode);
        }
        return this._instance;
    };
    ParserPreProcess.prototype.preProcessScript = function (sourceLines) {
        var destLines = null;
        function appendToResult(dataRow) {
            if (!destLines) {
                destLines = new Array();
            }
            destLines.push(dataRow);
        }
        // Locate and strip any occurance of a "SHEBANG"
        var lineNum = 1;
        for (var _i = 0, sourceLines_1 = sourceLines; _i < sourceLines_1.length; _i++) {
            var row = sourceLines_1[_i];
            row = !row ? "" : row;
            if (row.trim().substr(0, SHE_BANG_PREFIX.length) === SHE_BANG_PREFIX) {
                tspath_log_1.Log.log("\"SHEBANG\" prefix found at #" + lineNum + ", skipping row!");
                continue;
            }
            appendToResult(row); // TODO: Investigate: Will the trim affect us in any way??
            lineNum++;
        }
        var result = "";
        if (destLines && Array.isArray(destLines)) {
            result = destLines.join('\n');
        }
        return result;
    };
    ParserPreProcess.prototype.testExecuteData = function (fileData) {
        var scriptData = fileData ? fileData.split('\n') : [""];
        return this.preProcessScript(scriptData);
    };
    ParserPreProcess.prototype.testExecuteFilename = function (filename) {
        var result = "";
        try {
            var fileData = fs.readFileSync(filename, "utf8");
            result = this.testExecuteData(fileData);
        }
        catch (error) {
            tspath_log_1.Log.fatalError("Error reading source file " + filename);
        }
        return result;
    };
    return ParserPreProcess;
}());
exports.ParserPreProcess = ParserPreProcess;
////////////////////////////////////////////
// Test
////////////////////////////////////////////
var args = process.argv.slice(2);
if (args[0] === "testdata") {
    var fileData = args[1];
    var test_1 = new ParserPreProcess();
    var result = test_1.testExecuteData(fileData);
    tspath_log_1.Log.logGreen("Prepared data string");
    tspath_log_1.Log.logGreen("======================");
    tspath_log_1.Log.logCyan(result);
}
else if (args[0] === "testfile") {
    var testFilenameParam = args[1];
    tspath_log_1.Log.debug("Given test filename ::", testFilenameParam);
    if (fs.existsSync(testFilenameParam)) {
        tspath_log_1.Log.logPurple("Using contents of file \"" + testFilenameParam);
    }
    else if (testFilenameParam && !fs.existsSync(testFilenameParam)) {
        tspath_log_1.Log.logErrorMessage("Given test file \"" + testFilenameParam + "\" not found!");
        process.exit(404);
    }
    else {
        testFilenameParam = __filename;
        tspath_log_1.Log.logPurple("Using current script file \"" + testFilenameParam + "\"");
    }
    var test_2 = new ParserPreProcess();
    var result = test_2.testExecuteFilename(testFilenameParam);
    tspath_log_1.Log.logGreen("Prepared file");
    tspath_log_1.Log.logGreen("================");
    tspath_log_1.Log.logCyan(result);
}
/*
const filename = testFile; // '/Users/patrik/Development/tspath.got.dev/src/tspath.ts';
let test       = new ParserPreProcess();
let result     = test.testExecuteFilename(filename);
*/
