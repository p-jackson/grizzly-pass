import * as fileUtils from "./file-utils";

class MockFileReader {
  onload?: () => void;
  onerror?: (e: any) => void;
  result?: string;

  readAsText(
    file: { type: "text"; text: string } | { type: "error"; error: any }
  ) {
    setTimeout(() => {
      expect(this.onload).not.toBe(null);
      expect(this.onerror).not.toBe(null);
      if (file.type === "text" && this.onload != null) {
        this.result = file.text;
        this.onload();
      } else if (file.type === "error" && this.onerror != null) {
        this.onerror(file.error);
      }
    }, 0);
  }
}

const readFileAsText = fileUtils.readFileAsText(MockFileReader as any);

it("returns the files contents", async () => {
  expect(await readFileAsText({ type: "text", text: "File Text" } as any)).toBe(
    "File Text"
  );
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
