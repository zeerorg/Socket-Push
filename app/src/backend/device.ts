import { v4 as uuidv4 } from "uuid";
import { Db, Collection } from "mongodb";

class Device {
    deviceId: string;
    token: string;
    socketId: string;
    connected: boolean;
    messageBuf: string[];
    username: string;

    constructor(token: string, username: string, deviceId: string){
        this.deviceId = deviceId;
        this.token = token;
        this.username = username;
        this.connected = false;
        this.messageBuf = []
        this.socketId = null;
    }
}

class MongoDevice {
    deviceCollection: Collection;

    static initialize = async function(db: Db): Promise<MongoDevice> {
        let mongoDevice: MongoDevice = new MongoDevice();
        mongoDevice.deviceCollection = await db.collection("user");
        return mongoDevice;
    }
}
