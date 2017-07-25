import { v4 as uuidv4 } from "uuid";
import { Db, Collection } from "mongodb";
import * as socket from "socket.io";

class Room {
    name: string;
    token: string;
    id: string;
    clients: Set<string>;

    constructor(name:string, token: string) {
        this.name = name;
        this.token = token;
        this.id = uuidv4();
        this.clients = new Set();
    }
}

class RoomDb {
    roomCollection: Collection;

    static initialize = async function(db: Db): Promise<RoomDb> {
        let mongoRoom: RoomDb = new RoomDb();
        mongoRoom.roomCollection = await db.collection("rooms");
        return mongoRoom;
    }
}

export { RoomDb };
