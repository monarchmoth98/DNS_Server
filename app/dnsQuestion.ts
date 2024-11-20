import { Buffer } from 'buffer';
import { Type, Class } from './enums/index';

export class DnsQuestion {
	private name: Buffer;
	private type: Type;
	private class: Class;


	constructor(question: Buffer) {
		this.name = question.subarray(0, -4);
		console.log("Question name: ", this.name);
		const nameLength = this.name.length;
		console.log("Name Length", nameLength);
		this.type = question.readUInt16BE(nameLength);
		console.log("Question Type: ", this.type);
		this.class = question.readUint16BE(nameLength + 2);
		console.log("Question Class: ", this.class);
	}

	public encode(): Buffer {
		const flags = Buffer.alloc(4);
		flags.writeUInt16BE(this.type);
		flags.writeUInt16BE(this.class, 2);
		const encodedQuestion = Buffer.concat([new Uint8Array(this.name), new Uint8Array(flags)]);
		console.log("\nEncoded Question: ", encodedQuestion);
		return encodedQuestion;
	}

	public getName(): Buffer {
		return this.name;
	}

	public getType() {
		return this.type;
	}

	public getClass() {
		return this.class;
	}
} 
