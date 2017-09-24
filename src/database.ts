import * as debugFactory from "debug";
const debug = debugFactory("gp:database");

export function init({
  indexedDB
}: {
  indexedDB?: IDBFactory;
}): Promise<IDBDatabase | null> {
  if (!indexedDB) {
    debug("Browser doesn't support indexedDB");
    return Promise.resolve(null);
  }

  // Closure needed to satisfy type-checker
  const factory = indexedDB;

  return new Promise((resolve, reject) => {
    const request = factory.open("GrizzlyPassDatabase", 1);

    request.onerror = event => {
      const { error } = request;
      debug("error opening database");
      reject(error);
    };

    request.onsuccess = event => {
      debug("open request was successful");
      resolve((event.target as any).result);
    };

    request.onupgradeneeded = event => {
      debug("database upgrade required");
      try {
        const db = (event.target as any).result;
        db.createObjectStore("Documents", {
          keyPath: "id",
          autoIncrement: true
        });
        const projects = db.createObjectStore("Projects", {
          keyPath: "id",
          autoIncrement: true
        });
        projects.createIndex("documentId", "documentId", {
          unique: false
        });
        db.createObjectStore("Labels", { keyPath: "id", autoIncrement: true });
      } catch (e) {
        debug("error while upgrading schema");
        reject(e);
      }
    };
  });
}
