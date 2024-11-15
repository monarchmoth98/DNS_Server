import { Buffer } from 'buffer';

enum Type {
	A = 1,
	NS,
	MD,
	MF,
	CNAME,
	SOA,
	MB,
	MG,
	MR,
	NULL,
	WKS,
	PTR,
	HINFO,
	MINFO,
	MX,
	TXT
}

enum Class {
	IN = 1,
	CS,
	CH,
	HS
}

export class DnsQuestion {
	private name: string;
	private type: Type;
	private class: Class;


	constructor(name: string) {
		this.name = name
	}

	public encode(): Buffer {

		// encode the name
		const tokens: string[] = this.name.split(/(\.)/);
		console.log(tokens);
		const totalLength = 1 + tokens.reduce((acc, token) => {
			if (token === ".") {
				return acc + 1;
			}
			return acc + token.length + 1;
		}, 0);

		const question = Buffer.alloc(totalLength + 4);

		this.type = Type.A;
		this.class = Class.IN;
		question.writeUInt16BE(this.type, totalLength);
		question.writeUInt16BE(this.class, totalLength + 2);

		let offset = 0;
		for (let i = 0; i < tokens.length; i++) {
			console.log(tokens[i]);
			question.writeUintBE(tokens[i].length, offset, 1);
			question.write(tokens[i], offset + 1);
			offset += 1 + tokens[i].length;
		}

		return question
	}

} 
