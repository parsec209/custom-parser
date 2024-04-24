import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export const createTables = async () => {
  try {
    await db.transactionAsync(async (tx) => {
      const result1 = await tx.executeSqlAsync(
        "create table if not exists parsers (id integer primary key not null, name text unique, fields text, prompts text);",
        [],
      );
      console.log("CREATED PARSERS TABLE: " + JSON.stringify(result1));
      const result2 = await tx.executeSqlAsync(
        "create table if not exists images_data (id integer primary key not null, name text unique, fields text, data text, parser_id integer, foreign key(parser_id) references parsers(id));",
        [],
      );
      console.log("CREATED IMAGES_DATA TABLE: " + JSON.stringify(result2));
    });
  } catch (err) {
    alert(err);
    console.error(err);
  }
};

export const getAllParsers = async () => {
  try {
    const result = await db.transactionAsync(async (tx) => {
      const {
        rows: { _array },
      } = await tx.executeSqlAsync(
        "select * from parsers order by name asc;",
        [],
      );
      console.log("GET ALL PARSERS: " + JSON.stringify(_array));
      return _array;
    });
    return result;
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
// setParsers(_array);
// setChecked(_array.length ? _array[0].name : null);

export const getParser = async (id) => {
  try {
    const result = await db.transactionAsync(async (tx) => {
      const {
        rows: { _array },
      } = await tx.executeSqlAsync("select * from parsers where id = ?;", [id]);
      console.log("GET ONE: " + JSON.stringify(_array));
      const result = _array[0];
      const fieldNames = JSON.parse(result.fields);
      const row = JSON.parse(result.prompts);
      const name = result.name;
      return { name, fieldNames, row };
    });
    return result;
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
// setName(_array[0].name);
// setFieldNames(parsedFields);
// setRows([parsedPrompts]);

export const postParser = async (name, fieldNames, row) => {
  try {
    await db.transactionAsync(async (tx) => {
      const stringifiedFieldNames = JSON.stringify(fieldNames);
      const stringifiedRow = JSON.stringify(row);
      const result = await tx.executeSqlAsync(
        "insert into parsers (name, fields, prompts) values (?, ?, ?)",
        [name, stringifiedFieldNames, stringifiedRow],
      );
      console.log("POSTED: " + JSON.stringify(result));
    });
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
//router.replace("./parsers");

export const updateParser = async (name, fieldNames, row, id) => {
  try {
    await db.transactionAsync(async (tx) => {
      const stringifiedFieldNames = JSON.stringify(fieldNames);
      const stringifiedRow = JSON.stringify(row);
      const result = await tx.executeSqlAsync(
        `update parsers set name = ?, fields = ?, prompts = ? where id = ?;`,
        [name, stringifiedFieldNames, stringifiedRow, id],
      );
      console.log("UPDATED: " + JSON.stringify(result));
    });
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
//router.replace("./parsers");

export const deleteParser = async (id) => {
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(
        `delete from parsers where id = ?;`,
        [id],
      );
      console.log("DELETED ONE: " + JSON.stringify(result));
    });
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
//    router.replace("./parsers");

export const getAllImagesData = async () => {
  try {
    const result = await db.transactionAsync(async (tx) => {
      const {
        rows: { _array },
      } = await tx.executeSqlAsync("select * from images_data", []);
      console.log("GET ALL images_data: " + JSON.stringify(_array));
      return _array;
    });
    return result;
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
// setImagesData(_array);

export const deleteAll = async () => {
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(`delete from parsers;`, []);
      console.log("DELETED ALL PARSERS: " + JSON.stringify(result));
      const x = await tx.executeSqlAsync("select * from images_data", []); //NOT FOR PRODUCTION
      console.log("GET ALL IMAGE DATA (SHOULD BE NONE): " + JSON.stringify(x));
    });
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
//setParsers([]);

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
  } catch (err) {
    alert(err);
    console.error(err);
  }
};
//set anything?
