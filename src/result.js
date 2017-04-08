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
