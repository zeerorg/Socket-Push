import { v4 as uuidv4 } from "uuid";
import { Db, Collection } from "mongodb";
import * as socket from "socket.io";

import { Functions } from "../middleware/namespace";

class Client {
    username: string;
    password: string;
    token: string;
    authToken: string;

    constructor(name: string, password: string){
        this.username = name;
        this.password = password;
        this.token = uuidv4();
        this.authToken = uuidv4();
    }
}

class ClientDb {
    clientCollection: Collection;

    static initialize = async function(db: Db): Promise<ClientDb> {
        let mongoUser: ClientDb = new ClientDb();
        mongoUser.clientCollection = await db.collection("client");
        return mongoUser;
    }

    insertInDb = async (user: Client): Promise<boolean> => {
        if(await this.checkClient(user.username)) {
            return false; 
        } else {
            await this.clientCollection.insertOne(user);
            return true;
        }
    }

    getAllClients = async (): Promise<Array<Client>> => {
        let users: Client[] = await this.clientCollection.find({}).toArray();
        return users;
    }

    getAllTokens = async (): Promise<Array<string>> => {
        let users: Client[] = await this.getAllClients();
        let tokens: string[] = [];
        for (let user of users) {
            tokens.push(user.token);
        }
        return tokens;
    }

    checkClient = async (username: string): Promise<number> => {
        return await this.clientCollection.find({"username": username}).count();
    }

    authClient = async (token: string, authToken: string): Promise<boolean> => {
        return (await this.clientCollection.find({"token": token, "authToken": authToken}).count()) == 1;
    }

}

export { Client, ClientDb };