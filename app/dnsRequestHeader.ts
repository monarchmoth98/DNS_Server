import { Buffer } from "node:buffer";

export class DnsRequestHeader {
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

	constructor(header: Buffer) {
		// ID
		this.id = header.readUint16BE(0);

		// read the next two bytes and find the bits that correspond to each flag
		const flags = header.readUint16BE(2);
		console.log(flags.toString(2));
		this.queryResponse = flags >> 15 & 1;
		console.log(this.queryResponse);
		this.opcode = flags >> 11 & 15;
		console.log("opcode", this.opcode);
		this.aa = flags >> 10 & 1;
		console.log("aa", this.aa);
		this.truncation = flags >> 9 & 1;
		console.log("truncation", this.truncation);
		this.recursionDesired = flags >> 8 & 1;
		console.log("rd", this.recursionDesired);
		this.recursionAvailable = flags >> 7 & 1;
		console.log("ra", this.recursionAvailable);
		this.reserved = flags >> 4 & 7;
		console.log("reserved", this.reserved);
		this.responseCode = flags >> 0 & 15;
		console.log("response Code", this.responseCode);

		this.questionCount = header.readUint16BE(4);
		this.answerRecordCount = header.readUint16BE(6);
		this.authorityRecordCount = header.readUint16BE(8);
		this.additionalRecordCount = header.readUint16BE(10);
	};

	public getId() {
		return this.id;
	}

	public getOpcode() {
		return this.opcode;
	}

	public getRecursionDesired() {
		return this.recursionDesired;
	}
} 
