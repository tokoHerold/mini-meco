import { Reader } from "../Serializer/Reader";
import { Serializable } from "../Serializer/Serializable";
import { Writer } from "../Serializer/Writer";
import { CourseProject } from "./CourseProject";

export class Course implements Serializable {
  protected id: number;
  protected name: string = "";
  protected semester: string = "";
  protected projects: CourseProject[] = [];

  constructor(id: number) {
    this.id = id;
  }

  readFrom(reader: Reader): void {
    this.id = reader.readNumber("id");
    this.name = reader.readString("courseName");
    this.semester = reader.readString("semester");
    // todo ??? this.projects = reader.readObject("projects")
  }

  writeTo(writer: Writer): void {
    writer.writeNumber("id", this.id);
    writer.writeString("courseName", this.name);
    writer.writeString("semester", this.semester);
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getSemester(): string {
    return this.semester;
  }

  public getProjects(): CourseProject[] {
    return this.projects;
  }

  // Setters
  public setName(name: string) {
    // ToDo validate uniqueness of name
    this.name = name;
  }

  public setSemester(semester: string) {
    this.semester = semester;
  }

  public setProjects(projects: CourseProject[]) {
    this.projects = projects;
  }

  // Command methods
  public addProject(project: CourseProject) {
    this.projects = [...this.projects, project];
  }
  public removeProject(project: CourseProject) {
    this.projects = this.projects.filter(courseProject => courseProject !== project);
  }
}
