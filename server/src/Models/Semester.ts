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
   * @param input Supported formats: "WS32", "Winter2032", "SS2025", "Summer25".
   */
  public static fromString(input: string): Semester {
    if (!input || input.length < 4) {
      throw new Error(
        "Invalid semester format. Use 'WSYY', 'WSYYYY', 'SSYY', or 'SSYYYY' formats."
      );
    }

    // Normalize the input format to lowercase
    const normalizedInput = input.trim().toLowerCase();

    let type: SemesterType;
    let yearPart: string;

    if (
      normalizedInput.startsWith("ws") ||
      normalizedInput.startsWith("winter")
    ) {
      type = SemesterType.Winter;
      yearPart = normalizedInput.replace(/^(ws|winter)/, "").trim();
    } else if (
      normalizedInput.startsWith("ss") ||
      normalizedInput.startsWith("summer")
    ) {
      type = SemesterType.Summer;
      yearPart = normalizedInput.replace(/^(ss|summer)/, "").trim();
    } else {
      throw new Error(
        "Invalid semester type. Use 'WS', 'Winter', 'SS', or 'Summer'."
      );
    }

    // Process and validate the year part of the semester
    const year = this.parseYear(yearPart);

    // Calculate the academic year based on the semester type
    if (type === SemesterType.Winter) {
      const nextYear = year + 1;
      const academicYear = `${year}/${
        nextYear.toString().length > 2 ? nextYear.toString().slice(2) : nextYear
      }`;
      return new Semester(type, academicYear);
    } else {
      return new Semester(type, `${year}`);
    }
  }

  /**
   * Helper function to process and validate the year part of the semester.
   * Supports both two-digit and four-digit year representations.
   * @param yearPart - The year part as a string (e.g., "32" or "2032").
   * @returns The year as a four-digit number.
   */
  private static parseYear(yearPart: string): number {
    const year = parseInt(yearPart, 10);

    if (isNaN(year)) {
      throw new Error(`Invalid year part in semester: ${yearPart}`);
    }

    if (yearPart.length === 2) {
      return 2000 + year; // assumes 2000s
    } else if (yearPart.length === 4) {
      return year;
    } else {
      throw new Error(`Invalid year length: ${yearPart}`);
    }
  }

  public getType(): SemesterType {
    return this.type;
  }

  public getAcademicYear(): string {
    return this.academicYear;
  }

  /**
   * Returns a string representation of the Semester object.
   */
  public toString(): string {
    return `${this.type} ${this.academicYear}`;
  }
}
