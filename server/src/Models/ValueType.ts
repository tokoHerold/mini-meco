// Abstract base class for immutable value objects
export abstract class ValueType<T> {
  protected readonly value: T; // domain-specific value type

  constructor(others: T) {
    this.value = this.init(others);
  }

  // Methods to be implemented by subclasses
  protected abstract init(value: T): T;

  protected abstract toString(): string;

  public getValue(): T {
    return this.value;
  }

  public equals(other: ValueType<T>): boolean {
    return this.value === other.value;
  }

}

// CUstom error class for value errors
export class ValueTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValueTypeError";
  }
}
