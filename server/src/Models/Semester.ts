export enum SemesterType {
  Winter = "WS",
  Summer = "SS",
}

export class Semester {
  private readonly type: SemesterType;
  private readonly academicYear: string;

  constructor(type: SemesterType, academicYear: string) {
    this.type = type;
    this.academicYear = academicYear;
  }

  /**
   * Factory method to create a Semester object from a string input.
   * @param input Supported formats: "WS32", "Winter2032/33", "SS2025", "Summer25".
   */
  public static fromString(input: string): Semester {
    if (!input || input.length < 4) {
      throw new Error(
        "Invalid semester format. Use 'WSYY', 'WSYYYY', 'SSYY', or 'SSYYYY' formats."
      );
    }

    // @todo: Normalize the input format
    // @todo: Process and validate the year part of the semester
    // @todo: Calculate the academic year based on the semester type
    const semesterRegex = /^(SS|WS)(\d{2}|\d{4})$/; // Format: SS24, WS2425
    const match = semesterRegex.exec(input);

    if (!match) {
      throw new Error(
        "Invalid semester format. Use SSYYYY for Summer or WSYYYY for Winter"
      );
    }

    const type = match[1] as SemesterType; // "SS" or "WS"
    const year = match[2];

    let academicYear: string;
    if (type === SemesterType.Winter) {
      const startYear = year.length === 2 ? `20${year}` : year;
      const endYear = (parseInt(startYear) + 1).toString().slice(2);
      academicYear = `${startYear}/${endYear}`;
    } else {
      academicYear = year.length === 2 ? `20${year}` : year;
    }

    return new Semester(type, academicYear);
  }

  public getType(): SemesterType {
    return this.type;
  }

  public getAcademicYear(): string {
    return this.academicYear;
  }

  public toDatabaseFormat(): string {
    return `${this.type}${this.academicYear.replace("/", "")}`;
  }

  /**
   * Returns a string representation of the Semester object.
   */
  public toString(): string {
    return `${this.type}${this.academicYear}`;
  }
}
