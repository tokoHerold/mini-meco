import { describe, it, expect } from 'vitest';
import { ValueTypeError } from '../Models/ValueType';
import { Semester, SemesterType, SemesterValueTypes } from '../Models/Semester';

describe('Semester Value Object creation:', () => {
    describe('Winter Semester Validation', () => {
    const testCases = [
        { input: { typeName: "winter", academicYear: "2024/25" }, expected: "Winter Semester 2024/25" },
        { input: { typeName: "ws", academicYear: "2024/25" }, expected: "Winter Semester 2024/25" },
        ];
  
      testCases.forEach(input => {
        it(`should create winter semester from input: ${input}`, () => {
          const semester = Semester.create("winter2024");
          expect(semester.getType()).toBe(SemesterType.Winter);
          expect(semester.getValue()).toMatch(/^\d{4}\/\d{2}$/);
          expect(semester.getAcademicYear).toBe("Winter Semester 2024/25");
        });
      });
    });

    describe('Summer Semester Validation', () => {
        const testCases = [
          'SS25', 'ss25', 'Summer 25', 'summer 2025', 
          'SS2025', 'ss 2025'
        ];
    
        testCases.forEach(input => {
          it(`should create summer semester from input: ${input}`, () => {
            const semester = Semester.create({ semesterInput: input });
            expect(semester.getType()).toBe(SemesterType.Summer);
            expect(semester.getValue()).toMatch(/^\d{4}$/);
            expect(semester.getAcademicYear()).toBe(2025);
          });
        });
      });
    
      describe('Invalid Input Handling', () => {
        const invalidInputs = [
          '', 
          'invalid', 
          '202', 
          'WW24', 
          'Summer', 
          '2024/25'
        ];
    
        invalidInputs.forEach(input => {
          it(`should throw ValueError for invalid input: ${input}`, () => {
            expect(() => Semester.create({ semesterInput: input })).toThrow(ValueTypeError);
          });
        });
      });
});
