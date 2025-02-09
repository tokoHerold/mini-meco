import { Database } from "sqlite";
import { ObjectHandler } from "./ObjectHandler";
import { DatabaseSerializableFactory } from "./Serializer/DatabaseSerializableFactory";
import { Course } from "./Models/Course";


export class CourseManager {
    protected db: Database;
    protected oh: ObjectHandler;

    constructor (db: Database) {
        this.db = db;
        this.oh = new ObjectHandler();
    }

    public async createCourse (): Promise<Course> {
        const dbsf = new DatabaseSerializableFactory(this.db);
        const proj = await dbsf.create("Course") as Course;
        return proj;
    }
}