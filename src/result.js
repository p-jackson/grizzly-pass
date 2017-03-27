class Result {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  isOk() {
    return this.type === "ok";
  }

  isErr() {
    return this.type === "error";
  }

  mapErr(f) {
    return this.isErr() ? Err(f(this.value)) : this;
  }

  map(f) {
    return this.isOk() ? Ok(f(this.value)) : this;
  }

  andThen(f) {
    return this.isOk() ? f(this.value) : this;
  }

  orElse(f) {
    return this.isErr() ? f(this.value) : this;
  }

  unsafeUnwrap() {
    if (this.isOk()) return this.value;
    else throw new Error(`Unwrapped result with err: ${this.value}`);
  }
}

export function Err(value) {
  return new Result("error", value);
}

export function Ok(value) {
  return new Result("ok", value);
}

export function fromList(listOfResults) {
  const errs = listOfResults.filter(r => r.isErr());
  if (errs.length) return Err(errs.map(e => e.value));
  else return Ok(listOfResults.map(o => o.value));
}
