import { Buffer } from 'buffer';
import { Type, Class } from './enums/index';

export interface DnsQuestion {
	name: Buffer,
	type: Type,
	class: Class
}

export class DnsQuestions {
	private questions: DnsQuestion[];

	constructor(question: Buffer, questionCount: number) {
		this.questions = [];
		console.log("Full Question: ", question);
		console.log("Question Count", questionCount);

		let qCounter = 0;
		let questionCopy = question;
		while (qCounter < questionCount) {
			// handle decompression
			const doubleOctet = questionCopy.readUInt16BE(0);
			const firstBitIsOne = doubleOctet >> 15 & 1;
			const secondBitIsOne = doubleOctet >> 14 & 1;
			if (firstBitIsOne && secondBitIsOne) {
				//  In this case we must decompress the label.
				const bufferIndex = (doubleOctet & 0b11111111111111) - 12; // to take the header into account we remove 12.
				console.log(bufferIndex.toString());
				const decompressedLabel: Buffer = this.decompress(question, bufferIndex);

				// append the flags back onto the decompressed label
				console.log(decompressedLabel);
				console.log(new Uint8Array(0));
				console.log(questionCopy.subarray(2, 6));
				const decompressedQuestion = Buffer.concat([new Uint8Array(decompressedLabel), new Uint8Array(0), new Uint8Array(questionCopy.subarray(2, 6))]);
				console.log(decompressedQuestion);

				this.writeBufferToQuestions(decompressedQuestion, decompressedQuestion.length - 5);
				qCounter++;
				questionCopy = questionCopy.subarray(3);
				continue;
			}

			const endIndex = questionCopy.findIndex((value) => {
				return value === 0;
			})
			this.writeBufferToQuestions(questionCopy, endIndex);
			questionCopy = questionCopy.subarray(endIndex + 5);
			console.log("Remaining part of the question to scan through: ", questionCopy);
			qCounter++;
		}
	}

	public encode(): Buffer {
		const bufferArray: Uint8Array[] = []
		for (let question of this.questions) {
			const flags = Buffer.alloc(4);
			flags.writeUInt16BE(question.type);
			flags.writeUInt16BE(question.class, 2);
			bufferArray.push(new Uint8Array(question.name));
			bufferArray.push(new Uint8Array(flags));
		}
		const encodedQuestion = Buffer.concat(bufferArray);
		console.log("\nEncoded Question: ", encodedQuestion);
		return encodedQuestion;
	}


	private decompress(question: Buffer, offset: number): Buffer {
		const startPoint = offset;
		while (question[offset] !== 0) {
			offset++;
		}
		const result = question.subarray(startPoint, offset);
		console.log("result from decompressing the question: \n", result);

		return result;
	}

	private writeBufferToQuestions(question: Buffer, length: number): void {
		const name = question.subarray(0, length + 1);// include the 0
		const type = question.readUInt16BE(length + 1);
		const _class = question.readUInt16BE(length + 3);

		this.questions.push({
			name: name,
			type: type,
			class: _class
		});
		console.log("Question name: ", name);
		console.log("Question name: ", name.toString());
		console.log("Question Type: ", type);
		console.log("Question Class: ", _class);
		return;
	}

	public getQuestions() {
		return this.questions;
	}
}
