export enum SemesterType {
    Winter = "Winter",
    Summer = "Summer",
}
  
export class Semester {
    private readonly type: SemesterType;
    private readonly academicYear: string;

    constructor(type: SemesterType, academicYear: string) {
        if(!(type in SemesterType)) throw new Error(`Invalid semster type: ${type}`);
        this.type = type;

        if(academicYear.length !== 4) throw new Error(`Invalid academic year. Expected a four-digit year, received: ${academicYear}`);
        if(type === SemesterType.Winter) {
            this.academicYear = `${academicYear}/${+academicYear + 1}`;
        } else {
            this.academicYear = academicYear
        }
    }

    public getType(): SemesterType {
        return this.type;
    }

    public getAcademicYear(): string {
        return this.academicYear;
    }

}