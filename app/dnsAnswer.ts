import type { DnsQuestion } from './dnsQuestion';
import { Type, Class } from './enums/index';
import { Buffer } from 'buffer';

interface DnsAnswer {
	name: Buffer,
	type: Type,
	class: Class,
	ttl: number,
	length: number,
	data: number[],
}

export class DnsAnswers {
	private dnsAnswers: DnsAnswer[];

	constructor(questions: DnsQuestion[]) {
		this.dnsAnswers = [];
		for (let i = 0; i < questions.length; i++) {
			const answer: DnsAnswer = {
				"name": questions[i].name,
				"type": questions[i].type,
				"class": questions[i].class,
				"ttl": 60,
				"length": 4,
				"data": [8, 8, 8, 8]
			}
			this.dnsAnswers.push(answer);
		}
	}
	public encode(): Buffer {
		const encodedAnswer = [];
		for (let answer of this.dnsAnswers) {
			const nonNameValues = Buffer.alloc(14);
			let offset = 0;
			nonNameValues.writeUint16BE(answer.type, offset);
			offset += 2;
			nonNameValues.writeUint16BE(answer.class, offset);
			offset += 2;
			nonNameValues.writeUint32BE(answer.ttl, offset);
			offset += 4;
			nonNameValues.writeUint16BE(answer.length, offset);
			offset += 2;

			for (let i = 0; i < answer.data.length; i++) {
				nonNameValues.writeUintBE(answer.data[i], offset, 1);
				offset++;
			}
			encodedAnswer.push(new Uint8Array(answer.name), new Uint8Array(nonNameValues));
		}

		return Buffer.concat(encodedAnswer);
	}
}
