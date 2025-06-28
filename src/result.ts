export interface Result<T, E> {
  map<T2>(f: (t: T) => T2): Result<T2, E>;
  mapErr<E2>(f: (e: E) => E2): Result<T, E2>;
  isOk(): boolean;
  isErr(): boolean;
  andThen<T2, E2>(f: (t: T) => Result<T2, E2>): Result<T2, E | E2>;
  orElse<T2, E2>(f: (e: E) => Result<T2, E2>): Result<T | T2, E2>;
  unsafeUnwrap(): T;
}

export class Ok<T, E> implements Result<T, E> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  map<T2>(f: (t: T) => T2): Result<T2, E> {
    return new Ok<T2, E>(f(this.value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapErr<E2>(f: (e: E) => E2): Result<T, E2> {
    return new Ok<T, E2>(this.value);
  }

  isOk() {
    return true;
  }

  isErr() {
    return false;
  }

  andThen<T2, E2>(f: (t: T) => Result<T2, E2>): Result<T2, E | E2> {
    return f(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orElse<T2, E2>(f: (e: E) => Result<T2, E2>): Result<T | T2, E2> {
    return new Ok<T, E2>(this.value);
  }

  unsafeUnwrap(): T {
    return this.value;
  }
}

export class Err<T, E> implements Result<T, E> {
  error: E;

  constructor(error: E) {
    this.error = error;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<T2>(f: (t: T) => T2): Result<T2, E> {
    return new Err<T2, E>(this.error);
  }

  mapErr<E2>(f: (e: E) => E2): Result<T, E2> {
    return new Err<T, E2>(f(this.error));
  }

  isOk() {
    return false;
  }

  isErr() {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  andThen<T2, E2>(f: (t: T) => Result<T2, E2>): Result<T2, E | E2> {
    return new Err<T2, E>(this.error);
  }

  orElse<T2, E2>(f: (e: E) => Result<T2, E2>): Result<T | T2, E2> {
    return f(this.error);
  }

  unsafeUnwrap(): T {
    if (
      typeof this.error === "string" ||
      (this.error && typeof this.error.toString === "function")
    )
      throw new Error(`Unwrapped result with err: ${this.error}`);
    else throw new Error(`Unwrapped result with err`);
  }
}

export const ok = <T>(t: T) => new Ok<T, unknown>(t);

export const err = <E>(e: E) => new Err<unknown, E>(e);

export function fromList<T, E>(
  listOfResults: Result<T, E>[],
): Result<T[], E[]> {
  const errs = listOfResults.reduce((acc, r) => {
    if (_isErr(r)) return [...acc, r.error];
    else return acc;
  }, [] as E[]);
  if (errs.length) return new Err(errs);
  else return new Ok(listOfResults.map((r) => r.unsafeUnwrap()));
}

function _isErr<T, E>(result: Result<T, E>): result is Err<T, E> {
  return result.isErr();
}
