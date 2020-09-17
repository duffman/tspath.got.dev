#! /usr/bin/env node

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

const pkg      = require('../package.json');
let fs         = require("fs");
let path       = require("path");
let Confirm    = require('prompt-confirm');
let yargs      = require("yargs").argv;

import { TSPathResult } from "./tspath-result-model";
import { ParserEngine }     from "./parser-engine";
import { ParentFileFinder } from "./utils/parent-file-finder";
import { TS_CONFIG }        from "./type-definitions";
import { ProcessExecute }   from "./process-execute";
import { Log }              from "./tspath-log";
import { ITSPathParser }    from "./parsers/tspath-parser";
import { JsParser }         from "./parsers/js-parser";
import { DrawLogo }         from './misc/logo';


export class TSPath {
	private engine = new ParserEngine();
	private parsers: Array<ITSPathParser>;
	private projectPath: string;
	private preproc: string = null;

	constructor() {
		this.showInfo();

		let filter = ["js"];
		let force: boolean = (yargs.force || yargs.f);
		this.preproc = yargs.preproc;
		let projectPath = process.cwd();
		let compactOutput = yargs.preserve ? false : true;
		let findResult = ParentFileFinder.findFile(projectPath, TS_CONFIG);

		let scope = this;

		// Register Parsers
		this.parsers = new Array<ITSPathParser>();
		this.parsers.push(new JsParser());

		if (yargs.ext || yargs.filter) {
			let argFilter = yargs.ext ? yargs.ext : yargs.filter;
			filter = argFilter.split(",").map((ext) => {
				return ext.replace(/\s/g, "");
			});
		}

		if (filter.length === 0) {
			Log.fatalError("File filter missing!");
			process.exit(23 );
		}

		this.engine.compactMode = compactOutput;
		this.engine.setFileFilter(filter);

		if (yargs.preproc) {
			Log.logPurple("Running Process", yargs.preproc);
		}

		if (force && findResult.fileFound) {
			scope.execute(findResult.path);

		} else if (findResult.fileFound) {
			let confirm = new Confirm("Process project at: <"  + findResult.path +  "> ?")
				.ask((answer) => {
					if (answer) {
						scope.execute(findResult.path);
					}
				});

		} else {
			Log.fatalError("No project root found!");
		}
	}

	private showInfo() {
		DrawLogo();
		Log.info("TSPath ", pkg.version);
		Log.info("Experimental Version");
	}

	/**
	 * Display TSPath processor results
	 * @param {TSPathResult} resultData
	 */
	private displayResults(resultData: TSPathResult) {
		console.log("pokpokpok ::::", resultData);
		Log.info("Total files processed:", resultData.nrFilesProcessed);
		Log.info("Total paths processed:", resultData.nrPathsProcessed);

		Log.infoSummary(`Operation took: ${resultData.processTime} ms`);
		Log.logGreen(`Project is prepared, now run it normally!`);
	}

	private execute(projectPath: string): void {
		if (!this.preproc) {
			this.processPath(projectPath);
			return;
		}

		let proc = new ProcessExecute();

		proc.execute(this.preproc).then((success) => {
			if (!success) {
				console.log("Prepr failed!");
				return;
			}

			this.processPath(projectPath);

		}).catch((err) => {
			Log.error("Compile error", err)
		});

	}

	/**
	 * Execute the parser engine
	 * @param {string} projectPath
	 */
	private processPath(projectPath: string): void {
		if (this.engine.setProjectPath(projectPath)) {
			this.engine.execute().then((result) => {
				this.displayResults(result);
			}).catch((err) => {
				Log.error("Parser Error", err);
			});
		}
	}
}

let tspath = new TSPath();
