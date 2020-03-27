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
const tspath_settings_1 = require("./tspath-settings");
const chalk = require("chalk");
const log = console.log;
const PREFIX_SEP = ":::";
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["All"] = 0] = "All";
    LogLevel[LogLevel["Warning"] = 1] = "Warning";
    LogLevel[LogLevel["Error"] = 2] = "Error";
})(LogLevel || (LogLevel = {}));
class Log {
    static setLogLevel(level) {
    }
    static toDataString(data) {
        let result = "";
        if (typeof data === "string") {
            result = data;
        }
        return result;
    }
    static compileLog(label, data = null) {
        return data !== null ? `${label} ${PREFIX_SEP} ${Log.toDataString(data)}` : label;
    }
    static warning(label, data = null) {
        log(chalk.yellow(Log.compileLog(label, data)));
    }
    static info(label, data = null) {
        log(chalk.bold.yellow(Log.compileLog(label, data)));
    }
    static infoSummary(label, data = null) {
        log(chalk.bold.cyan(Log.compileLog(label, data)));
    }
    static error(label, data = null) {
        log(chalk.bold.red(Log.compileLog(label, data)));
    }
    static spit() {
        console.log(" ");
    }
    static log(logMessage, logData = null) {
        if (logData != null) {
            log(chalk.green(logMessage), logData);
        }
        else {
            log(chalk.yellow(logMessage));
        }
    }
    /**
     * Standard Debug Log
     *
     * @param caller - object, used to get class name
     * @param logMessage - The message to print
     * @param logData - Optional data such as data structures
     */
    static debug(caller, logMessage, logData = "") {
        if (tspath_settings_1.TSpathSettings.DebugMode) {
            log(chalk.cyan("#DEBUG :: " + caller.constructor.name + " :: " + logMessage), logData);
        }
    }
    static message(logMessage, logData = "") {
        log(chalk.white(logMessage), logData);
    }
    static internalError(source, logMessage, logData = "") {
        log(chalk.red("#ERROR :: " + source.constructor.name + " :: " + logMessage), logData);
    }
    static logCoreInfo(source, logMessage, logData = "") {
        log(chalk.cyan("#DEBUG :: " + source.constructor.name + " :: " + logMessage), logData);
    }
    static fatalError(errorMessage, error = null) {
        if (error == null) {
            log(chalk.white.underline.bgRed(errorMessage));
        }
        else {
            log(chalk.white.underline.bgRed(errorMessage), error);
        }
    }
    static logErrorMessage(errorMessage, error = null) {
        if (error == null)
            log(this.error(errorMessage));
        else
            log(this.error(errorMessage), error);
    }
    static logGreen(logMessage, logData = null) {
        logData = logData == null ? "" : logData;
        log(chalk.green(logMessage), logData);
    }
    static logYellow(logMessage, logData = "") {
        log(chalk.yellow(logMessage), logData);
    }
    static logCyan(logMessage, logData = "") {
        log(chalk.cyan(logMessage), logData);
    }
    static logBlue(logMessage, logData = "") {
        log(chalk.blue(logMessage), logData);
    }
    static logPurple(logMessage, logData = null) {
        if (logData == null)
            log(chalk.magenta(logMessage));
        else
            log(chalk.magenta(logMessage), logData);
    }
    static logImportant(prefix, logMessage) {
        log(chalk.bold.white.bgBlue("#" + prefix + ":") + chalk.white.bgMagenta(logMessage));
    }
}
Log.clrError = chalk.bold.red;
Log.clrWarning = chalk.bold.yellow;
exports.Log = Log;
