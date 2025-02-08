import { Serializable } from "../Serializer/Serializable";
import { SerializableFactory } from "../Serializer/SerializableFactory";
import { Database } from "sqlite";
import { User } from "../Models/User";
import { DatabaseWriter } from "./DatabaseWriter";

/**
 * Factory for creating Serializables in a way specific to the sqlite database.
 */
export class DatabaseSerializableFactory implements SerializableFactory {
    protected db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async create(className: string): Promise<Serializable> {
        /** @todo extend for all classes. */
        if (className === "User") {
            return await this.createUser();
        } else {
            throw new Error("Serializable Creation Failed: Unknown class name: " + className);
        }
    }

    /** 
     * Creates a new User object and its corresponding database entity.
     * Will overwrite the Databases Default Values with any defaults from 
     * User class and its constructor!
     */
    protected async createUser(): Promise<User> {
        // Create new user row 
        const runResult = await this.db.run('INSERT INTO users DEFAULT VALUES');
        if (!runResult || runResult.lastID === undefined) {  
            throw new Error("Serializable Creation Failed: Failed to create db entry for new user!");
        } else {
            let u = new User(runResult.lastID);
            u.writeTo(new DatabaseWriter(this.db));
            return u;
        }
    }
}