import { describe, it, expect } from 'vitest';
import { Semester, SemesterType } from '../Models/Semester';

describe('Semester Class', () => {
    it('should create a valid Winter semester with two-digit year', () => {
        const semester = Semester.fromString('WS32');
        expect(semester.getType()).toBe(SemesterType.Winter);
        expect(semester.getAcademicYear()).toBe('2032/33');
        // expect(semester.toDatabaseFormat()).toBe('WS203233');
    });

    it('should create a valid Winter semester with four-digit year', () => {
        const semester = Semester.fromString('Winter2032');
        expect(semester.getType()).toBe(SemesterType.Winter);
        expect(semester.getAcademicYear()).toBe('2032/33');
        // expect(semester.toDatabaseFormat()).toBe('WS203233');
    });

    it('should create a valid Summer semester with two-digit year', () => {
        const semester = Semester.fromString('SS25');
        expect(semester.getType()).toBe(SemesterType.Summer);
        expect(semester.getAcademicYear()).toBe('2025');
        // expect(semester.toDatabaseFormat()).toBe('SS2025');
    });

    it('should create a valid Summer semester with four-digit year', () => {
        const semester = Semester.fromString('Summer2025');
        expect(semester.getType()).toBe(SemesterType.Summer);
        expect(semester.getAcademicYear()).toBe('2025');
        // expect(semester.toDatabaseFormat()).toBe('SS2025');
    });

    it('should throw an error for invalid semester type', () => {
        expect(() => Semester.fromString('helloVitest2032')).toThrowError('Invalid semester type. Use \'WS\', \'Winter\', \'SS\', or \'Summer\'.');
    });

    it('should throw an error for invalid year part (non-numeric)', () => {
        expect(() => Semester.fromString('WSABC')).toThrowError('Invalid year part in semester: ABC');
    });

    it('should throw an error for invalid year length', () => {
        expect(() => Semester.fromString('WS5')).toThrowError('Invalid year length: 5');
    });

    it('should throw an error for missing input', () => {
        expect(() => Semester.fromString('')).toThrowError('Invalid semester format. Use \'WSYY\', \'WSYYYY\', \'SSYY\', or \'SSYYYY\' formats.');
    });

    it('should throw an error for invalid format (empty input)', () => {
        expect(() => Semester.fromString('Winter')).toThrowError('Invalid semester format. Use \'WSYY\', \'WSYYYY\', \'SSYY\', or \'SSYYYY\' formats.');
    });
});