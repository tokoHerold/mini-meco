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
      if(!this.isValidEmail(this.value)) {
        throw new Error('Invalid email address');
      }
      return this.value;
    }

    equals(email : EmailAddress): boolean {
      return this.toString() === email.toString();
    }

    getDomain(): string {
      // Split the email at the '@' symbol and return the domain part
      const domain = this.value.split('@')[1];
      if (!domain) {
          throw new Error('Email does not contain a valid domain');
      }
      return domain;
  }
  }
  