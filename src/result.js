// @flow

export type Ok<T> = { type: "ok", value: T };
export type Err<T> = { type: "err", value: T };
export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(t: T): Ok<T> {
  return { type: "ok", value: t };
}

export function isOk(result: Result<any, any>): boolean {
  return result.type === "ok";
}

export function err<E>(e: E): Err<E> {
  return { type: "err", value: e };
}

export function isErr(result: Result<any, any>): boolean {
  return result.type === "err";
}

export function unsafeUnwrap<T>(result: Result<T, any>): T {
  if (result.type === "ok") return result.value;
  else if (typeof result.value === "string")
    throw new Error(`Unwrapped result with err: ${result.value}`);
  else if (result.value.toString)
    throw new Error(`Unwrapped result with err: ${result.value.toString()}`);
  else
    throw new Error(`Unwrapped result with err`);
}

export const map = <T, E, T2>(f: (T) => T2) =>
  (r: Result<T, E>): Result<T2, E> => {
    return r.type === "ok" ? ok(f(r.value)) : r;
  };

export const mapErr = <T, E, E2>(f: (E) => E2) =>
  (r: Result<T, E>): Result<T, E2> => {
    return r.type === "err" ? err(f(r.value)) : r;
  };

export const andThen = <E, T, T2, E2>(f: (T) => Result<T2, E2>) =>
  (r: Result<T, E>): Result<T2, E | E2> => {
    return r.type === "ok" ? f(r.value) : r;
  };

export const orElse = <E, T, T2, E2>(f: (E) => Result<T2, E2>) =>
  (r: Result<T, E>): Result<T | T2, E2> => {
    return r.type === "err" ? f(r.value) : r;
  };

export function fromList<T, E>(
  listOfResults: Result<T, E>[]
): Result<T[], E[]> {
  const errs = listOfResults.reduce(
    (memo, r) => {
      if (r.type === "err") return [...memo, r.value];
      else return memo;
    },
    []
  );
  if (errs.length) return err(errs);
  const values = listOfResults.reduce(
    (memo, r) => {
      if (r.type === "ok") return [...memo, r.value];
      else return memo;
    },
    []
  );
  return ok(values);
}

// interface Result<T, E> {
//   isOk(): boolean,
//   isErr(): boolean,
//   mapErr<E2>(f: (E) => E2): Result<T, E2>,
//   map<T2>(f: (T) => T2): Result<T2, E>,
//   andThen<T2, E2>(f: (T) => Result<T2, E2>): Result<T2, E | E2>,
//   orElse<T2, E2>(f: (E) => Result<T2, E2>): Result<T | T2, E2>,
//   unsafeUnwrap(): T,
//   unsafeUnwrapError(): E
// }

// type MaybeToString = { toString?: () => string };

// class ResultImpl<T: MaybeToString, E: MaybeToString> implements Result<T, E> {
//   rep: { type: "ok", value: T } | { type: "error", value: E };

//   constructor(rep: { type: "ok", value: T } | { type: "error", value: E }) {
//     this.rep = rep;
//   }

//   isOk(): boolean {
//     return this.rep.type === "ok";
//   }

//   isErr(): boolean {
//     return this.rep.type === "error";
//   }

//   mapErr<E2>(f: (E) => E2): Result<T, E2> {
//     return this.rep.type === "error" ? Err(f(this.rep.value)) : this;
//   }

//   map<T2>(f: (T) => T2): Result<T2, E> {
//     return this.rep.type === "ok" ? Ok(f(this.rep.value)) : this;
//   }

//   andThen<T2, E2>(f: (T) => Result<T2, E2>): Result<T2, E | E2> {
//     return this.rep.type === "ok" ? f(this.rep.value) : this;
//   }

//   orElse<T2, E2>(f: (E) => Result<T2, E2>): Result<T | T2, E2> {
//     return this.rep.type === "error" ? f(this.rep.value) : this;
//   }

//   unsafeUnwrap(): T {
//     if (this.rep.type === "ok") return this.rep.value;
//     else if (this.rep.value.toString)
//       throw new Error(
//         `Unwrapped result with err: ${this.rep.value.toString()}`
//       );
//     else
//       throw new Error(`Unwrapped result with err`);
//   }

//   unsafeUnwrapError(): E {
//     if (this.rep.type === "error") return this.rep.value;
//     else if (this.rep.value.toString)
//       throw new Error(
//         `Unwrapped result with err: ${this.rep.value.toString()}`
//       );
//     else
//       throw new Error(`Unwrapped result with err`);
//   }
// }

// export function Err<E: MaybeToString>(value: E): Result<any, E> {
//   return new ResultImpl({ type: "error", value });
// }

// export function Ok<T: MaybeToString>(value: T): Result<T, any> {
//   return new ResultImpl({ type: "ok", value });
// }

// export function fromList<T: MaybeToString, E: MaybeToString>(
//   listOfResults: Result<T, E>[]
// ): Result<T[], E[]> {
//   const errs = listOfResults.filter(r => r.isErr());
//   if (errs.length) return Err(errs.map(e => e.unsafeUnwrapError()));
//   else return Ok(listOfResults.map(o => o.unsafeUnwrap()));
// }
