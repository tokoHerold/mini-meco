import { Visitor } from "./Visitor";
import { joinProject } from "../projectManagement";

export class User extends Visitor {
    public joinProject(id: string): void {
        joinProject();
    }
}