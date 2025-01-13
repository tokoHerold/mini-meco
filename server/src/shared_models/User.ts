import { Visitor } from "./Visitor";
import { CourseProject } from "./CourseProject";
import { Response } from "express";

export class User extends Visitor {

    public name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
    
    public testEcho(str: string): string {
        return `echo: ${str}, invoked un user with username: ${this.name}`;
    }

}