import {WebSocketServer, WebSocket} from 'ws';

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

function playerNameExistsAlready(players: Player[], newPlayerName: string) {
    const playerNames = players.map((player) => player.name);
    return playerNames.includes(newPlayerName);
}

function addPlayer(playerName: string, playerInitiative: number = 10) {
    if (!playerNameExistsAlready(initiativeList, playerName)) {
        const newPlayer: Player = {
            name: playerName,
            initiative: playerInitiative,
        }

        let index = 0;
        for (const player of initiativeList) {
            if (player.initiative < playerInitiative) {
                break;
            }
            index += 1;
        }
        initiativeList.splice(index, 0, newPlayer);
    }
}

function removePlayer(playerNameToRemove: string) {
    initiativeList = initiativeList.filter((player) => player.name !== playerNameToRemove);
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

function handleCommand(rawBody: string) {
    try {
        const body = JSON.parse(rawBody);
        const command = body['command'];
        switch (command.toLowerCase()) {
            case 'add':
                const playerName = body['data']['name'];
                const initiative = parseInt(body['data']['initiative']);
                addPlayer(playerName, initiative);
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
                removePlayer(body['data']);
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