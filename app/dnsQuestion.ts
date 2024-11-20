import { Buffer } from 'buffer';
import { Type, Class } from './enums/index';

export class DnsQuestion {
	private name: string;
	private type: Type;
	private class: Class;
	private labelSequenceName: Buffer | undefined;


	constructor(question: Buffer) {
		console.log(question);

		const test = question.subarray(0, -4);
		console.log(test);
		this.name = 'codecrafters.io';
		this.type = Type.A;
		this.class = Class.IN;
	}

	public encode(): Buffer {

		const encodedName = new Uint8Array(this.getNameInLabelSequenceFormat());

		const flags = Buffer.alloc(4);
		flags.writeUInt16BE(this.type, 0);
		flags.writeUInt16BE(this.class, 2);

		return Buffer.concat([encodedName, new Uint8Array(flags)]);
	}

	public getNameInLabelSequenceFormat(): Buffer {
		if (this.labelSequenceName) {
			return this.labelSequenceName
		}

		// encode the name
		const tokens: string[] = this.name.split('.');
		const nameLength = 1 + tokens.reduce((acc, token) => {
			return acc + token.length + 1;
		}, 0);

		const labelSequenceName = Buffer.alloc(nameLength);

		let offset = 0;
		for (let i = 0; i < tokens.length; i++) {
			labelSequenceName.writeUintBE(tokens[i].length, offset, 1);
			offset++;
			labelSequenceName.write(tokens[i], offset);
			offset += tokens[i].length;
		}

		this.labelSequenceName = labelSequenceName;
		return labelSequenceName;
	}
} 
