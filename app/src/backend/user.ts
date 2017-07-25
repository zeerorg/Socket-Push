import { v4 as uuidv4 } from "uuid";
import { Db, Collection } from "mongodb";

class User {
    username: string;
    deviceIds: Set<string>;
    rooms: Set<string>;
    token: string;
}

class UserDb {
    userCollection: Collection;

    static initialize = async function(db: Db): Promise<UserDb> {
        let mongoUser: UserDb = new UserDb();
        mongoUser.userCollection = await db.collection("users");
        return mongoUser;
    }
}

export { UserDb };