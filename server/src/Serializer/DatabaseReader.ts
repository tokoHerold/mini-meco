import { Serializable } from "../Serializer/Serializable";
import { Reader } from "./Reader";

/**
 * Reader Class
 * 
 * Reads/Writes Serializable Entities to SQLite Database
 * 
 */
export class DatabaseResultSetReader implements Reader {
    protected resultSet: Serializable[];

    constructor(resultSet: Serializable[]) {
        this.resultSet = resultSet;
    }

    readRoot(): void {
        /* loop over all entries in resultSet */ 
            /* Read type and attributes from entry */
            /* Create a new instance of fitting type */
            /* Call readFrom() on that instance which will read all attributes from attribute set. */
        /* end loop */

        throw new Error("Method not implemented.");
    }
    readObject(attributeName: string): Serializable {
        throw new Error("Method not implemented.");
    }
    readString(attributeName: string): string {
        throw new Error("Method not implemented.");
    }
    readNumber(attributeName: string): number {
        throw new Error("Method not implemented.");
    }
     
}