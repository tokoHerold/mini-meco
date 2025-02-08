import { read } from "fs";
import { Reader } from "../Serializer/Reader";
import { Serializable } from "../Serializer/Serializable";
import { Writer } from "../Serializer/Writer";
import { CourseProject } from "./CourseProject";
import { User } from "./User";

export class ProjectMember implements Serializable {
  protected project: CourseProject | undefined;
  protected user: User | undefined;
  protected role: string = "";
  protected userProjectUrl: string = "";

  constructor() {

  }
  readFrom(reader: Reader): void {
    this.project = reader.readObject<CourseProject>("projectId");
    this.user = reader.readObject<User>("userId");
    this.role = reader.readString("role");
    this.userProjectUrl = reader.readString("url");
  }
  writeTo(writer: Writer): void {
    writer.writeObject<CourseProject>("projectId", this.project);
    writer.writeObject<User>("userId", this.user);
    writer.writeString("role", this.role);
    writer.writeString("url", this.userProjectUrl);
  }

  // Getters
  public getProject(): CourseProject | undefined {
    return this.project;
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public getRole(): string {
    return this.role;
  }

  public getUserProjectUrl(): string {
    return this.userProjectUrl;
  }

  // Setters
  public setRole(role: string) {
    this.role = role;
  }

  public setUserProjectUrl(url: string) {
    this.userProjectUrl = url;
  }
}
