import {WebSocketServer, WebSocket} from 'ws';
import {addPlayer, continueToNextPlayer, removePlayer, returnToPreviousPlayer} from "./src/InitiativeList";

const PORT = 9002;
const webSocketServer = new WebSocketServer({port: PORT});
console.log('Started WebSocket Server on ws://localhost:' + PORT);

type Player = {
    name: string,
    initiative: number,
}

let sockets: WebSocket[] = [];
let initiativeList: Player[] = [];

function sendUpdatedList() {
    for (const socket of sockets) {
        socket.send(JSON.stringify(initiativeList));
    }
}

function handleCommand(rawBody: string) {
    try {
        const body = JSON.parse(rawBody);
        const command = body['command'];
        switch (command.toLowerCase()) {
            case 'add':
                const playerName = body['data']['name'];
                const initiative = parseInt(body['data']['initiative']);
                initiativeList = addPlayer(initiativeList, playerName, initiative);
                sendUpdatedList();
                return;
            case 'next':
                initiativeList = continueToNextPlayer(initiativeList);
                sendUpdatedList();
                return;
            case 'previous':
                initiativeList = returnToPreviousPlayer(initiativeList);
                sendUpdatedList();
                return;
            case 'remove':
                initiativeList = removePlayer(initiativeList, body['data']);
                sendUpdatedList();
                return;
        }
    } catch (error) {
        console.error('Probably failed to parse JSON message:');
        console.error(rawBody);
        console.error(error);
        return;
    }
}

webSocketServer.on('connection', function connection(webSocket: WebSocket) {
    console.log('Received new connection!');
    sockets.push(webSocket);

    webSocket.on('message', function message(data: Blob) {
        handleCommand(data.toString());
        console.log(`Received message: ${data.toString()}`);
        console.log(initiativeList);
    });

    webSocket.on('close', (disconnectedWebSocket: WebSocket) => {
        console.log('Connection terminated by client.');
        sockets = sockets.filter((currentSocket) => disconnectedWebSocket !== currentSocket);
    });

    console.log(initiativeList);
    sendUpdatedList();
});