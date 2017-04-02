export interface Result<T, E> {
  isOk(): boolean;
  isErr(): boolean;
  mapErr<E2>(f: (e: E) => E2): Result<T, E2>;
  map<U>(f: (t: T) => U): Result<U, E>;
  andThen<U, E2>(f: (t: T) => Result<U, E2>): Result<U, E | E2>;
  orElse<U, E2>(f: (e: E) => Result<U, E2>): Result<T | U, E2>;
  unsafeUnwrap(): T;
  unsafeUnwrapError(): E;
}

type InnerRep<T, E>
  = { type: "ok"; value: T }
  | { type: "error"; value: E };

class ResultImpl<T, E> implements Result<T, E> {

  inner: InnerRep<T, E>;

  constructor(inner_: InnerRep<T, E>) {
    this.inner = inner_;
  }

  isOk() {
    return this.inner.type === "ok";
  }

  isErr() {
    return this.inner.type === "error";
  }

  mapErr<E2>(f: (e: E) => E2) {
    switch (this.inner.type) {
      case "ok": return this;
      case "error": return Err(f(this.inner.value));
    }
  }

  map<U>(f: (t: T) => U) {
    switch (this.inner.type) {
      case "ok": return Ok(f(this.inner.value));
      case "error": return this;
    }
  }

  andThen<U>(f: (t: T) => Result<U, E>) {
    switch (this.inner.type) {
      case "ok": return f(this.inner.value);
      case "error": return this;
    }
  }

  orElse<E2>(f: (e: E) => Result<T, E2>) {
    switch (this.inner.type) {
      case "ok": return this;
      case "error": return f(this.inner.value);
    }
  }

  unsafeUnwrap() {
    switch (this.inner.type) {
      case "ok":
        return this.inner.value;
      case "error":
        throw new Error(`Unwrapped result with err: ${this.inner.value}`);
    }
  }

  unsafeUnwrapError() {
    switch (this.inner.type) {
      case "ok":
        throw new Error(`Unwrapped error of result with value: ${this.inner.value}`);
      case "error":
        return this.inner.value;
    }
  }
}

export function Err<E>(value: E): Result<any, E> {
  return new ResultImpl({ type: "error", value });
}

export function Ok<T>(value: T): Result<T, any> {
  return new ResultImpl({ type: "ok", value });
}

export function fromList<T, E>(listOfResults: Result<T, E>[]): Result<T[], E[]> {
  const errs = listOfResults.filter(r => r.isErr());
  if (errs.length) return Err(errs.map(e => e.unsafeUnwrapError()));
  else return Ok(listOfResults.map(o => o.unsafeUnwrap()));
}
