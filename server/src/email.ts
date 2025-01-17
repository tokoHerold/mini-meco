export class EmailAddress {
    private readonly value: string;
  
    constructor(email: string) {
      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email address');
      }
      this.value = email;
    }
  
    private isValidEmail(email: string): boolean {
      // Valid email string format: must not contain '@', followed by '@', must include a '.', and end with a string without '@'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    toString(): string {
      return this.value;
    }
  }
  