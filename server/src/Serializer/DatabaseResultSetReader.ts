import { Serializable } from "./Serializable";
import { Reader } from "./Reader";
import { ObjectHandler } from "../ObjectHandler";
import { Database } from "sqlite";

/**
 * Reader Class
 * 
 * Reads/Writes Serializable Entities to SQLite Database
 * 
 */
export class DatabaseResultSetReader implements Reader {
    protected attributes: {[attributeName: string]: string | number | null} = {};
    protected resultSet: Promise<any> | Promise<any[]>;
    protected db: Database;

    protected wasHandled: Map<{className: string, id: number}, {instance: Serializable}> = new Map();

    
    constructor(resultSet: Promise<any> | Promise<any[]>, db: Database) {
        this.resultSet = resultSet;
        this.db = db;
    }

    async readRoot<T extends Serializable> (
        Constructor: new (...args: any[]) => T
    ): Promise<T | T[]> {
        this.wasHandled = new Map();
        // await resultSet
        const result = await this.resultSet;
        // either read all or read single row
        if (Array.isArray(result)) {
            return this.readAll(result, Constructor);
        } else { // Read single row:
            return this.readRow<T>(result, Constructor);
        }
    }

    readAll<T extends Serializable> (
        result: any[], Constructor: new (...args: any[]) => T
    ): T[] {
        let arr: T[] = [];
        result.forEach((row: any) => {
            arr.push(this.readRow<T>(row, Constructor));
        });
        return arr;
    }

    readRow<T extends Serializable> (
        row: any, Constructor: new (...args: any[]) => T
    ): T {
        // Reset attributes dict
        this.attributes = {};
        // Read all attributes
        for (const attribute in row) {
            const value = row[attribute];
            // Some type checks
            if (value !== undefined && 
                (typeof value === 'string' || typeof value === 'number' || value === null)) {
                this.attributes[attribute] = value;
            }
        }
        // Create new instance
        let s: T;
        // Checking if this table had an id entry.
        if ("id" in this.attributes) {
            s = new Constructor(this.attributes["id"]);
        } else {
            s = new Constructor();
        }
        // Read all attributes into new instance
        s.readFrom(this);
        return s;
    }

    async readObject(attributeName: string, className: string): Promise<Serializable | undefined> {
        // Assuming Object to be id-referenced:
        const id = this.attributes[attributeName];
        if (typeof id !== 'number') {
            throw new Error("Error during Serialization: Id " + attributeName + " is not a number!");
        }
        // Check if Object was read already:
        if (this.wasHandled.has({className: className, id: id})) {
            return this.wasHandled.get({className: className, id: id})?.instance;
        }
        // if not handled yet, create a new Instance and add to wasHandled.
        const oh = new ObjectHandler();
        const obj = await oh.getSerializableFromId(id, className, this.db);
        if (obj === null) {
            return undefined;
        }
        this.wasHandled.set({className: className, id: id}, {instance: obj});
        return obj;
    }

    readString(attributeName: string): string | null{
        const val = this.attributes[attributeName];
        if (val !== null && typeof val !== 'string' ) {
            throw new Error("Error during Serialization: Attribute " + attributeName + " is not a string!");  
        }
        return val;
    }
    readNumber(attributeName: string): number | null {
        const val = this.attributes[attributeName];
        if (val !== null && typeof val !== 'number') {
            throw new Error("Error during Serialization: Attribute " + attributeName + " is not a number!");
        }
        return val;
    }
     
}