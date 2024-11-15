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
		const totalLength = 1 + 4 + tokens.reduce((acc, token) => {
			if (token === ".") {
				return acc + 1;
			}
			return acc + token.length + 1;
		}, 0);
		console.log('total length of Buffer for Question section: ', totalLength);

		const question = Buffer.alloc(totalLength);

		this.type = Type.A;
		this.class = Class.IN;

		let offset = 0;
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i] === '.') {
				question.write(tokens[i], offset);
				offset++;
				continue;
			}
			question.writeUintBE(tokens[i].length, offset, 1);
			question.write(tokens[i], offset + 1);
			offset += 1 + tokens[i].length;
			console.log(question.toString());
		}

		question.writeUInt16BE(this.type, offset);
		question.writeUInt16BE(this.class, offset + 2);
		return question
	}

} 
