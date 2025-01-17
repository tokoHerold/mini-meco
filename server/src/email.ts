export class EmailAddress {
    private readonly value: string;
  
    constructor(email: string) {
      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email address');
      }
      this.value = email;
    }
  
    private isValidEmail(email: string): boolean {
      // check for string without @ followed by @ and string without @ . string without @
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    toString(): string {
      return this.value;
    }
  }
  