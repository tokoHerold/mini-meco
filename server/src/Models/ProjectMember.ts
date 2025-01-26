import { CourseProject } from "./CourseProject";
import { User } from "./User";

export class ProjectMember {

  protected project: CourseProject;
  protected user: User;
  protected role: string;

  constructor(project: CourseProject, user: User, role: string) {
    this.project = project
    this.user = user;
    this.role = role;
  }
  // Getters
  public getProject(): CourseProject{
    return this.project;
  }

  public getUser(): User{
    return this.user;
  }

  public getRole(): string{
    return this.role;
  }

  // Setters
  setRole(role: string){
    this.role = role;
  }
}
