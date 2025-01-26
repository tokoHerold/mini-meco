import { Course } from "./Course";
import { ProjectMember } from "./ProjectMember";

export class CourseProject {

  protected name: string;
  protected course: Course;
  protected members: ProjectMember[];

  constructor(name: string, course: Course, members: ProjectMember[] = []) {
    this.name = name;
    this.course = course;
    this.members = members;
  }
  
  // Getters
  public getName(): string{
    return this.name;
  }

  public getCouse(): Course{
    return this.course;
  }

  public getMembers(): ProjectMember[]{
    return this.members;
  }

  // Setters
  public setName(name: string){
    //ToDo validate uniqueness of new name
    this.name = name;
  }

  public setCourse(course: Course): void{
    this.course = course;
  }

  public setMembers(members: ProjectMember[]){
    this.members = members;
  }

  // Command methods
  public addMember(member: ProjectMember){
    this.members.push(member);
  }
  
}
