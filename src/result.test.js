// @flow

import flow from "lodash/flow";
import {
  err,
  ok,
  isOk,
  isErr,
  fromList,
  mapErr,
  map,
  andThen,
  orElse,
  unsafeUnwrap
} from "./result";

it("returns the value if an ok result is unsafeUnwrap'd", () => {
  expect(unsafeUnwrap(ok(113))).toBe(113);
});

it("throws if an error Result<_, string> is unsafeUnwrap'd", () => {
  expect(() => unsafeUnwrap(err("bad"))).toThrowErrorMatchingSnapshot();
});

it("throws if an error Result<_, []> is unsafeUnwrap'd", () => {
  expect(() =>
    unsafeUnwrap(err(["bad", "bad"]))).toThrowErrorMatchingSnapshot();
});

it("throws if an error Result<_, T> is unsafeUnwrap'd (where T doesn't have a toString)", () => {
  const obj = Object.create(null);
  expect(() => unsafeUnwrap(err(obj))).toThrowErrorMatchingSnapshot();
});

it("leaves an ok result unchanged when mapErr is called", () => {
  expect(flow(ok, mapErr(i => i + 1))(113)).toEqual(ok(113));
});

it("changes an err result when mapErr is called", () => {
  expect(flow(err, mapErr(i => i + 1))(113)).toEqual(err(114));
});

it("changes an ok result when map is called", () => {
  expect(flow(ok, map(i => i + 1))(113)).toEqual(ok(114));
});

it("leaves an err result unchanged when map is called", () => {
  expect(flow(err, map(i => i + 1))(113)).toEqual(err(113));
});

it("uses the returned result when andThen is called", () => {
  expect(flow(ok, andThen(i => err("to error")))(113)).toEqual(err("to error"));
});

it("leaves an err result unchanged when andThen is called", () => {
  expect(flow(err, andThen(i => err(i + 1)))(113)).toEqual(err(113));
});

it("uses the returned result when orElse is called", () => {
  expect(flow(err, orElse(i => err(i + 1)))(113)).toEqual(err(114));
});

it("leaves an ok result unchanged when orElse is called", () => {
  expect(flow(ok, orElse(i => err(i + 1)))(113)).toEqual(ok(113));
});

it("returns true from isOk when result is ok", () => {
  expect(isOk(ok())).toBe(true);
});

it("returns false from isOk when result is err", () => {
  expect(isOk(err())).toBe(false);
});

it("returns true from isErr when result is err", () => {
  expect(isErr(err())).toBe(true);
});

it("returns false from isErr when result is ok", () => {
  expect(isErr(ok())).toBe(false);
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
