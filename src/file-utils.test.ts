import * as fileUtils from "./file-utils";

type MockFile
  = { type: "ok", text: string; }
  | { type: "error", error: { error: string; }; }

class MockFileReader {
  onload: Function | null;
  onerror: Function | null;
  result?: string;

  constructor() {
    this.onload = null;
    this.onerror = null;
  }

  readAsText(file: MockFile) {
    setTimeout(
      () => {
        expect(this.onload).not.toBe(null);
        expect(this.onerror).not.toBe(null);
        if (file.type === "ok" && this.onload) {
          this.result = file.text;
          this.onload();
        } else if (file.type === "error" && this.onerror)
          this.onerror(file.error);
      },
      0
    );
  }
}

const readFileAsText = fileUtils.readFileAsText(MockFileReader as any);

it("returns the files contents", async () => {
  expect(await readFileAsText({ type: "ok", text: "File Text" } as any)).toBe("File Text");
});

it("rejects the promise if there's a problem reading the file", async () => {
  try {
    await readFileAsText({ type: "error", error: { error: "error" } } as any);
    // Should not get here:
    expect(true).toBe(false);
  } catch (e) {
    expect(e).toEqual({ error: "error" });
  }
});
