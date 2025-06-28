import * as assert from "assert";
import { err, ok, fromList } from "./result";

it("returns the value if an ok result is unsafeUnwrap'd", () => {
  const value = ok(113).unsafeUnwrap();
  expect(value).toBe(113);
});

it("throws if an error Result<_, string> is unsafeUnwrap'd", () => {
  expect(() => err("bad").unsafeUnwrap()).toThrowErrorMatchingSnapshot();
});

it("throws if an error Result<_, []> is unsafeUnwrap'd", () => {
  expect(() =>
    err(["bad", "bad"]).unsafeUnwrap(),
  ).toThrowErrorMatchingSnapshot();
});

it("throws if an error Result<_, T> is unsafeUnwrap'd (where T doesn't have a toString)", () => {
  const obj = Object.create(null);
  expect(() => err(obj).unsafeUnwrap()).toThrowErrorMatchingSnapshot();
});

it("leaves an ok result unchanged when mapErr is called", () => {
  const result = ok(113).mapErr(() => assert.fail());
  expect(result).toEqual(ok(113));
});

it("changes an err result when mapErr is called", () => {
  const result = err(113).mapErr((i) => i + 1);
  expect(result).toEqual(err(114));
});

it("changes an ok result when map is called", () => {
  const result = ok(113).map((i) => i + 1);
  expect(result).toEqual(ok(114));
});

it("leaves an err result unchanged when map is called", () => {
  const result = err(113).map(() => assert.fail());
  expect(result).toEqual(err(113));
});

it("uses the returned result when andThen is called", () => {
  const result = ok(113).andThen(() => err("to error"));
  expect(result).toEqual(err("to error"));
});

it("leaves an err result unchanged when andThen is called", () => {
  const result = err(113).andThen(() => assert.fail());
  expect(result).toEqual(err(113));
});

it("uses the returned result when orElse is called", () => {
  const result = err(113).orElse((i) => err(i + 1));
  expect(result).toEqual(err(114));
});

it("leaves an ok result unchanged when orElse is called", () => {
  const result = ok(113).orElse(() => assert.fail());
  expect(result).toEqual(ok(113));
});

it("returns true from isOk when result is ok", () => {
  expect(ok(undefined).isOk()).toBe(true);
});

it("returns false from isOk when result is err", () => {
  expect(err(undefined).isOk()).toBe(false);
});

it("returns true from isErr when result is err", () => {
  expect(err(undefined).isErr()).toBe(true);
});

it("returns false from isErr when result is ok", () => {
  expect(ok(undefined).isErr()).toBe(false);
});

describe("fromList", () => {
  it("returns an ok result if all list elements are ok results", () => {
    expect(fromList([ok(1), ok(2), ok(3)])).toEqual(ok([1, 2, 3]));
  });

  it("results an err result if all list elements are err results", () => {
    expect(fromList([err(1), err(2)])).toEqual(err([1, 2]));
  });

  it("returns an err result if any list element is an err result", () => {
    expect(fromList([ok(1), err(2)])).toEqual(err([2]));
  });
});
