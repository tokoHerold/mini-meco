import { Database } from "sqlite";
import { Response } from "express";
import { User } from "./shared_models/User";
import { CourseProject } from "./shared_models/CourseProject";
import { CourseSchedule } from "./shared_models/CourseSchedule";
import { Course } from "./shared_models/Course";

enum Action {
    changeUserMail,
    joinProject,
    leaveProject
}
export class ObjectHandler { 
    private db: Database;
    private res?: Response;



    constructor(db: Database, res: Response | undefined = undefined) { 
        this.db = db;
        this.res = res;
    }




    public async getUser(id: string): Promise<User | null> {
        const userRow = await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
        if (!userRow) {
            return null;
        }
        return new User(); // fill user object with data from row, e.g. userRow.id;
    }

    public async getCourseProject(id: string): Promise<CourseProject | null> {
        const projectRow = await this.db.get('SELECT * FROM project WHERE id = ?', [id]);
        if (!projectRow) {
            return null;
        }
        return new CourseProject(); // fill project object with data from row, e.g. projectRow.id;
    }

    public async getCourseSchedule(id: string): Promise<CourseSchedule | null> {
        const scheduleRow = await this.db.get('SELECT * FROM schedules WHERE id = ?', [id]);
        if (!scheduleRow) {
            return null;
        }
        return new CourseSchedule(); // fill schedule object with data from row, e.g. scheduleRow.id;
    }

    public async getCourse(id: string): Promise<Course | null> {
        const courseRow = await this.db.get('SELECT * FROM projectGroup WHERE id = ?', [id]);
        if (!courseRow) {
            return null;
        }
        return new Course(); // fill course object with data from row, e.g. courseRow.id;
    }
}