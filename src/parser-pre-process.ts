/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 * 2020-09-18
 */

import * as fs   from "fs";
import * as path from "path";
import { Log }   from "./tspath-log";

const SHE_BANG_PREFIX = '#!';

export class ParserPreProcess {
	private _instance: ParserPreProcess = null;
	private _debugMode: boolean;

	setDebugMode(value: boolean = true) {
		this._debugMode = value;
	}

	/**
	 * Simple non "thread safe" singleton implementation
	 * @param {boolean} debugMode
	 * @returns {ParserPreProcess}
	 */
	public instance(debugMode: boolean = false): ParserPreProcess {
		if (!this._instance) {
			this._instance = new ParserPreProcess();
			this._instance.setDebugMode(debugMode);
		}
		return this._instance;
	}

	public preProcessScript(sourceLines: string[]): string {
		let destLines: Array<string> = null;

		function appendToResult(dataRow: string): void {
			if (!destLines) {
				destLines = new Array<string>();
			}
			destLines.push(dataRow);
		}

		// Locate and strip any occurance of a "SHEBANG"
		let lineNum = 1;
		for (let row of sourceLines) {
			row = !row ? "" : row;

			if (row.trim().substr(0, SHE_BANG_PREFIX.length) === SHE_BANG_PREFIX) {
				Log.log(`"SHEBANG" prefix found at #${ lineNum }, skipping row!`);
				continue;
			}

			appendToResult(row); // TODO: Investigate: Will the trim affect us in any way??
			lineNum++;
		}

		let result = "";
		if (destLines && Array.isArray(destLines)) {
			result = destLines.join('\n');
		}

		return result;
	}

	public testExecuteData(fileData?: string): string {
		let scriptData = fileData ? fileData.split('\n') : [""];
		return this.preProcessScript(scriptData);
	}

	public testExecuteFilename(filename: string): string {
		let result: string = "";
		try {
			let fileData = fs.readFileSync(filename, "utf8");
			result       = this.testExecuteData(fileData);
		}
		catch (error) {
			Log.fatalError(`Error reading source file ${filename}`)
		}
		return result;
	}
}

////////////////////////////////////////////
// Test
////////////////////////////////////////////
const args = process.argv.slice(2);

if (args[0] === "testdata") {
	let fileData   = args[1];
	let test       = new ParserPreProcess();
	let result     = test.testExecuteData(fileData);

	Log.logGreen("Prepared data string");
	Log.logGreen("======================");
	Log.logCyan(result);

} else if (args[0] === "testfile") {
	let testFilenameParam = args[1];
	Log.debug("Given test filename ::", testFilenameParam);

	if (fs.existsSync(testFilenameParam)) {
		Log.logPurple(`Using contents of file "${testFilenameParam}`)
	} else if (testFilenameParam && !fs.existsSync(testFilenameParam)) {
		Log.logErrorMessage(`Given test file "${testFilenameParam}" not found!`);
		process.exit(404);
	} else {
		testFilenameParam = __filename;
		Log.logPurple(`Using current script file "${testFilenameParam}"`);
	}

	let test       = new ParserPreProcess();
	let result     = test.testExecuteFilename(testFilenameParam);

	Log.logGreen("Prepared file");
	Log.logGreen("================");
	Log.logCyan(result);
}

/*
const filename = testFile; // '/Users/patrik/Development/tspath.got.dev/src/tspath.ts';
let test       = new ParserPreProcess();
let result     = test.testExecuteFilename(filename);
*/
