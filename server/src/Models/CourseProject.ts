import { Reader } from "../Serializer/Reader";
import { Serializable } from "../Serializer/Serializable";
import { Writer } from "../Serializer/Writer";
import { Course } from "./Course";


export class CourseProject implements Serializable {
  protected id: number;
  protected name: string | null = null;
  protected course: Course | undefined;

  constructor(id: number) {
    this.id = id;
  }

  async readFrom(reader: Reader): Promise<void> {
    this.id = reader.readNumber("id") as number;
    this.name = reader.readString("projectName");
    this.course = (await reader.readObject("courseId", "Course")) as Course ;
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

  public getName(): string | null {
    return this.name;
  }

  public getCourse(): Course | undefined {
    return this.course;
  }

  // Setters
  public setName(name: string | null) {
    //ToDo validate uniqueness of new name
    this.name = name;
  }

  public setCourse(course: Course): void {
    this.course = course;
  }
}
