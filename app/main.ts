import * as dgram from "dgram";
import { Buffer } from "node:buffer";
import { DnsHeader } from "./dnsHeader";

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
		const response = new Uint8Array(header.encode());
		console.log(response);
		udpSocket.send(response, remoteAddr.port, remoteAddr.address);
	} catch (e) {
		console.log(`Error sending data: ${e}`);
	}
});
