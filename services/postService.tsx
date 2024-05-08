import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export const createTables = async () => {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      "create table if not exists parsers (id integer primary key not null, name text not null, fields text not null, prompts text not null);",
      [],
    );
    console.log("CREATED PARSERS TABLE");
    await tx.executeSqlAsync(
      "create table if not exists images_data (id integer primary key not null, name text not null, fields text not null, data text not null, parser_id integer not null, foreign key(parser_id) references parsers(id));",
      [],
    );
    console.log("CREATED IMAGES_DATA TABLE");
  });
};

export const getAllParsers = async () => {
  let result;
  await db.transactionAsync(async (tx) => {
    const { rows } = await tx.executeSqlAsync(
      "select * from parsers order by name asc;",
      [],
    );
    result = rows;
    console.log("GET ALL PARSERS: " + JSON.stringify(result));
  });
  return result;
};

export const getAllImagesData = async () => {
  let result;
  await db.transactionAsync(async (tx) => {
    const { rows } = await tx.executeSqlAsync(
      "select * from images_data order by name asc;",
      [],
    );
    result = rows;
    console.log("GET ALL images_data: " + JSON.stringify(result));
  });
  return result;
};

export const getParser = async (id) => {
  let result;
  await db.transactionAsync(async (tx) => {
    const { rows } = await tx.executeSqlAsync(
      "select * from parsers where id = ?;",
      [id],
    );
    result = rows;
    console.log("GET ONE PARSER: " + JSON.stringify(result));
  });
  return result;
};

export const getImageData = async (id, isParserId) => {
  let result;
  await db.transactionAsync(async (tx) => {
    const { rows } = await tx.executeSqlAsync(
      isParserId
        ? "select * from images_data where parser_id = ?"
        : "select * from images_data where id = ?;",
      [id],
    );
    result = rows;
    console.log("GET ONE IMAGE DATA: " + JSON.stringify(result));
  });
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
  await db.transactionAsync(async (tx) => {
    const names = await tx.executeSqlAsync(
      "select * from parsers where name = ?",
      [name],
    );
    if (names.rows.length) {
      throw new Error("Parser name already exists");
    }
    const stringifiedFieldNames = JSON.stringify(fieldNames);
    const stringifiedRows = JSON.stringify(rows);
    const result = await tx.executeSqlAsync(
      "insert into parsers (name, fields, prompts) values (?, ?, ?)",
      [name, stringifiedFieldNames, stringifiedRows],
    );
    console.log("POSTED PARSER: " + JSON.stringify(result));
  });
};

export const postImageData = async (name, fieldNames, rows, parserId) => {
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
      typeof parserId === "string" &&
      parserId.length
    )
  ) {
    throw new Error("Invalid data type");
  }
  await db.transactionAsync(async (tx) => {
    const names = await tx.executeSqlAsync(
      "select * from images_data where name = ?",
      [name],
    );
    if (names.rows.length) {
      throw new Error("Table name already exists");
    }
    const stringifiedFieldNames = JSON.stringify(fieldNames);
    const stringifiedRows = JSON.stringify(rows);
    const result = await tx.executeSqlAsync(
      "insert into images_data (name, fields, data, parser_id) values (?, ?, ?, ?)",
      [name, stringifiedFieldNames, stringifiedRows, parserId],
    );
    console.log("POSTED IMAGE DATA: " + JSON.stringify(result));
  });
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
  await db.transactionAsync(async (tx) => {
    const names = await tx.executeSqlAsync(
      "select * from parsers where name = ? and id != ?;",
      [name, id],
    );
    if (names.rows.length) {
      throw new Error("Parser name already exists");
    }
    const stringifiedFieldNames = JSON.stringify(fieldNames);
    const stringifiedRows = JSON.stringify(rows);
    const result = await tx.executeSqlAsync(
      `update parsers set name = ?, fields = ?, prompts = ? where id = ?;`,
      [name, stringifiedFieldNames, stringifiedRows, id],
    );
    console.log("UPDATED PARSER: " + JSON.stringify(result));
  });
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
  await db.transactionAsync(async (tx) => {
    const names = await tx.executeSqlAsync(
      isParserId
        ? "select * from images_data where name = ? and parser_id != ?;"
        : "select * from images_data where name = ? and id != ?;",
      [name, id],
    );
    if (names.rows.length) {
      throw new Error("Parser name already exists");
    }
    const stringifiedFieldNames = JSON.stringify(fieldNames);
    const stringifiedRows = JSON.stringify(rows);
    const result = await tx.executeSqlAsync(
      isParserId
        ? `update images_data set name = ?, fields = ?, data = ? where parser_id = ?;`
        : `update images_data set name = ?, fields = ?, data = ? where id = ?;`,
      [name, stringifiedFieldNames, stringifiedRows, id],
    );
    console.log("UPDATED IMAGE DATA: " + JSON.stringify(result));
  });
};

export const deleteParser = async (id) => {
  await db.transactionAsync(async (tx) => {
    const result = await tx.executeSqlAsync(
      `delete from parsers where id = ?;`,
      [id],
    );
    console.log("DELETED ONE: " + JSON.stringify(result));
  });
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
  await db.transactionAsync(async (tx) => {
    const result = await tx.executeSqlAsync(`delete from parsers;`, []);
    console.log("DELETED ALL PARSERS: " + JSON.stringify(result));
    const { rows } = await tx.executeSqlAsync("select * from images_data", []); //NOT FOR PRODUCTION
    console.log("GET ALL IMAGE DATA (SHOULD BE NONE): " + JSON.stringify(rows));
  });
};

export const dropAll = async () => {
  try {
    await db.transactionAsync(async (tx) => {
      const result1 = await tx.executeSqlAsync(
        `drop table if exists parsers`,
        [],
      );
      console.log("DROPPED TABLE parsers: " + JSON.stringify(result1));
      const result2 = await tx.executeSqlAsync(
        `drop table if exists images_data`,
        [],
      );
      console.log("DROPPED TABLE images_data: " + JSON.stringify(result2));
    });

    await db.transactionAsync(async (tx) => {
      const result3 = await tx.executeSqlAsync(
        "create table if not exists parsers (id integer primary key not null, name text unique, fields text, prompts text);",
        [],
      );
      console.log("CREATED PARSERS TABLE: " + JSON.stringify(result3));
      const result4 = await tx.executeSqlAsync(
        "create table if not exists images_data (id integer primary key not null, name text unique, fields text, data text, parser_id integer, foreign key(parser_id) references parsers(id));",
        [],
      );
      console.log("CREATED IMAGES_DATA TABLE: " + JSON.stringify(result4));
    });
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
