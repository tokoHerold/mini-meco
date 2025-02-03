import { Database } from "sqlite";
import { Admin } from "../Models/Admin";
import { Serializable } from "../Models/Serializable";
import { User } from "../Models/User";
import { Writer } from "./Writer";
import { query } from "express";

/**
 * Reader Class
 * 
 * Reads/Writes Serializable Entities to SQLite Database
 * 
 */
export class DatabaseWriter implements Writer {
    /**
     * Dictionary to be filled with attributes to be written in a single SQL call.
     */
    protected attributes: {[attributeName: string]: string | number} = {};
    protected db: Database;

    constructor(db: Database) {    
        this.db = db;
          /* res.status(201).json({ message: 'User registered successfully' }); */
        /*'UPDATE users SET confirmEmailToken = ?, confirmEmailExpire = ? WHERE email = ?',*/
    }


    async writeRoot(rootObject: Serializable) {
        /** @todo handle writing referenced objects recursively if required! */
        // get table string based on class.
        let table: string;
        if (rootObject instanceof User || rootObject instanceof Admin) {
            table = "users";
        /** @todo Add further tables/Classes! */
        } else {
            throw new Error("Unknown Serializable! Probably not implemented yet!");
        }

        /* Make rootObject write its attribute values. They are gathered in attributes dictionary. */
        rootObject.writeTo(this);
        /* Compile SQL query from attributes */
        const assignments = Object.keys(this.attributes)
                        .map(key => `${key} = :${key}`)
                        .join(", ");
        await this.db.run(
            `UPDATE :table SET ${assignments} WHERE id = :id`,
            {...this.attributes}
        );
    }


    writeObject(attributeName: string, objRef: Serializable): void {
        throw new Error("Method not implemented.");
    }
    writeString(attributeName: string, string: string): void {
        this.attributes[attributeName] = string;
    }
    writeNumber(attributeName: string, number: number): void {
        this.attributes[attributeName] = number;
    }
     
}