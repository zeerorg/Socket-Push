import * as express from "express";
import * as socket from "socket.io";
import { Server, createServer } from "http";
import { MongoClient, Db } from "mongodb";

import { secret } from "./secrets";
import { MongoUser, UserNamespace } from "./backend/users";

class MainServer {
    app: express.Application = express();
    server: Server = createServer(this.app);
    io: SocketIO.Server = socket(this.server);
    mongoURL: string = `mongodb://${secret.mongoUser}:${secret.mongoPassword}@${secret.mongoURL}:${secret.mongoPort}/notif`;

    namespace: UserNamespace;
    db: Db;
    userFunc: MongoUser;
    tokens: string[];

    constructor(){
        this.app.get("/", (req, res) => {
            res.send("Hello World");
        });

        this.server.listen(3000, async () => {
            await this.main().catch(console.trace);
            console.log("Listening on *.3000");
        });
    }

    /**
     * initializes the socket server
     */
    main = async (): Promise<void> => {
        this.db = await MongoClient.connect(this.mongoURL);
        this.userFunc = await MongoUser.initialize(this.db);
        this.tokens = await this.userFunc.getAllTokens();
        this.namespace = new UserNamespace(this.io, this.tokens);
    }

    /**
     * cleans the server after it is closed
     */
    cleanup = async (): Promise<void> => {
        this.server.close();
        this.io.close();
        await this.db.close();
    }

}

const server: MainServer = new MainServer();

process.on("SIGINT", server.cleanup);
process.on("SIGTERM", server.cleanup);