import * as dgram from "dgram";
import { Buffer } from "node:buffer";
import { DnsHeader } from "./dnsHeader";
import { DnsQuestion } from "./dnsQuestion";

const udpSocket: dgram.Socket = dgram.createSocket("udp4");

udpSocket.bind(2053, "127.0.0.1");


if (udpSocket) {
	console.log("Server created");
}

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
	console.log(data.toString());
	try {
		console.log(
			`Received data from ${remoteAddr.address}:${remoteAddr.port}`,
		);
		const header = new DnsHeader();
		const question = new DnsQuestion("codecrafters.io");
		const encodedHeader: Buffer = header.encode();
		const encodedQuestion: Buffer = question.encode();

		console.log(encodedQuestion);
		console.log(encodedQuestion.toString())
		const finalBuffer = Buffer.concat([new Uint8Array(encodedHeader), new Uint8Array(encodedQuestion)]);
		const response = new Uint8Array(finalBuffer);

		console.log(response);
		udpSocket.send(response, remoteAddr.port, remoteAddr.address);
	} catch (e) {
		console.log(`Error sending data: ${e}`);
	}
});
