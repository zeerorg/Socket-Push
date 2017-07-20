import * as express from "express";
import * as socket from "socket.io";
import { Server, createServer } from "http";

import { MongoClient, Db } from "mongodb";

import { secret } from "./secrets";
import { MongoUser } from "./backend/users";

const app: express.Application = express();
const server: Server = createServer(app);
const io: SocketIO.Server = socket(server);
const mongoURL: string = `mongodb://${secret.mongoUser}:${secret.mongoPassword}@${secret.mongoURL}:${secret.mongoPort}/notif`;

const nameSpace: {[key: string]: SocketIO.Namespace} = {};
let tokens: string[] = [];

const main = async (): Promise<void> => {
    const db: Db = await MongoClient.connect(mongoURL);
    const userFunc: MongoUser = await MongoUser.initialize(db);
    console.log(await userFunc.getAllTokens());

    db.close();
}

app.get("/", (req, res) => {
    res.send("Hello World");
});

server.listen(3000, () => {
    console.log("Listening on *.3000");
});

main().catch(console.trace)