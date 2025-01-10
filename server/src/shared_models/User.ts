import { Visitor } from "./Visitor";
import { CourseProject } from "./CourseProject";
import { Response } from "express";

export class User extends Visitor {

    public getGithubUsername(): string {
        // Implementation here
        return "";
    }

    public joinProject(courseProject: CourseProject): boolean {
        // Implementation here
        return true;
    }

    public leaveProject(courseProject: CourseProject): boolean {
        // Implementation here
        return true;
    }

    public changeEmail(email: string): boolean {
        // Implementation here
        return true;
    }

    public changePassword(req: any, res: Response, db: any): boolean {
        // Implementation here
        return true;
    }

    public sendPasswordResetEmail(email: string): boolean { 
        // Implementation here
        return true;
    }
}