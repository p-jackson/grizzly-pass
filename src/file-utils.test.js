// @flow

import * as fileUtils from "./file-utils";

class MockFileReader {
  onload: ?() => void;
  onerror: ?(mixed) => void;
  result: ?string;

  readAsText(file: {| text: string |} | {| error: mixed |}) {
    setTimeout(
      () => {
        expect(this.onload).not.toBe(null);
        expect(this.onerror).not.toBe(null);
        if (file.text && this.onload != null) {
          this.result = file.text;
          this.onload();
        } else if (file.error && this.onerror != null) this.onerror(file.error);
      },
      0
    );
  }
}

const readFileAsText = fileUtils.readFileAsText((MockFileReader: any));

it("returns the files contents", async () => {
  expect(await readFileAsText(({ text: "File Text" }: any))).toBe("File Text");
});

it("rejects the promise if there's a problem reading the file", async () => {
  try {
    await readFileAsText(({ error: { error: "error" } }: any));
    // Should not get here:
    expect(true).toBe(false);
  } catch (e) {
    expect(e).toEqual({ error: "error" });
  }
});
