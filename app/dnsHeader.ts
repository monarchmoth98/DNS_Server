export class DnsHeader {
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

	public encode(): Buffer {
		const header: Buffer = Buffer.alloc(12);

		// ID
		this.id = 1234;
		this.queryResponse = 1;
		this.opcode = 0;
		this.aa = 0;
		this.truncation = 0;
		this.recursionDesired = 0;
		this.recursionAvailable = 0;
		this.reserved = 0;
		this.responseCode = 0;
		this.questionCount = 0;
		this.answerRecordCount = 0;
		this.authorityRecordCount = 0;
		this.additionalRecordCount = 0;

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
		byte |= this.reserved << 3;
		byte |= this.responseCode << 0;

		console.log("BYTE Data: " + byte);
		header.writeUint16BE(byte, 2);

		header.writeUint16BE(this.questionCount, 4);

		header.writeUint16BE(this.answerRecordCount, 6);

		header.writeUint16BE(this.authorityRecordCount, 8);

		header.writeUint16BE(this.additionalRecordCount, 10);

		return header;
	}
}
