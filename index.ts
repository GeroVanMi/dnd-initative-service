import {WebSocketServer, WebSocket} from 'ws';

const PORT = 8080;
const webSocketServer = new WebSocketServer({port: PORT});
console.log('Started WebSocket Server on ws://localhost:' + PORT);

let sockets: WebSocket[] = [];
let initiativeList: string[] = [];

function sendUpdatedList() {
    for (const socket of sockets) {
        socket.send(JSON.stringify(initiativeList));
    }
}

function addPlayer(playerName: string) {
    if (!initiativeList.includes(playerName)) {
        initiativeList.push(playerName);
    }
}

function removePlayer(playerNameToRemove: string) {
    initiativeList = initiativeList.filter((playerName) => playerName !== playerNameToRemove);
}

function continueToNextPlayer() {
    const firstElement = initiativeList.shift();
    if (firstElement != undefined) {
        initiativeList.push(firstElement);
    }
}

function returnToPreviousPlayer() {
    const lastElement = initiativeList.pop();
    if (lastElement != undefined) {
        initiativeList.unshift(lastElement);
    }
}

function handleCommand(data: string) {
    const commandParts = data.split(' ');
    const command = commandParts[0];
    switch (command.toLowerCase()) {
        case 'add':
            addPlayer(commandParts.slice(1).join(' '));
            sendUpdatedList();
            return;
        case 'next':
            continueToNextPlayer();
            sendUpdatedList();
            return;
        case 'previous':
            returnToPreviousPlayer();
            sendUpdatedList();
            return;
        case 'remove':
            removePlayer(commandParts.slice(1).join(' '));
            sendUpdatedList();
            return;
    }
}

webSocketServer.on('connection', function connection(webSocket: WebSocket) {
    console.log('Received new connection!');
    sockets.push(webSocket);

    webSocket.on('message', function message(data: Blob) {
        handleCommand(data.toString());
        console.log(`Command: ${data.toString()}`);
        console.log(initiativeList);
    });

    webSocket.on('close', (disconnectedWebSocket: WebSocket) => {
        console.log('Connection terminated by client.');
        sockets = sockets.filter((currentSocket) => disconnectedWebSocket !== currentSocket);
    });

    console.log(initiativeList);
    sendUpdatedList();
});