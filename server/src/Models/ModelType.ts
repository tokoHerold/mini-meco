/**
 * Abstract base class for immutable value objects.
 */
export abstract class ModelTypes<T extends Object> {
  protected readonly value: Readonly<T>; // domain-specific value type

  constructor(others: T) {
    this.value = this.init(others);
    Object.freeze(this); // runtime immutability
  }

  protected abstract init(value: T): T;

  protected abstract toString(): string;

  public getValue(): T {
    // Return a new copy to prevent modification of internal state
    return Object.freeze({...this.value});
  }

  public equals(other: ModelTypes<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

}

// Custom error class for value errors
export class ModelTypesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModelTypeError";
  }
}
