import debugFactory from "debug";
const debug = debugFactory("gp:database");

export function init({ indexedDB }) {
  if (!indexedDB) {
    debug("Browser doesn't support indexedDB");
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("GrizzlyPassDatabase", 1);

    request.onerror = event => {
      const { error } = request;
      debug("error opening database");
      reject(error);
    };

    request.onsuccess = event => {
      debug("open request was successful");
      resolve(event.target.result);
    };

    request.onupgradeneeded = event => {
      debug("database upgrade required");
      try {
        const db = event.target.result;
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
