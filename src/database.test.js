// @flow

import { init } from "./database";

describe("init", () => {
  it("returns null if the browser doesn't support IndexedDB", async () => {
    expect(await init({})).toBe(null);
  });

  it("creates a schema in the GrizzlyPassDatabase with default data", async () => {
    const projects = {
      createIndex: jest.fn()
    };
    const db = {
      createObjectStore: jest.fn(name => {
        if (name === "Projects") return projects;
      })
    };
    const openRequest = {
      onsuccess: null,
      onupgradeneeded: null
    };
    const indexedDB: any = {
      open: jest.fn(() => {
        setTimeout(
          () => {
            expect(openRequest.onupgradeneeded).not.toBe(null);
            if (openRequest.onupgradeneeded)
              openRequest.onupgradeneeded({ target: { result: db } });
            expect(openRequest.onsuccess).not.toBe(null);
            if (openRequest.onsuccess)
              openRequest.onsuccess({ target: { result: db } });
          },
          0
        );
        return openRequest;
      })
    };

    const dbResult = await init({ indexedDB });
    expect(dbResult).toBe(db);
    expect(indexedDB.open).toHaveBeenCalledWith("GrizzlyPassDatabase", 1);
    expect(db.createObjectStore).toHaveBeenCalledWith("Documents", {
      keyPath: "id",
      autoIncrement: true
    });
    expect(db.createObjectStore).toHaveBeenCalledWith("Projects", {
      keyPath: "id",
      autoIncrement: true
    });
    expect(db.createObjectStore).toHaveBeenCalledWith("Labels", {
      keyPath: "id",
      autoIncrement: true
    });
    expect(
      projects.createIndex
    ).toHaveBeenCalledWith("documentId", "documentId", { unique: false });
  });

  it("rejects the promise if on error is called", async () => {
    const request = {
      onerror: null,
      error: { error: "error" }
    };
    const indexedDB: any = {
      open: jest.fn(() => {
        setTimeout(
          () => {
            expect(request.onerror).not.toBe(null);
            if (request.onerror) request.onerror({ error: "error" });
          },
          0
        );
        return request;
      })
    };

    try {
      await init({ indexedDB });
      // Should not get here:
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toEqual({ error: "error" });
    }
  });

  it("rejects the promise if the requested object store already exists", async () => {
    const db = {
      createObjectStore: jest.fn(() => {
        const error = { error: "object store already exists" };
        throw error;
      })
    };
    const request = {
      onupgradeneeded: null
    };
    const indexedDB: any = {
      open: jest.fn(() => {
        setTimeout(
          () => {
            expect(request.onupgradeneeded).not.toBe(null);
            if (request.onupgradeneeded)
              request.onupgradeneeded({ target: { result: db } });
          },
          0
        );
        return request;
      })
    };

    try {
      await init({ indexedDB });
      // Should not get here:
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toEqual({ error: "object store already exists" });
    }
  });
});
