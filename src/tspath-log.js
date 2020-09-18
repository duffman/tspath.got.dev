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
exports.__esModule = true;
var tspath_settings_1 = require("./tspath-settings");
var chalk = require("chalk");
var log = console.log;
var PREFIX_SEP = ":::";
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["All"] = 0] = "All";
    LogLevel[LogLevel["Warning"] = 1] = "Warning";
    LogLevel[LogLevel["Error"] = 2] = "Error";
})(LogLevel || (LogLevel = {}));
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.setLogLevel = function (level) {
    };
    Log.toDataString = function (data) {
        var result = "";
        if (typeof data === "string") {
            result = data;
        }
        return result;
    };
    Log.compileLog = function (label, data) {
        if (data === void 0) { data = null; }
        return data !== null ? label + " " + PREFIX_SEP + " " + Log.toDataString(data) : label;
    };
    Log.warning = function (label, data) {
        if (data === void 0) { data = null; }
        log(chalk.yellow(Log.compileLog(label, data)));
    };
    Log.info = function (label, data) {
        if (data === void 0) { data = null; }
        log(chalk.bold.yellow(Log.compileLog(label, data)));
    };
    Log.infoSummary = function (label, data) {
        if (data === void 0) { data = null; }
        log(chalk.bold.cyan(Log.compileLog(label, data)));
    };
    Log.error = function (label, data) {
        if (data === void 0) { data = null; }
        log(chalk.bold.red(Log.compileLog(label, data)));
    };
    Log.spit = function () {
        console.log(" ");
    };
    Log.log = function (logMessage, logData) {
        if (logData === void 0) { logData = null; }
        if (logData != null) {
            log(chalk.green(logMessage), logData);
        }
        else {
            log(chalk.yellow(logMessage));
        }
    };
    /**
     * Standard Debug Log
     *
     * @param caller - object, used to get class name
     * @param logMessage - The message to print
     * @param logData - Optional data such as data structures
     */
    Log.debug = function (caller, logMessage, logData) {
        if (logData === void 0) { logData = ""; }
        if (tspath_settings_1.TSpathSettings.DebugMode) {
            log(chalk.cyan("#DEBUG :: " + caller.constructor.name + " :: " + logMessage), logData);
        }
    };
    Log.message = function (logMessage, logData) {
        if (logData === void 0) { logData = ""; }
        log(chalk.white(logMessage), logData);
    };
    Log.internalError = function (source, logMessage, logData) {
        if (logData === void 0) { logData = ""; }
        log(chalk.red("#ERROR :: " + source.constructor.name + " :: " + logMessage), logData);
    };
    Log.logCoreInfo = function (source, logMessage, logData) {
        if (logData === void 0) { logData = ""; }
        log(chalk.cyan("#DEBUG :: " + source.constructor.name + " :: " + logMessage), logData);
    };
    Log.fatalError = function (errorMessage, error) {
        if (error === void 0) { error = null; }
        if (error == null) {
            log(chalk.white.underline.bgRed(errorMessage));
        }
        else {
            log(chalk.white.underline.bgRed(errorMessage), error);
        }
    };
    Log.logErrorMessage = function (errorMessage, error) {
        if (error === void 0) { error = null; }
        if (error == null) {
            log(this.error(errorMessage));
        }
        else {
            log(this.error(errorMessage), error);
        }
    };
    Log.logGreen = function (logMessage, logData) {
        if (logData === void 0) { logData = null; }
        logData = logData == null ? "" : logData;
        log(chalk.green(logMessage), logData);
    };
    Log.logYellow = function (logMessage, logData) {
        if (logData === void 0) { logData = ""; }
        log(chalk.yellow(logMessage), logData);
    };
    Log.logCyan = function (logMessage, logData) {
        if (logData === void 0) { logData = ""; }
        log(chalk.cyan(logMessage), logData);
    };
    Log.logBlue = function (logMessage, logData) {
        if (logData === void 0) { logData = ""; }
        log(chalk.blue(logMessage), logData);
    };
    Log.logPurple = function (logMessage, logData) {
        if (logData === void 0) { logData = null; }
        if (logData == null) {
            log(chalk.magenta(logMessage));
        }
        else {
            log(chalk.magenta(logMessage), logData);
        }
    };
    Log.logImportant = function (prefix, logMessage) {
        log(chalk.bold.white.bgBlue("#" + prefix + ":") + chalk.white.bgMagenta(logMessage));
    };
    Log.clrError = chalk.bold.red;
    Log.clrWarning = chalk.bold.yellow;
    return Log;
}());
exports.Log = Log;
