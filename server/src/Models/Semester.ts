import { ModelType, ModelTypeError } from "./ModelType";

type AcademicYear = `${number}/${number}` | `${number}`;

export enum SemesterType {
  Winter = "Winter",
  Summer = "Summer",
}

// In another world, it might be called SemesterProps
interface SemesterValueTypes {
  type: SemesterType;
  year: AcademicYear;
}

export class Semester extends ModelType<SemesterValueTypes> {

  private constructor(type: SemesterType, year: AcademicYear) {
    super({type, year});
  }

  // Create a Semester instance from a string input
  static create(input : string): Semester {
    const { type, year } = Semester.parseSemesterInput(input);
    return new Semester(type, year);
  }

  // Initialize and validate the semester value object
  protected init(value: SemesterValueTypes): SemesterValueTypes {
    const { type: typeName, year: academicYear } = value;   
    
    let type = typeName as SemesterType;
    let year = parseInt(academicYear, 10); // todo: check if this is correct

    if (isNaN(year)) {
      throw new ModelTypeError(`Invalid year in semester: ${year}`);
    }

    let validYear = this.parseAcademicYear(year, type); // Normalize to academic year format

    return {
      type: type as SemesterType,
      year: validYear as AcademicYear,
    }
  }

  public getType(): SemesterType {
    return this.value.type === 'Winter' ? SemesterType.Winter : SemesterType.Summer;
  }

  public getAcademicYear(): AcademicYear {
    return this.value.year;
  }

  // Returns a string representation of the Semester object.
  public toString(): string {
    return `${this.value.type} ${this.value.year}`;
  }

  // Parse the input string to extract the semester type and year
  private static parseSemesterInput(input: string): SemesterValueTypes {
    if (!input || input === undefined) {
      throw new ModelTypeError('Semester value cannot be empty');
    }
    const cleanInput = input.trim().toLowerCase();
    const regex = /^(ws|winter|ss|summer)?\s*(\d{2}|\d{4})$/;
    const match = cleanInput.match(regex);
  
    if (!match || !match[2]) {
      throw new ModelTypeError(`Invalid semester input: ${input}. Use formats like 'WS24', 'Winter 2024', 'SS25', or 'Summer 2025'.`);
    }
    
    return {
      type: ((match[1] === 'ws' || match[1] === 'winter') ? SemesterType.Winter : SemesterType.Summer), // Normalize to 'winter' or 'summer'
      year: match[2] as AcademicYear,
    };
  }

  // Helper method to calculate the academic year based on the semester type. 
  // And convert 2-digit years to 4-digit years but assumes 21st century.
  private parseAcademicYear(year: number, type: SemesterType): AcademicYear {
    let academicYear: string;

    if (type === SemesterType.Winter) {
      if (year < 100) {
        academicYear = `20${year}/${year + 1}`; // e.g. 2024/25
      } else {
        let nextYear = year + 1;
        academicYear = `${year}/${(nextYear).toString().slice(-2)}`;
      }
      return academicYear as AcademicYear;

    } else {
      if (year < 100) { 
        academicYear = `20${year}`; // e.g. 2024
      } else { 
        academicYear = `${year}`; 
      }
      return academicYear as AcademicYear;
    }
  }
}
