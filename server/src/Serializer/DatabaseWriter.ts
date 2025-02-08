import { Database } from "sqlite";
import { Admin } from "../Models/Admin";
import { Serializable } from "../Serializer/Serializable";
import { User } from "../Models/User";
import { Writer } from "./Writer";

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
    protected attributes: {[attributeName: string]: string | number | null} = {};
    protected toHandle: Array<Serializable> = new Array();
    protected db: Database;

    constructor(db: Database) {    
        this.db = db;
    }

    async writeRoot(rootObject: Serializable) {
        /** @todo handle writing referenced objects recursively if required! */
        this.toHandle.push(rootObject);

        let obj: Serializable | undefined; 
        while ((obj = this.toHandle.pop()) !== undefined) {
            // reset attributes dict
            this.attributes = {};
            // get table string based on class.
            const table = this.getTableNameFromClass(obj);
            /* Make object write its attribute values. They are gathered in attributes dictionary. */
            obj.writeTo(this);
            /* Compile SQL query from attributes */
            const assignments = Object.keys(this.attributes)
                            .map(key => `${key} = :${key}`)
                            .join(", ");
            await this.db.run(
                `UPDATE :table SET ${assignments} WHERE id = :id`,
                {...this.attributes, }
            );
        }

    }

    
    writeObject<T extends Serializable>(attributeName: string, objRef: T | undefined): void {
        // if object is not defined write NULL to db
        if (objRef === undefined) {
            this.attributes[attributeName] = "NULL";
        } else if ('getId' in objRef && typeof objRef.getId === 'function') { 
            // make sure Object has an ID and a getter.
            this.attributes[attributeName] = objRef.getId();
            this.toHandle.push(objRef);
        } else {
            throw new Error("Serialization for Object of type " + typeof objRef + " failed!");
        }
    }
    writeString(attributeName: string, string: string | null): void {
        this.attributes[attributeName] = string;
    }
    writeNumber(attributeName: string, number: number | null): void {
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