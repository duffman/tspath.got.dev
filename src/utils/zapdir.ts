/*=--------------------------------------------------------------=

 TSPath - Typescript Path Resolver

 Author : Patrik Forsberg
 Email  : patrik.forsberg@coldmind.com
 GitHub : https://github.com/duffman

 This software is subject to the LGPL v2 License, please find
 the full license attached in LICENCE.md

 =---------------------------------------------------------------=

 The ZapDir source code have

 This file is part of the TypeScript Path Igniter Project:
 https://github.com/duffman/ts-path-igniter

 Author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 Date: 2017-09-02

 =---------------------------------------------------------------= */

import * as fs       from "fs";
import * as path     from "path";
import { Utils }     from "../utils";
import { TS_CONFIG } from "../type-definitions";

export class FileFindResult {
	constructor(
		public fileFound: boolean = false,
		public path: string = "",
		public result: string = ""
	)
	{}
}

export class ZapDir {
	/**
	 * File finder which traverses parent directories
	 * until a given filename is found.
	 * @param startPath
	 * @param filename
	 * @returns {FileFindResult}
	 */
	public static findFile(startPath: string, filename: string): FileFindResult {
		let result = new FileFindResult();
		let sep = path.sep;
		let parts = startPath.split(sep);

		let tmpStr: string = sep;

		for (let i = 0; i < parts.length; i++) {
			tmpStr = path.resolve(tmpStr, parts[i]);
			tmpStr = Utils.ensureTrailingPathDelimiter(tmpStr);
			parts[i] = tmpStr;
		}

		for (let i = parts.length-1; i > 0; i--) {
			tmpStr = parts[i];
			filename = path.resolve(tmpStr, TS_CONFIG);

			if (fs.existsSync(filename)) {
				result.fileFound = true;
				result.path = tmpStr;
				result.result = filename;
				break;
			}
		}

		return result;
	}
}