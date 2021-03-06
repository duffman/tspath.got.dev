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
const tspath_log_1 = require("../tspath-log");
function DrawLogo() {
    tspath_log_1.Log.logGreen("  _______    _____        _    _          ");
    tspath_log_1.Log.logGreen(" |__   __|  |  __ \      | |  | |         ");
    tspath_log_1.Log.logGreen("    | | ___ | |__) |__ _ | |_ | |__       ");
    tspath_log_1.Log.logGreen("    | |/ __||  ___// _` || __|| '_ \      ");
    tspath_log_1.Log.logGreen("    | |\__ \| |   | (_| || |_ | | | |     ");
    tspath_log_1.Log.logGreen("    |_||___/|_|    \__,_| \__||_| |_| BETA");
    tspath_log_1.Log.logGreen("    TypeScript Path Resolver 2            ");
    tspath_log_1.Log.logGreen("                                          ");
}
exports.DrawLogo = DrawLogo;
