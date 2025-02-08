import { Database } from "sqlite";
import { User } from "./User";
import { CourseProject } from "./CourseProject";
import { ObjectHandler } from "../ObjectHandler";
import { ProjectParticipation } from "./ProjectParticipation";

export interface ProjectMember {
    user: User;
    role: string | null;
    userProjectUrl: string | null;
}

export class ProjectManager {
    protected db: Database;
    protected oh: ObjectHandler;

    constructor (db: Database) {
        this.db = db;
        this.oh = new ObjectHandler();
    }

    public async getProjectParticipation (user: User):  Promise<ProjectParticipation[]> {
        const userProjects = await this.db.all(`
            SELECT projectId, role, url
            FROM user_projects
            WHERE userId = ?
        `, user.getId());
        let projParts = new Array<ProjectParticipation>;
        userProjects.forEach(async (row) => {
            const proj = await this.oh.getCourseProject(row.projectId, this.db);
            if (proj == null ) {
                return;
            }
            projParts.push(new ProjectParticipation(proj, row.role, row.url));
        });
        return projParts;
    }

    public async getRoleIn(user: User, project: CourseProject): Promise<string | null>{
        const userProjects = await this.db.get(`
            SELECT role
            FROM user_projects
            WHERE userId = ? AND projectId = ?
        `, [user.getId(), project.getId()]);
        return userProjects.role;
    }
    
    public async getUserProjectUrl(user: User, project: CourseProject): Promise<string | null> {
        const userProjects = await this.db.get(`
            SELECT url
            FROM user_projects
            WHERE userId = ? AND projectId = ?
        `, [user.getId(), project.getId()]);
        return userProjects.url;
    }

    public setRole(user: User, project: CourseProject, role: string | null) {
        throw new Error("not implemented!");
    }


    public setUserProjectUrl(url: string | null) {
        this.userProjectUrl = url;
    }
}