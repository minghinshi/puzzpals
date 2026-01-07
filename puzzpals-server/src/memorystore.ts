import type { Grid } from "../../packages/puzzle-parser/dist/index.js";

type RoomEntry = {
    token: string;
    puzzleData: Grid;
}

const store = new Map<string, RoomEntry>();

function getRoom(token: string): RoomEntry | null {
    return store.get(token) || null;
}

function createRoom(token: string, puzzleData: Grid): void {
    store.set(token, { 
        token, 
        puzzleData
    });
}

export { getRoom as getRoomFromStore , createRoom as createRoomInStore };