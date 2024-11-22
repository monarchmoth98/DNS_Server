import * as dgram from "dgram";
import { Buffer } from "node:buffer";
import { DnsQuestions } from "./dnsQuestion";
import { DnsAnswers } from "./dnsAnswer";
import { DnsRequestHeader } from "./dnsRequestHeader";
import { DnsResponseHeader } from "./dnsResponseHeader";

const udpSocket: dgram.Socket = dgram.createSocket("udp4");

udpSocket.bind(2053, "127.0.0.1");


if (udpSocket) {
	console.log("Server created");
}

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
	console.log(data.toString('hex'));
	console.log(data);
	try {
		console.log(
			`Received data from ${remoteAddr.address}:${remoteAddr.port}`,
		);

		// extract the header from the request:
		// first 12 bytes are the header. the rest is the request.
		const header = new DnsRequestHeader(data.subarray(0, 12));
		const responseHeader = new DnsResponseHeader(header.getId(), header.getOpcode(), header.getRecursionDesired(), header.getQuestionCount());

		const question = new DnsQuestions(data.subarray(12), header.getQuestionCount());
		const encodedQuestion = question.encode();

		// Encode the answer
		const answer = new DnsAnswers(question.getQuestions());
		const encodedAnswer = answer.encode();

		const finalBuffer = Buffer.concat([new Uint8Array(responseHeader.encode()), new Uint8Array(encodedQuestion), new Uint8Array(encodedAnswer)]);
		const response = new Uint8Array(finalBuffer);

		console.log("Response: ", response);
		udpSocket.send(response, remoteAddr.port, remoteAddr.address);
	} catch (e) {
		console.log(`Error sending data: ${e}`);
	}
});
