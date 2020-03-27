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

import {Log} from './tspath-log';

const { spawn } = require('child_process');

export class ProcessExecute {
	public execute(process: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const child = spawn(process, []);

			child.stdout.on('data', (chunk) => {
				// Data from standard output is here as buffers
				Log.debug("chunk", chunk.toString("utf8"));
			});

			// since these are streams, you can pipe them elsewhere
			//child.stderr.pipe(dest);

			child.on("close", (code) => {
				Log.debug("Child process exited with code", code);

				if (code == 0) {
					resolve(true)
				} else {
					resolve(false)
				}

			});
		});
	}
}
