import { Type, Class } from './enums/index';
import { Buffer } from 'buffer';

export class DnsAnswer {
	private name: Buffer;
	private type: Type;
	private class: Class;
	private ttl: number;
	private length: number;
	private data: number[];

	constructor(name: Buffer, type: Type, _class: Class) {
		this.name = name;
		this.class = _class;
		this.type = type;
		this.ttl = 60;
		this.length = 4;
		this.data = [8, 8, 8, 8];
	};

	public encode(): Buffer {
		const nonNameValues = Buffer.alloc(14);
		let offset = 0;
		nonNameValues.writeUint16BE(this.type, offset);
		offset += 2;
		nonNameValues.writeUint16BE(this.class, offset);
		offset += 2;
		nonNameValues.writeUint32BE(this.ttl, offset);
		offset += 4;
		nonNameValues.writeUint16BE(this.length, offset);
		offset += 2;

		for (let i = 0; i < this.data.length; i++) {
			nonNameValues.writeUintBE(this.data[i], offset, 1);
			offset++;
		}

		return Buffer.concat([new Uint8Array(this.name), new Uint8Array(nonNameValues)]);
	}
}
