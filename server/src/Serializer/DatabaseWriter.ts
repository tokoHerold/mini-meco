import { Database } from "sqlite";
import { Admin } from "../Models/Admin";
import { Serializable } from "../Serializer/Serializable";
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
    }

    async writeRoot(rootObject: Serializable) {
        /** @todo handle writing referenced objects recursively if required! */
        // reset attributes dict
        this.attributes = {};
        // get table string based on class.
        const table = this.getTableNameFromClass(rootObject);

        /* Make rootObject write its attribute values. They are gathered in attributes dictionary. */
        rootObject.writeTo(this);
        /* Compile SQL query from attributes */
        const assignments = Object.keys(this.attributes)
                        .map(key => `${key} = :${key}`)
                        .join(", ");
        await this.db.run(
            `UPDATE :table SET ${assignments} WHERE id = :id`,
            {...this.attributes, }
        );
    }

    
    writeObject<T extends object>(attributeName: string, objRef: T | undefined): void {
        // if object is not defined write NULL to db
        if (objRef === undefined) {
            this.attributes[attributeName] = "NULL";
        } else if ('getId' in objRef && typeof objRef.getId === 'function') { 
            // make sure Object has an ID and a getter.
            this.attributes[attributeName] = objRef.getId();
        } else {
            throw new Error("Serialization for Object of type " + typeof objRef + " failed!");
        }
    }
    writeString(attributeName: string, string: string): void {
        this.attributes[attributeName] = string;
    }
    writeNumber(attributeName: string, number: number): void {
        this.attributes[attributeName] = number;
    }
    

    getTableNameFromClass(s: Serializable): string {
        if (s instanceof User || s instanceof Admin) {
            return "users";
        /** @todo Add further tables/Classes! */
        } else {
            throw new Error("Unknown Serializable! Probably not implemented yet!");
        }
    }
}