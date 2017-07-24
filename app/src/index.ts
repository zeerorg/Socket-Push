import * as express from "express";
import * as socket from "socket.io";
import { Server, createServer } from "http";
import { MongoClient, Db } from "mongodb";

import { secret } from "./secrets";
import { MongoUser, UserNamespace } from "./backend/users";

const app: express.Application = express();
const server: Server = createServer(app);
const io: SocketIO.Server = socket(server);
const mongoURL: string = `mongodb://${secret.mongoUser}:${secret.mongoPassword}@${secret.mongoURL}:${secret.mongoPort}/notif`;

let namespace: UserNamespace;
let db: Db;
let userFunc: MongoUser;
let tokens: string[];

/**
 * initializes the server
 */
const main = async (): Promise<void> => {
    db = await MongoClient.connect(mongoURL);
    userFunc = await MongoUser.initialize(db);
    tokens = await userFunc.getAllTokens();
    namespace = new UserNamespace(io, tokens);
}

/**
 * cleans the server after it is closed
 */
const cleanup = async (): Promise<void> => {
    server.close();
    io.close();
    await db.close();
}

app.get("/", (req, res) => {
    res.send("Hello World");
});

server.listen(3000, async () => {
    await main().catch(console.trace);
    console.log("Listening on *.3000");
});

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup)