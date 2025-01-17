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
  
  const login = (email: EmailAddress, password: string) => {
    console.log(`Logging in with email: ${email.toString()}`);
  };
  
  try {
    const _email = new EmailAddress('user@example.com');
    login(_email, 'securepassword');
  } catch (error) {
    if (error instanceof Error) {
    console.error(error.message);
    }
  }
  