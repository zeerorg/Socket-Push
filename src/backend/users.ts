import { v4 as uuidv4 } from "uuid";
import { Db, Collection } from "mongodb";

class User {
    username: string;
    password: string;
    token: string;
    authToken: string;

    constructor(name: string, pass: string){
        this.username = name;
        this.password = pass;
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
        if(await this.checkUser) {
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

export { User, MongoUser };