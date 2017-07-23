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

class MongoRoom {
    roomCollection: Collection;

    static initialize = async function(db: Db): Promise<MongoRoom> {
        let mongoRoom: MongoRoom = new MongoRoom();
        mongoRoom.roomCollection = await db.collection("rooms");
        return mongoRoom;
    }

    getAllRooms = async (token: string): Promise<Array<Room>> => {
        let rooms: Room[] = await this.roomCollection.find({token: token}).toArray();
        return rooms;
    }

    checkRoom = async (token: string, name: string): Promise<boolean> => {
        return (await this.roomCollection.find({token: token, name: name}).count()) != 0;
    }

    getRoom = async (token: string, name: string): Promise<Room> => {
        return await this.roomCollection.findOne({token: token, name: name});
    }
}

class SocketRooms {

    

}
