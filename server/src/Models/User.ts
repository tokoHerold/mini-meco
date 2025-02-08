import { Visitor } from "./Visitor";
import { CourseProject } from "./CourseProject";
import { Serializable } from "./Serializable";
import { Reader } from "../Serializer/Reader";
import { Writer } from "../Serializer/Writer";

export class User extends Visitor implements Serializable {
  protected id: number;
  protected name: string = "";
  protected githubUsername: string = "";
  protected email: string = "";
  protected status: string = "";
  protected password: string = "";
  protected resetPasswordToken: string = "";
  protected resetPasswordExpire: number = 0;
  protected confirmEmailToken: string = "";
  protected confirmEmailExpire: number = 0;
  protected projectsUserIsMemberOf: CourseProject[] = [];
  
  /** Do not call this constructor directly. Instead use the SerializableFactory
   *  appropriate for your backend!
   *  example:
   *    const dsf = new DatabaseSerializableFactory(db); 
   *    u: User = dsf.create("User");
   */
  constructor(id: number) {
    super();
    this.id = id;
  }

  readFrom(reader: Reader): void {
    /** use setter? */
    this.id = reader.readNumber("id");
    this.name = reader.readString("name");
    this.githubUsername = reader.readString("githubUserName");
    this.email = reader.readString("email");
    this.status = reader.readString("status");
    this.password = reader.readString("password");
    this.resetPasswordToken = reader.readString("resetPasswordToken");
    this.resetPasswordExpire = reader.readNumber("resetPasswordExpire");
    this.confirmEmailToken = reader.readString("confirmEmailToken");
    this.confirmEmailExpire = reader.readNumber("confirmEmailExpire");
    /**
     * @todo design / implement:
     * this.projectsUserIsMemberOf = reader.read??()
     */
  }

  writeTo(writer: Writer): void {
    /** use getter? */
    writer.writeNumber("id", this.id);
    writer.writeString("name", this.name);
    writer.writeString("githubUserName", this.githubUsername);
    writer.writeString("email", this.email);
    writer.writeString("status", this.status);
    writer.writeString("password", this.password);
    writer.writeString("resetPasswordToken", this.resetPasswordToken);
    writer.writeNumber("resetPasswordExpire", this.resetPasswordExpire);
    writer.writeString("confirmEmailToken", this.confirmEmailToken);
    writer.writeNumber("confirmEmailExpire", this.confirmEmailExpire);
    /** @todo design / implement: 
     * writer.writeObject("projectsUserIsMemberOf") 
     */
  }

  // Getters
  public getId(): number | undefined{
    return this.id;
  }

  public getName(): string{
    return this.name;
  }

  public getGithubUsername(): string{
    return this.githubUsername;
  }

  public getEmail(): string{
    return this.email;
  }

  public getStatus(): string{
    return this.status;
  }

  public getPassword(): string{
    return this.password;
  }

  public getResetPasswordToken(): string{
    return this.resetPasswordToken;
  }

  public getResetPasswordExpire(): number{
    return this.resetPasswordExpire;
  }

  public getConfirmEmailToken(): string{
    return this.confirmEmailToken;
  }

  public getConfirmEmailExpire(): number{
    return this.confirmEmailExpire;
  }

  public getProjectsMemberIn(): CourseProject[]{
    return this.projectsUserIsMemberOf;
  }

  // Setters
  public setId(id: number){
    this.id = id;
  }

  public setName(name: string){
    this.name = name;
  }

  public setGithubUsername(githubUsername: string){
    this.githubUsername = githubUsername;
  }

  public setEmail(email: string){
    this.email = email;
  }

  public setStatus(status: string){
    this.status = status;
  }

  public setPassword(password: string){
    this.password = password;
  }

  public setResetPasswordToken(resetPasswordToken: string){
    this.resetPasswordToken = resetPasswordToken;
  }

  public setResetPasswordExpire(resetPasswordExpire: number){
    this.resetPasswordExpire = resetPasswordExpire;
  }

  public setConfirmEmailToken(confirmEmailToken: string){
    this.confirmEmailToken = confirmEmailToken;
  }

  public setConfirmEmailExpire(confirmEmailExpire: number){
    this.confirmEmailExpire = confirmEmailExpire;
  }

  public setProjectsMemberIn(projectsUserIsMemberOf: CourseProject[]){
    this.projectsUserIsMemberOf = projectsUserIsMemberOf;
  }

  // Command

  public addProject(project: CourseProject){
    this.projectsUserIsMemberOf.push(project)
  }

  public removeProject(project: CourseProject){
    this.projectsUserIsMemberOf = this.projectsUserIsMemberOf.filter(projectEl => projectEl.projectName != project.projectName);
  }
}
