import {Player} from "./Player";

function playerNameExistsAlready(players: Player[], newPlayerName: string): boolean {
    const playerNames = players.map((player) => player.name);
    return playerNames.includes(newPlayerName);
}

/**
 * Creates a new player in the initiative list, if the player name doesn't exist already.
 *
 * @param playerList
 * @param playerName
 * @param playerInitiative
 */
function addPlayer(playerList: Player[], playerName: string, playerInitiative: number = 10) {
    if (playerNameExistsAlready(playerList, playerName)) {
        return playerList;
    }

    const newPlayer: Player = {
        name: playerName,
        initiative: playerInitiative,
    }

    let index = 0;
    let previousInitiative = playerList[0]?.initiative;
    for (const player of playerList) {
        if (player.initiative < playerInitiative) {
            break;
        }
        if (player.initiative > previousInitiative) {
            break;
        }
        previousInitiative = player.initiative;
        index += 1;
    }
    playerList.splice(index, 0, newPlayer);

    return playerList;
}

function continueToNextPlayer(playerList: Player[]) {
    const firstElement = playerList.shift();
    if (firstElement != undefined) {
        playerList.push(firstElement);
    }
    return playerList
}

function returnToPreviousPlayer(playerList: Player[]) {
    const lastElement = playerList.pop();
    if (lastElement != undefined) {
        playerList.unshift(lastElement);
    }
    return playerList;
}

function removePlayer(playerList: Player[], playerNameToRemove: string) {
    return playerList.filter((player) => player.name !== playerNameToRemove);
}

export {
    addPlayer,
    playerNameExistsAlready,
    continueToNextPlayer,
    returnToPreviousPlayer,
    removePlayer,
}