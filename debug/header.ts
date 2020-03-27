

export enum License {
	None,
	GPL,
	LGPL2,
	LGPL21,
	Custom
}

export class TSPathFileHeader {
	constructor(
		public text: string,
		public date: Date,
		public license: License,
		public author: string,
		public email: string,
		public repo: string,
		public custom: string = ""
	) {}
}

let lic = new TSPathFileHeader(
		"Copyright", new Date(),
		License.LGPL21,
		"Patrik Forsberg",
		"patrik.forsberg@coldmind.com",
		"",
		""
);

console.log( JSON.stringify(lic) );