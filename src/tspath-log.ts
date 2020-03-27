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

import { TSpathSettings } from './tspath-settings';

const chalk = require("chalk");
const log = console.log;
const PREFIX_SEP = ":::";

enum LogLevel {
	All,
	Warning,
	Error
}

export class Log{
	private static clrError = chalk.bold.red;
	private static clrWarning = chalk.bold.yellow;

	public static setLogLevel(level: LogLevel): void {
	}

	private static toDataString(data: any) {
		let result: string = "";

		if (typeof data === "string") {
			result = data as string;
		}

		return result;
	}

	private static compileLog(label: string, data: any = null): string {
		return data !== null ? `${label} ${PREFIX_SEP} ${Log.toDataString(data)}` : label;
	}

	public static warning(label: string, data: any = null) {
		log(chalk.yellow(
			Log.compileLog(label, data)
		));
	}

	public static info(label: string, data: any = null) {
		log(chalk.bold.yellow(
			Log.compileLog(label, data)
		));
	}

	public static infoSummary(label: string, data: any = null) {
		log(chalk.bold.cyan(
			Log.compileLog(label, data)
		));
	}

	public static error(label: string, data: any = null) {
		log(chalk.bold.red(
			Log.compileLog(label, data)
		));
	}

	public static spit() {
		console.log(" ");
	}

	public static log(logMessage: string, logData: any = null) {
		if (logData != null) {
			log(chalk.green(logMessage), logData);
		} else {
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
	public static debug(caller: any, logMessage: string, logData: any = "") {
		if (TSpathSettings.DebugMode) {
			log(chalk.cyan("#DEBUG :: " + caller.constructor.name + " :: " + logMessage), logData);
		}
	}

	public static message(logMessage: string, logData: any = "") {
		log(chalk.white(logMessage), logData);
	}

	public static internalError(source: any, logMessage: string, logData: any = "") {
		log(chalk.red("#ERROR :: " + source.constructor.name + " :: " + logMessage), logData);
	}

	public static logCoreInfo(source: any, logMessage: string, logData: any = "") {
		log(chalk.cyan("#DEBUG :: " + source.constructor.name + " :: " + logMessage), logData);
	}

	public static fatalError(errorMessage: string, error: Error = null) {
		if (error == null) {
			log(chalk.white.underline.bgRed(errorMessage));
		}
		else {
			log(chalk.white.underline.bgRed(errorMessage), error);
		}
	}

	public static logErrorMessage(errorMessage: string, error: Error = null) {
		if (error == null)
			log(this.error(errorMessage))
		else
			log(this.error(errorMessage), error);
	}

	public static logGreen(logMessage: string, logData: any = null) {
		logData = logData == null ? "" : logData;
		log(chalk.green(logMessage), logData);
	}

	public static logYellow(logMessage: string, logData: any = "") {
		log(chalk.yellow(logMessage), logData);
	}

	public static logCyan(logMessage: string, logData: any = "") {
		log(chalk.cyan(logMessage), logData);
	}

	public static logBlue(logMessage: string, logData: any = "") {
		log(chalk.blue(logMessage), logData);
	}

	public static logPurple(logMessage: string, logData: any = null) {
		if (logData == null)
			log(chalk.magenta(logMessage));
		else
			log(chalk.magenta(logMessage), logData);
	}

	public static logImportant(prefix: string, logMessage: string) {
		log(chalk.bold.white.bgBlue("#" + prefix + ":") + chalk.white.bgMagenta(logMessage));
	}
}
