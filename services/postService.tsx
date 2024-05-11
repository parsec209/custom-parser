import * as SQLite from "expo-sqlite";

let db = null;

(async () => {
  db = await SQLite.openDatabaseAsync("db.db");
  await db.execAsync("PRAGMA journal_mode = WAL");
  await db.execAsync("PRAGMA foreign_keys = ON");
})();

export const createTables = async () => {
  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS parsers (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, fields TEXT NOT NULL, prompts TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS images_data (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, fields TEXT NOT NULL, data TEXT NOT NULL, parser_id INTEGER NOT NULL, FOREIGN KEY(parser_id) REFERENCES parsers(id) ON DELETE CASCADE);`);
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

export const getParserById = async (id) => {
  const result = await db.getFirstAsync("SELECT * FROM parsers WHERE id = ?;", [
    id,
  ]);
  console.log("GET ONE PARSER: " + JSON.stringify(result));
  return result;
};

export const getParserByName = async (name) => {
  const result = await db.getFirstAsync(
    "SELECT * FROM parsers WHERE name = ?",
    [name],
  );
  console.log("GET ONE PARSER: " + JSON.stringify(result));
  return result;
};

export const getImageData = async (id, isParserId) => {
  const result = await db.getFirstAsync(
    isParserId
      ? "SELECT * FROM images_data WHERE parser_id = ?"
      : "SELECT * FROM images_data WHERE id = ?;",
    [id],
  );
  console.log("GET ONE IMAGE DATA: " + JSON.stringify(result));
  return result;
};

export const postParser = async (name, fieldNames, rows) => {
  if (
    !(
      typeof name === "string" &&
      name.length &&
      Array.isArray(fieldNames) &&
      fieldNames.length &&
      fieldNames.every(
        (fieldName) => typeof fieldName === "string" && fieldName.length,
      ) &&
      Array.isArray(rows) &&
      rows.length === 1 &&
      rows.every(
        (row) =>
          Array.isArray(row) &&
          row.length === fieldNames.length &&
          row.every((cell) => typeof cell === "string" && cell.length),
      )
    )
  ) {
    throw new Error("Invalid data type");
  }
  // const names = await db.getAllAsync(
  //   "SELECT * FROM parsers WHERE name = ?",
  //   [name],
  // );
  // if (names.length) {
  //   throw new Error("Parser name already exists");
  // }
  const stringifiedFieldNames = JSON.stringify(fieldNames);
  const stringifiedRows = JSON.stringify(rows);
  const result = await db.runAsync(
    "INSERT INTO parsers (name, fields, prompts) VALUES (?, ?, ?)",
    [name, stringifiedFieldNames, stringifiedRows],
  );
  console.log("POSTED PARSER: " + JSON.stringify(result));
};

export const postImageData = async (name, fieldNames, rows, parserId) => {
  if (!(typeof name === "string" && name.length)) {
    throw new Error(`Invalid data type for "name"`);
  }

  if (
    !(
      Array.isArray(fieldNames) &&
      fieldNames.length &&
      fieldNames.every(
        (fieldName) => typeof fieldName === "string" && fieldName.length,
      )
    )
  ) {
    throw new Error(`Invalid data type for "fields"`);
  }

  if (
    !(
      Array.isArray(rows) &&
      rows.every(
        (row) =>
          Array.isArray(row) &&
          row.length === fieldNames.length &&
          row.every((cell) => typeof cell === "string"),
      )
    )
  ) {
    throw new Error(`Invalid data type for "data"`);
  }
  if (!(typeof parserId === "string" && parserId.length)) {
    throw new Error(`Invalid data type for "parser_id"`);
  }

  // const names = await db.getAllAsync(
  //   "SELECT * FROM  images_data WHERE name = ?",
  //   [name],
  // );
  // if (names.length) {
  //   throw new Error("Table name already exists");
  // }
  const stringifiedFieldNames = JSON.stringify(fieldNames);
  const stringifiedRows = JSON.stringify(rows);
  const result = await db.runAsync(
    "INSERT INTO images_data (name, fields, data, parser_id) VALUES (?, ?, ?, ?)",
    [name, stringifiedFieldNames, stringifiedRows, parserId],
  );
  console.log("POSTED IMAGE DATA: " + JSON.stringify(result));
};

export const updateParser = async (name, fieldNames, rows, id) => {
  if (
    !(
      typeof name === "string" &&
      name.length &&
      Array.isArray(fieldNames) &&
      fieldNames.length &&
      fieldNames.every(
        (fieldName) => typeof fieldName === "string" && fieldName.length,
      ) &&
      Array.isArray(rows) &&
      rows.length === 1 &&
      rows.every(
        (row) =>
          Array.isArray(row) &&
          row.length === fieldNames.length &&
          row.every((cell) => typeof cell === "string" && cell.length),
      ) &&
      typeof id === "string" &&
      id.length
    )
  ) {
    throw new Error("Invalid data type");
  }
  // const names = await db.getAllAsync(
  //   "SELECT * FROM parsers WHERE name = ? AND id != ?",
  //   [name, id],
  // );
  // if (names.length) {
  //   throw new Error("Parser name already exists");
  // }
  const stringifiedFieldNames = JSON.stringify(fieldNames);
  const stringifiedRows = JSON.stringify(rows);
  const result = await db.runAsync(
    `UPDATE parsers SET name = ?, fields = ?, prompts = ? WHERE id = ?;`,
    [name, stringifiedFieldNames, stringifiedRows, id],
  );
  console.log("UPDATED PARSER: " + JSON.stringify(result));
};

export const updateImageData = async (
  name,
  fieldNames,
  rows,
  id,
  isParserId,
) => {
  if (
    !(
      typeof name === "string" &&
      name.length &&
      Array.isArray(fieldNames) &&
      fieldNames.length &&
      fieldNames.every(
        (fieldName) => typeof fieldName === "string" && fieldName.length,
      ) &&
      Array.isArray(rows) &&
      rows.every(
        (row) =>
          Array.isArray(row) &&
          row.length === fieldNames.length &&
          row.every((cell) => typeof cell === "string"),
      ) &&
      typeof id === "string" &&
      id.length
    )
  ) {
    throw new Error("Invalid data type");
  }
  // const names = await tx.executeSqlAsync(
  //   isParserId
  //     ? "select * from images_data where name = ? and parser_id != ?;"
  //     : "select * from images_data where name = ? and id != ?;",
  //   [name, id],
  // );
  // if (names.rows.length) {
  //   throw new Error("Parser name already exists");
  // }
  const stringifiedFieldNames = JSON.stringify(fieldNames);
  const stringifiedRows = JSON.stringify(rows);
  const result = await db.runAsync(
    isParserId
      ? `UPDATE images_data SET name = ?, fields = ?, data = ? WHERE parser_id = ?;`
      : `UPDATE images_data SET name = ?, fields = ?, data = ? WHERE id = ?;`,
    [name, stringifiedFieldNames, stringifiedRows, id],
  );
  console.log("UPDATED IMAGE DATA: " + JSON.stringify(result));
};

export const deleteParser = async (id) => {
  const result = await db.runAsync(`DELETE FROM parsers WHERE id = ?;`, [id]);
  console.log("DELETED ONE: " + JSON.stringify(result));
};

// export const deleteImageData = async (id) => {
//   await db.transactionAsync(async (tx) => {
//     const result = await tx.executeSqlAsync(
//       `delete from parsers where id = ?;`,
//       [id],
//     );
//     console.log("DELETED ONE: " + JSON.stringify(result));
//   });
// };

export const deleteAll = async () => {
  const result = await db.runAsync(`DELETE FROM parsers;`);
  console.log("DELETED ALL PARSERS: " + JSON.stringify(result));
  const result2 = await db.getAllAsync("SELECT * FROM images_data"); //NOT FOR PRODUCTION
  console.log(
    "GET ALL IMAGE DATA (SHOULD BE EMPTY): " + JSON.stringify(result2),
  );
};

export const dropParsersTable = async () => {
  try {
    await db.execAsync(
      `DROP TABLE IF EXISTS parsers`,
    );
    console.log("successfully dropped parsers");
  } catch (err) {
    alert(err);
    console.error(err);
  }
};

export const dropImagesDataTable = async () => {
  try {
    await db.execAsync(
      `DROP TABLE IF EXISTS images_data`,
    );
    console.log("successfully dropped images");
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
