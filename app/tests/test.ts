import { MongoClient, Db } from "mongodb";

import { MainServer } from "../src/index";
import { secret } from "../src/secrets";

const mongoURL: string = `mongodb://${secret.mongoURL}:${secret.mongoPort}/test`;

let db: Db;

const startTest = async () => {
    db = await MongoClient.connect(mongoURL);
}