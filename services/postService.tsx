import * as SQLite from "expo-sqlite";

let db = null;

(async () => {
  db = await SQLite.openDatabaseAsync("db.db");
  await db.execAsync("PRAGMA journal_mode = WAL");
  await db.execAsync("PRAGMA foreign_keys = ON");
})();

const validateQuery = (query) => {
  for (const [key, value] of Object.entries(query)) {
    if (key === "name" && value) {
      if (!(typeof value === "string" && value.length)) {
        throw new Error(`Invalid data type for "name"`);
      }
    }

    if (key === "headers" && value) {
      if (
        !(
          Array.isArray(value) &&
          value.length &&
          value.every(
            (header) => typeof header === "string" && header.length,
          )
        )
      ) {
        throw new Error(`Invalid data type for "headers"`);
      }
    }

    if (key === "parserRows" && value) {
      if (
        !(
          Array.isArray(value) &&
          value.length === 1 &&
          value.every(
            (row) =>
              Array.isArray(row) &&
              row.length === query.headers?.length &&
              row.every((cell) => typeof cell === "string" && cell.length),
          )
        )
      ) {
        throw new Error(`Invalid data type for "parserRows"`);
      }
    }

    if (key === "parserDataRows" && value) {
      if (
        !(
          Array.isArray(value) &&
          value.every(
            (row) =>
              Array.isArray(row) &&
              row.length === query.headers.length &&
              row.every((cell) => typeof cell === "string"),
          )
        )
      ) {
        throw new Error(`Invalid data type for "parserDataRows"`);
      }
    }

    if (key === "images" && value) {
      if (
        !(
          Array.isArray(value) &&
          value.every(
            (imagePair) =>
              Array.isArray(imagePair) &&
              imagePair.length === 2 &&
              imagePair.every(
                (image) =>
                  (typeof image === "string" && image.length) ||
                  typeof image === "object",
              ),
          )
        )
      ) {
        throw new Error(`Invalid data type for "images"`);
      }
    }

    if (key === "parserId" && value) {
      if (!(typeof value === "string" && value.length)) {
        throw new Error(`Invalid data type for "parserId"`);
      }
    }

    if (key === "parserDataId" && value) {
      if (!(typeof value === "string" && value.length)) {
        throw new Error(`Invalid data type for "parserDataId"`);
      }
    }
  }
};

export const createTables = async () => {
  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS parsers (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, headers TEXT NOT NULL, rows TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS parsers_data (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, headers TEXT NOT NULL, rows TEXT NOT NULL, images TEXT NOT NULL, parser_id INTEGER NOT NULL, FOREIGN KEY(parser_id) REFERENCES parsers(id) ON DELETE CASCADE);`);
};

export const getAllParsers = async () => {
  const result = await db.getAllAsync(
    "SELECT * FROM parsers ORDER BY name ASC;",
  );
  return result;
};

export const getAllParserData = async () => {
  const result = await db.getAllAsync(
    "SELECT * FROM parsers_data ORDER BY name ASC;",
  );
  return result;
};

export const getParser = async (query) => {
  const { parserId, name } = query;
  const result = await db.getFirstAsync(
    "SELECT * FROM parsers WHERE id = CAST(? AS INTEGER) OR name = ?",
    [parserId, name],
  );
  return {
    parserId: result.id.toString(),
    name: result.name,
    headers: JSON.parse(result.headers),
    parserRows: JSON.parse(result.rows),
  };
};

export const getParserData = async (query) => {
  const { parserDataId, parserId } = query;
  const result = await db.getFirstAsync(
    "SELECT * FROM parsers_data WHERE id = CAST(? AS INTEGER) OR parser_id = CAST(? AS INTEGER)",
    [parserDataId, parserId],
  );
  return {
    parserDataId: result.id.toString(),
    name: result.name,
    headers: JSON.parse(result.headers),
    parserDataRows: JSON.parse(result.rows),
    images: JSON.parse(result.images),
  };
};

export const postParser = async (query) => {
  const { name, headers, parserRows } = query;
  validateQuery(query);
  const stringifiedHeaders = JSON.stringify(headers);
  const stringifiedRows = JSON.stringify(parserRows);
  await db.runAsync(
    "INSERT INTO parsers (name, headers, rows) VALUES (?, ?, ?)",
    [name, stringifiedHeaders, stringifiedRows],
  );
};

export const postParserData = async (query) => {
  const { name, headers, parserDataRows, images, parserId } = query;
  validateQuery(query);
  const stringifiedHeaders = JSON.stringify(headers);
  const stringifiedRows = JSON.stringify(parserDataRows);
  const stringifiedImages = JSON.stringify(images);
  await db.runAsync(
    "INSERT INTO parsers_data (name, headers, rows, images, parser_id) VALUES (?, ?, ?, ?, ?)",
    [name, stringifiedHeaders, stringifiedRows, stringifiedImages, parserId],
  );
};

export const updateParser = async (query) => {
  const { name, headers, parserRows, parserId } = query;
  validateQuery(query);
  const stringifiedHeaders = JSON.stringify(headers);
  const stringifiedRows = JSON.stringify(parserRows);
  await db.runAsync(
    `UPDATE parsers 
    SET name = CASE WHEN ? IS NOT NULL THEN ? ELSE name END, 
    headers = ?, 
    rows = CASE WHEN ? IS NOT NULL THEN ? ELSE rows END
    WHERE id = CAST(? AS INTEGER);`,
    [
      name,
      name,
      stringifiedHeaders,
      stringifiedRows,
      stringifiedRows,
      parserId,
    ],
  );
};

export const updateParserData = async (query) => {
  const { name, headers, parserDataRows, images, parserDataId, parserId } =
    query;
  validateQuery(query);
  const stringifiedHeaders = JSON.stringify(headers);
  const stringifiedRows = JSON.stringify(parserDataRows);
  const stringifiedImages = JSON.stringify(images);
  await db.runAsync(
    `UPDATE parsers_data 
    SET name = CASE WHEN ? IS NOT NULL THEN ? ELSE name END, 
    headers = ?, 
    rows = CASE WHEN ? IS NOT NULL THEN ? ELSE rows END,
    images = CASE WHEN ? IS NOT NULL THEN ? ELSE images END
    WHERE id = ? OR parser_id = ?;`,
    [
      name,
      name,
      stringifiedHeaders,
      stringifiedRows,
      stringifiedRows,
      stringifiedImages,
      stringifiedImages,
      parserDataId,
      parserId,
    ],
  );
};

export const deleteParser = async (parserId) => {
  await db.runAsync(`DELETE FROM parsers WHERE id = ?;`, [parserId]);
};

export const deleteAll = async () => {
  await db.runAsync(`DELETE FROM parsers;`);
};

export const dropParsersTable = async () => {
  try {
    await db.execAsync(`DROP TABLE IF EXISTS parsers`);
  } catch (err) {
    alert(err);
    console.error(err);
  }
};

export const dropParsersDataTable = async () => {
  try {
    await db.execAsync(`DROP TABLE IF EXISTS parsers_data`);
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
