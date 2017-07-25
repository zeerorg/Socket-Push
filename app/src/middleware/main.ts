import * as socket from "socket.io";
import { Server, createServer } from "http";
import { MongoClient, Db } from "mongodb";

import { ClientDb } from "../backend/client";
import { DeviceDb } from "../backend/device";
import { RoomDb } from "../backend/rooms";
import { UserDb } from "../backend/user";
import { Constants } from "../backend/constants";


interface AuthData {
    authToken: string;
    deviceId: string;
    username: string;
}

class Main {
    db: Db;
    clientDb: ClientDb;
    deviceDb: DeviceDb;
    roomDb: RoomDb;
    userDb: UserDb;
    tokens: string[];
    namespaces: {[token: string]: SocketIO.Namespace};
    io: SocketIO.Server;

    main = async (mongoURL: string, io: SocketIO.Server): Promise<void> => {
        this.io = io;
        this.db = await MongoClient.connect(mongoURL);
        let promiseArr: any[] = [ClientDb.initialize(this.db), DeviceDb.initialize(this.db), RoomDb.initialize(this.db), UserDb.initialize(this.db)];
        [this.clientDb, this.deviceDb, this.roomDb, this.userDb] = await Promise.all(promiseArr);

        this.tokens = await this.clientDb.getAllTokens();
        for(let token in this.tokens) {
            this.namespaces[token] = this.initNamespace(token);
        }
    }

    initNamespace = (token: string): SocketIO.Namespace => {
        let namespace = this.io.of(`/${token}`);
        namespace.on("connect", async (socket: SocketIO.Socket) => {

            socket.on("AuthDevice", async (data: AuthData) => {
                if(this.clientDb.authClient(token, data.authToken)) {
                    socket.on("JOINROOM", this.joinRoom);
                } else {
                    socket.emit("ERROR", Constants.WRONG_AUTH);
                    socket.disconnect();
                }
            });

        });

        return namespace;
    }

    joinRoom = async () => {

    }


}

export { Main };