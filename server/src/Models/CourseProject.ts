import { Reader } from "../Serializer/Reader";
import { Serializable } from "../Serializer/Serializable";
import { Writer } from "../Serializer/Writer";
import { Course } from "./Course";
import { ProjectMember } from "./ProjectMember";

export class CourseProject implements Serializable {
  protected id: number;
  protected name: string = "";
  protected course: Course | undefined;
  protected members: ProjectMember[] = [];

  constructor(id: number) {
    this.id = id;
  }

  readFrom(reader: Reader): void {
    this.id = reader.readNumber("id");
    this.name = reader.readString("projectName");
    this.course = reader.readObject<Course>("courseId");
    // todo this.members = reader.readArray(...)
  }
  writeTo(writer: Writer): void {
    writer.writeNumber("id", this.id);
    writer.writeString("projectName", this.name);
    writer.writeObject<Course>("courseId", this.course);
    // todo members
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getCourse(): Course | undefined {
    return this.course;
  }

  public getMembers(): ProjectMember[] {
    return this.members;
  }

  // Setters
  public setName(name: string) {
    //ToDo validate uniqueness of new name
    this.name = name;
  }

  public setCourse(course: Course): void {
    this.course = course;
  }

  public setMembers(members: ProjectMember[]) {
    this.members = members;
  }

  // Command methods
  public addMember(member: ProjectMember) {
    this.members = [...this.members, member];
  }
  public removeMember(member: ProjectMember) {
    this.members = this.members.filter(projectMember => projectMember !== member);
  }
}
