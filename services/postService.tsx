import * as SQLite from "expo-sqlite";

let db = null;

(async () => {
  db = await SQLite.openDatabaseAsync("db.db");
  await db.execAsync("PRAGMA journal_mode = WAL");
  await db.execAsync("PRAGMA foreign_keys = ON");
})();

const validateQuery = (query) => {
  const {
    name,
    fieldNames,
    parserRows,
    imageDataRows,
    images,
    parserId,
    imageDataId,
  } = query;
  for (const [key, value] of Object.entries(query)) {
    if (key === "name" && value) {
      if (!(typeof value === "string" && value.length)) {
        throw new Error(`Invalid data type for "name"`);
      }
    }

    if (key === "fieldNames" && value) {
      if (
        !(
          Array.isArray(value) &&
          value.length &&
          value.every(
            (fieldName) => typeof fieldName === "string" && fieldName.length,
          )
        )
      ) {
        throw new Error(`Invalid data type for "fieldNames"`);
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
              row.length === fieldNames?.length &&
              row.every((cell) => typeof cell === "string" && cell.length),
          )
        )
      ) {
        throw new Error(`Invalid data type for "promptRows"`);
      }
    }

    if (key === "imageDataRows" && value) {
      if (
        !(
          Array.isArray(value) &&
          value.every(
            (row) =>
              Array.isArray(row) &&
              row.length === fieldNames.length &&
              row.every((cell) => typeof cell === "string"),
          )
        )
      ) {
        throw new Error(`Invalid data type for "imageDataRows"`);
      }
    }

    if (key === "images" && value) {
      console.log(JSON.stringify(images));
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

    if (key === "imageDataId" && value) {
      if (!(typeof value === "string" && value.length)) {
        throw new Error(`Invalid data type for "imageDataId"`);
      }
    }
  }
};

export const createTables = async () => {
  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS parsers (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, fields TEXT NOT NULL, prompts TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS images_data (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, fields TEXT NOT NULL, data TEXT NOT NULL, images TEXT NOT NULL, parser_id INTEGER NOT NULL, FOREIGN KEY(parser_id) REFERENCES parsers(id) ON DELETE CASCADE);`);
  console.log("CREATED PARSERS AND IMAGES_DATA TABLE");
};

export const getAllParsers = async () => {
  const result = await db.getAllAsync(
    "SELECT * FROM parsers ORDER BY name ASC;",
  );
  console.log("GET ALL PARSERS: " + JSON.stringify(result));
  return result;
};

export const getAllImagesData = async () => {
  const result = await db.getAllAsync(
    "SELECT * FROM images_data ORDER BY name ASC;",
  );
  console.log("GET ALL images_data: " + JSON.stringify(result));
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
    fieldNames: JSON.parse(result.fields),
    parserRows: JSON.parse(result.prompts),
  };
};

export const getImageData = async (query) => {
  const { imageDataId, parserId } = query;
  const result = await db.getFirstAsync(
    "SELECT * FROM images_data WHERE id = CAST(? AS INTEGER) OR parser_id = CAST(? AS INTEGER)",
    [imageDataId, parserId],
  );
  return {
    imageDataId: result.id.toString(),
    name: result.name,
    fieldNames: JSON.parse(result.fields),
    imageDataRows: JSON.parse(result.data),
    images: JSON.parse(result.images),
  };
};

export const postParser = async (query) => {
  const { name, fieldNames, parserRows } = query;
  validateQuery(query);
  const stringifiedFieldNames = JSON.stringify(fieldNames);
  const stringifiedRows = JSON.stringify(parserRows);
  await db.runAsync(
    "INSERT INTO parsers (name, fields, prompts) VALUES (?, ?, ?)",
    [name, stringifiedFieldNames, stringifiedRows],
  );
};

export const postImageData = async (query) => {
  const { name, fieldNames, imageDataRows, images, parserId } = query;
  validateQuery(query);
  const stringifiedFieldNames = JSON.stringify(fieldNames);
  const stringifiedRows = JSON.stringify(imageDataRows);
  const stringifiedImages = JSON.stringify(images);
  await db.runAsync(
    "INSERT INTO images_data (name, fields, data, images, parser_id) VALUES (?, ?, ?, ?, ?)",
    [name, stringifiedFieldNames, stringifiedRows, stringifiedImages, parserId],
  );
};

export const updateParser = async (query) => {
  const { name, fieldNames, parserRows, parserId } = query;
  validateQuery(query);
  const stringifiedFieldNames = JSON.stringify(fieldNames);
  const stringifiedRows = JSON.stringify(parserRows);
  await db.runAsync(
    `UPDATE parsers 
    SET name = CASE WHEN ? IS NOT NULL THEN ? ELSE name END, 
    fields = CASE WHEN ? IS NOT NULL THEN ? ELSE fields END, 
    prompts = CASE WHEN ? IS NOT NULL THEN ? ELSE prompts END
    WHERE id = CAST(? AS INTEGER);`,
    [
      name,
      name,
      stringifiedFieldNames,
      stringifiedFieldNames,
      stringifiedRows,
      stringifiedRows,
      parserId,
    ],
  );
};

export const updateImageData = async (query) => {
  const { name, fieldNames, imageDataRows, images, imageDataId, parserId } =
    query;
  validateQuery(query);
  const stringifiedFieldNames = JSON.stringify(fieldNames);
  const stringifiedRows = JSON.stringify(imageDataRows);
  const stringifiedImages = JSON.stringify(images);
  await db.runAsync(
    `UPDATE images_data 
    SET name = CASE WHEN ? IS NOT NULL THEN ? ELSE name END, 
    fields = CASE WHEN ? IS NOT NULL THEN ? ELSE fields END, 
    data = CASE WHEN ? IS NOT NULL THEN ? ELSE data END,
    images = CASE WHEN ? IS NOT NULL THEN ? ELSE images END
    WHERE id = ? OR parser_id = ?;`,
    [
      name,
      name,
      stringifiedFieldNames,
      stringifiedFieldNames,
      stringifiedRows,
      stringifiedRows,
      stringifiedImages,
      stringifiedImages,
      imageDataId,
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

export const dropImagesDataTable = async () => {
  try {
    await db.execAsync(`DROP TABLE IF EXISTS images_data`);
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
