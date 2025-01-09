import { Database } from "sqlite";
import { User } from "./shared_models/User";

class ObjectHandler { 
    private db: Database;

    constructor(db: Database) { 
        this.db = db;
    }

    public getUser(id: string): User {
        return this.db.get('SELECT * FROM users WHERE id = ?', [id]);
    }
}