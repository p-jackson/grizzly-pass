import * as fileUtils from "./file-utils";

class MockFileReader {
  constructor() {
    this.onload = null;
    this.onerror = null;
  }

  readAsText(file) {
    setTimeout(
      () => {
        expect(this.onload).not.toBe(null);
        expect(this.onerror).not.toBe(null);
        if (file.text) {
          this.result = file.text;
          this.onload();
        } else if (file.error) this.onerror(file.error);
      },
      0
    );
  }
}

const readFileAsText = fileUtils.readFileAsText(MockFileReader);

it("returns the files contents", async () => {
  expect(await readFileAsText({ text: "File Text" })).toBe("File Text");
});

it("rejects the promise if there's a problem reading the file", async () => {
  try {
    await readFileAsText({ error: { error: "error" } });
    // Should not get here:
    expect(true).toBe(false);
  } catch (e) {
    expect(e).toEqual({ error: "error" });
  }
});
