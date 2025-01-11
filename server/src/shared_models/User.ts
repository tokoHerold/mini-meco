import { Visitor } from "./Visitor";
import { CourseProject } from "./CourseProject";
import { Response } from "express";

export class User extends Visitor {

    public getProjectURL(courseProject: CourseProject): string {
        // Implementation here
        return "";
    }

    public setUserProjectURL(courseProject: CourseProject, url: string): boolean {
        // Implementation here
        return true;
    }

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