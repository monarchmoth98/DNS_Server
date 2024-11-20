import { Buffer } from "node:buffer";

export class DnsResponseHeader {
	private id: number;
	private queryResponse: number;
	private opcode: number;
	private aa: number;
	private truncation: number;
	private recursionDesired: number;
	private recursionAvailable: number;
	private reserved: number;
	private responseCode: number;
	private questionCount: number;
	private answerRecordCount: number;
	private authorityRecordCount: number;
	private additionalRecordCount: number;

	constructor(id: number, opcode: number, recursionDesired: number) {
		console.log("ID of response", id);
		console.log("Opcode of response", opcode);
		console.log("recursion desired", recursionDesired);
		// ID
		this.id = id;
		this.queryResponse = 1;
		this.opcode = opcode;
		this.aa = 0;
		this.truncation = 0;
		this.recursionDesired = recursionDesired;
		this.recursionAvailable = 0;
		this.reserved = 0;
		this.responseCode = 0;
		this.questionCount = 1;
		this.answerRecordCount = 1;
		this.authorityRecordCount = 0;
		this.additionalRecordCount = 0;
	};

	public encode(): Buffer {
		const header: Buffer = Buffer.alloc(12);

		// write the id
		header.writeUint16BE(this.id, 0);

		// create byte from flag
		let byte = 0;
		byte |= this.queryResponse << 15;
		byte |= this.opcode << 11;
		byte |= this.aa << 10;
		byte |= this.truncation << 9;
		byte |= this.recursionDesired << 8;
		byte |= this.recursionAvailable << 7;
		byte |= this.reserved << 4;
		byte |= this.opcode === 0 ? this.responseCode : 4 << 0;

		header.writeUint16BE(byte, 2);

		header.writeUint16BE(this.questionCount, 4);

		header.writeUint16BE(this.answerRecordCount, 6);

		header.writeUint16BE(this.authorityRecordCount, 8);

		header.writeUint16BE(this.additionalRecordCount, 10);

		return header;
	}
}
