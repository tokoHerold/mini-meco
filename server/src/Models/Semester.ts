import { ValueType, ValueTypeError } from "./ValueType";

type SemesterAlias = "winter" | "summer" | "ws" | "ss";

export enum SemesterType {
  Winter = "winter",
  Summer = "summer",
}

// In another world, it might be called SemesterProps
export interface SemesterValueTypes {
  typeName: SemesterAlias;
  academicYear: string;
  // semesterInput: string;
}

export class Semester extends ValueType<SemesterValueTypes> {
  private readonly _type: SemesterAlias;

  private constructor(other: SemesterValueTypes) {
    super(other);
    this._type = other.typeName;
  }

  // Factory method to create a Semester value object
  static create(input : SemesterValueTypes): Semester {
    return new Semester(input);
  }

  // Validate the input and create a Value object
  protected init(others: SemesterValueTypes): SemesterValueTypes {
    const { typeName, academicYear } = others;
    if (!typeName || !academicYear) throw new ValueTypeError("Semester type and academic year must be provided.");
    
    const type = typeName.trim().toLowerCase() as SemesterAlias;
    const validSemesterTypes: SemesterAlias[] = ["winter", "summer", "ws", "ss"];
    const year = parseInt(academicYear, 10); // todo: check if this is correct

    if (!validSemesterTypes.includes(type)) {
      throw new ValueTypeError(`Invalid semester type: ${type}. Must be '{ws|winter}' or '{ss|summer}'.`);
    }

    if (isNaN(year)) {
      throw new ValueTypeError(`Invalid year in semester: ${year}`);
    }

    let validSemesterType = type === 'ws' ? 'winter' : type === 'ss' ? 'summer' : type; // Normalize to 'winter' or 'summer'
    let validAcademicYear = this.parseAcademicYear(year, validSemesterType as SemesterType); // Normalize to academic year format

    return {
      typeName: validSemesterType as SemesterType,
      academicYear: validAcademicYear as string, // todo: check if its use AcademicYear as type
    }
  }

  // Getter methods
  public getType(): SemesterType {
    return this._type === 'winter' ? SemesterType.Winter : SemesterType.Summer;
  }

  public getAcademicYear(): string {
    return this.value.academicYear;
  }

  // Returns a string representation of the Semester object.
  public toString(): string {
    return `${this.value.typeName} Semester ${this.value.academicYear}`;
  }

  // Helper method to calculate the academic year based on the semester type. 
  // Alos convert 2-digit years to 4-digit years but assumes 21st century.
  private parseAcademicYear(year: number, type: SemesterType): string {
    let academicYear: string;

    if (type === SemesterType.Winter) {
      if (year < 100) {
        academicYear = `20${year}/${year + 1}`; // e.g. 2024/25
      } else {
        let nextYear = year + 1;
        academicYear = `${year}/${(nextYear).toString().slice(-2)}`;
      }
      return academicYear;

    } else {
      if (year < 100) { 
        academicYear = `20${year}`; // e.g. 2024
      } else { 
        academicYear = `${year}`; 
      }
      return academicYear;
    }
  }
}
