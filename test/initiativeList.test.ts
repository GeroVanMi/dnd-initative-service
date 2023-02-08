import {
    addPlayer,
    continueToNextPlayer,
    playerNameExistsAlready,
    removePlayer,
    returnToPreviousPlayer
} from "../src/InitiativeList";
import {Player} from "../src/Player";

const player1: Player = {
    name: 'player1',
    initiative: 10,
}

const player2: Player = {
    name: 'player2',
    initiative: 20,
}

const player3: Player = {
    name: 'player3',
    initiative: 15,
}

const player4: Player = {
    name: 'player4',
    initiative: 5,
}

test('Check if a player name exists already', () => {
    const startPlayerList: Player[] = [
        player1,
    ];
    expect(playerNameExistsAlready(startPlayerList, player1.name)).toBe(true);

    const expectedPlayerList: Player[] = [
        player2,
    ];
    expect(playerNameExistsAlready(expectedPlayerList, player1.name)).toBe(false);
});

test('Add a player to an empty player list.', () => {
    const playerList = [];
    const expectedPlayerList: Player[] = [
        player1,
    ];
    expect(addPlayer(playerList, player1.name, player1.initiative)).toStrictEqual(expectedPlayerList);
});

test('Add a player with higher initiative player list.', () => {
    const playerList: Player[] = [
        player1,
    ];
    const expectedPlayerList: Player[] = [
        player2,
        player1,
    ];
    expect(addPlayer(playerList, player2.name, player2.initiative)).toStrictEqual(expectedPlayerList);
});

test('Add a player with lower initiative player list.', () => {
    const playerList: Player[] = [
        player1,
    ];
    const expectedPlayerList: Player[] = [
        player1,
        player4,
    ];
    expect(addPlayer(playerList, player4.name, player4.initiative)).toStrictEqual(expectedPlayerList);
});

test('Add a player between two other players.', () => {
    const playerList: Player[] = [
        player3,
        player1,
        player2,
    ];
    const expectedPlayerList: Player[] = [
        player3,
        player1,
        player4,
        player2,
    ];
    expect(addPlayer(playerList, player4.name, player4.initiative)).toStrictEqual(expectedPlayerList);
});

test('Continue to next player', () => {
    const playerList: Player[] = [
        player1,
        player2,
        player3
    ];
    const expectedPlayerList: Player[] = [
        player2,
        player3,
        player1,
    ];
    expect(continueToNextPlayer(playerList)).toStrictEqual(expectedPlayerList);
});

test('Return to previous player', () => {
    const playerList: Player[] = [
        player1,
        player2,
        player3,
    ];
    const expectedPlayerList: Player[] = [
        player3,
        player1,
        player2,
    ];
    expect(returnToPreviousPlayer(playerList)).toStrictEqual(expectedPlayerList);
});

test('Remove a player', () => {
    const playerList: Player[] = [
        player1,
        player2,
        player3,
    ];
    const expectedPlayerList: Player[] = [
        player1,
        player2,
    ];
    expect(removePlayer(playerList, player3.name)).toStrictEqual(expectedPlayerList);
});
