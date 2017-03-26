import { Err, Ok } from "./result";

it("returns the value if an ok result is unsafeUnwrap'd", () => {
  expect(Ok(113).unsafeUnwrap()).toBe(113);
});

it("throws if an error result is unsafeUnwrap'd", () => {
  expect(() => Err("bad").unsafeUnwrap()).toThrowErrorMatchingSnapshot();
});

it("leaves an ok result unchanged when mapErr is called", () => {
  expect(Ok(113).mapErr(i => i + 1)).toEqual(Ok(113));
});

it("changes an err result when mapErr is called", () => {
  expect(Err(113).mapErr(i => i + 1)).toEqual(Err(114));
});

it("changes an ok result when map is called", () => {
  expect(Ok(113).map(i => i + 1)).toEqual(Ok(114));
});

it("leaves an err result unchanged when map is called", () => {
  expect(Err(113).map(i => i + 1)).toEqual(Err(113));
});

it("users the returned result when flatMap is called", () => {
  expect(Ok(113).flatMap(i => Err("to error"))).toEqual(Err("to error"));
});

it("leaves an err result unchanged when flatMmap is called", () => {
  expect(Err(113).flatMap(i => Err(i + 1))).toEqual(Err(113));
});
