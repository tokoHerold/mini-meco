import { Database } from "sqlite";
import { Response, Request } from "express";
import { User } from "./shared_models/User";
import { CourseProject } from "./shared_models/CourseProject";
import { CourseSchedule } from "./shared_models/CourseSchedule";
import { Course } from "./shared_models/Course";

export class ObjectHandler { 

    public async joinProject(req: Request, res: Response, db: Database): Promise<void> {
          const user = await this.getUser(req.params.userId, db);
          const courseProject = await this.getCourseProject(req.params.courseProjectId, db);
          if (!user || !courseProject) { return; }
        if (!user.joinProject(courseProject)) { 
          res.status(400).json({ message: 'Project join failed' });
          return;
        }
        res.status(200).json({ message: 'Project join successful' });
    }

    public async changeEmail(req: Request, res: Response, db: Database): Promise<void> {
        const user = await this.getUserByMail(req.params.userMail, db);
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        if (!user.changeEmail(req.body.email)) { 
            res.status(400).json({ message: 'Email change failed' });
            return;
        };
        res.status(200).json({ message: 'Email changed successfully' });
        }

    public async changePassword(req: Request, res: Response, db: Database): Promise<void> {
        const user = await this.getUserByMail(req.params.userMail, db);
        if (!user) {
            res.status(400).json({ message: 'User not found' }); return;
        }
        if (!user.changePassword(req, res, db)) { 
            res.status(400).json({ message: 'Password change failed' });
            return;
        }
        res.status(200).json({ message: 'Password changed successfully' });
    }

    public async leaveProject(req: Request, res: Response, db: Database): Promise<void> {
        const user = await this.getUser(req.params.userId, db);
        const courseProject = await this.getCourseProject(req.params.courseProjectId, db);
        if (!user || !courseProject) { return; }
        if (!user.leaveProject(courseProject)) {
          res.status(400).json({ message: 'Project leave failed' });
          return;
        }
        res.status(200).json({ message: 'Project leave successful' });
    }


    public async getUser(id: string, db: Database): Promise<User | null> {
        const userRow = await db.get('SELECT * FROM users WHERE id = ?', [id]);
        if (!userRow) {
            return null;
        }
        return new User(); // fill user object with data from row, e.g. userRow.id;
    }

    public async getUserByMail(email: string, db: Database): Promise<User | null> {
        const userRow = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!userRow) {
            return null;
        }
        return new User(); // fill user object with data from row, e.g. userRow.id;
    }

    public async getCourseProject(id: string, db: Database): Promise<CourseProject | null> {
        const projectRow = await db.get('SELECT * FROM project WHERE id = ?', [id]);
        if (!projectRow) {
            return null;
        }
        return new CourseProject(); // fill project object with data from row, e.g. projectRow.id;
    }

    public async getCourseSchedule(id: string, db: Database): Promise<CourseSchedule | null> {
        const scheduleRow = await db.get('SELECT * FROM schedules WHERE id = ?', [id]);
        if (!scheduleRow) {
            return null;
        }
        return new CourseSchedule(); // fill schedule object with data from row, e.g. scheduleRow.id;
    }

    public async getCourse(id: string, db: Database): Promise<Course | null> {
        const courseRow = await db.get('SELECT * FROM projectGroup WHERE id = ?', [id]);
        if (!courseRow) {
            return null;
        }
        return new Course(); // fill course object with data from row, e.g. courseRow.id;
    }
}