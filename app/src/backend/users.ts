import { v4 as uuidv4 } from "uuid";
import { Db, Collection } from "mongodb";
import * as socket from "socket.io";

import { Functions } from "../middleware/nsp";

class User {
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

class MongoUser {
    userCollection: Collection;

    static initialize = async function(db: Db): Promise<MongoUser> {
        let mongoUser: MongoUser = new MongoUser();
        mongoUser.userCollection = await db.collection("user");
        return mongoUser;
    }

    insertInDb = async (user: User): Promise<boolean> => {
        if(await this.checkUser(user.username)) {
            return false; 
        } else {
            await this.userCollection.insertOne(user);
            return true;
        }
    }

    getAllUsers = async (): Promise<Array<User>> => {
        let users: User[] = await this.userCollection.find({}).toArray();
        return users;
    }

    getAllTokens = async (): Promise<Array<string>> => {
        let users: User[] = await this.getAllUsers();
        let tokens: string[] = [];
        for (let user of users) {
            tokens.push(user.token);
        }
        return tokens;
    }

    checkUser = async (username: string): Promise<number> => {
        return await this.userCollection.find({"username": username}).count();
    }

}

class UserNamespace {
    nameSpace: {[key: string]: SocketIO.Namespace};
    io: SocketIO.Server;
    functions: Functions;

    constructor(io: SocketIO.Server, functions: Functions, tokens: string[] = []){
        this.nameSpace = {};
        this.io = io;
        this.functions = functions;
        this.addNamespaceMany(tokens);
    }

    addNamespaceMany = (tokens: string[]): void => {
        for(let token of tokens) {
            this.addNamespace(token);
        }
    }

    addNamespace = (token: string): void => {
        const namespace: SocketIO.Namespace = this.io.of(`/${token}`);
        namespace.use(this.configSocket);
        this.nameSpace[token] = namespace;
    }

    getClients = (token: string): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            this.nameSpace[token].clients((clients: string[]) => {
                resolve(clients);
            });
        })
    }

    getNamespace = (token: string): SocketIO.Namespace => {
        return this.nameSpace[token];
    }

    configSocket = (socket: SocketIO.Socket) => {
        socket.on("DeviceAuth", () => {
            this.functions.init();
        })
    }

}

export { User, MongoUser, UserNamespace };