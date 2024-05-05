import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export const createTables = async () => {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      "create table if not exists parsers (id integer primary key not null, name text unique, fields text, prompts text);",
      [],
    );
    console.log("CREATED PARSERS TABLE");
    await tx.executeSqlAsync(
      "create table if not exists images_data (id integer primary key not null, name text unique, fields text, data text, parser_id integer, foreign key(parser_id) references parsers(id));",
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

export const getParser = async (id) => {
  let result;
  await db.transactionAsync(async (tx) => {
    const { rows } = await tx.executeSqlAsync(
      "select * from parsers where id = ?;",
      [id],
    );
    result = rows;
    console.log("GET ONE: " + JSON.stringify(result));
  });
  return result;
};

export const postParser = async (name, fieldNames, rows) => {
  await db.transactionAsync(async (tx) => {
    const stringifiedFieldNames = JSON.stringify(fieldNames);
    const stringifiedRows = JSON.stringify(rows);
    const result = await tx.executeSqlAsync(
      "insert into parsers (name, fields, prompts) values (?, ?, ?)",
      [name, stringifiedFieldNames, stringifiedRows],
    );
    console.log("POSTED: " + JSON.stringify(result));
  });
};

// export const updateParser = async (name, fieldNames, rows, id) => {
//   try {
//     await db.transactionAsync(async (tx) => {
//       const stringifiedFieldNames = JSON.stringify(fieldNames);
//       const stringifiedRows = JSON.stringify(rows);
//       try {
//         const result = await tx.executeSqlAsync(
//           `update parsers set name = ?, fields = ?, prompts = ? where id = ?;`,
//           [name, stringifiedFieldNames, stringifiedRows, id],
//         );
//         console.log("UPDATED: " + JSON.stringify(result));
//       } catch (err) {
//         return true;
//       }
//     });
//   } catch (err) {
//     return true;
//   }
// };

export const updateParser = (name, fieldNames, rows, id) => {
  db.transaction((tx) => {
    const stringifiedFieldNames = JSON.stringify(fieldNames);
    const stringifiedRows = JSON.stringify(rows);
    tx.executeSql(
      `update parsers set name = ?, fields = ?, prompts = ? where id = ?;`,
      [name, stringifiedFieldNames, stringifiedRows, id],
      (_, result) => {
        console.log("UPDATED:x` " + JSON.stringify(result));
      },
      (_, err) => {
        console.error(err);
        return true;
      },
    );
  });
};

db.transaction((tx) => {
  tx.executeSql(
    "select * from parsers order by name asc;",
    [],
    (_, { rows: { _array } }) => {
      console.log("GET ALL PARSERS: " + JSON.stringify(_array));
      setParsers(_array);
      setChecked(_array.length ? _array[0].name : null);
      tx.executeSql(
        "select * from tables",
        [],
        (_, { rows: { _array } }) => {
          console.log("GET ALL TABLES: " + JSON.stringify(_array));
          setTables(_array);
        },
        (_, err) => {
          alert(err);
          console.error(err);
          return true;
        },
      );
    },
    (_, err) => {
      alert(err);
      console.error(err);
      return true;
    },
  );
});

export const deleteParser = async (id) => {
  await db.transactionAsync(async (tx) => {
    const result = await tx.executeSqlAsync(
      `delete from parsers where id = ?;`,
      [id],
    );
    console.log("DELETED ONE: " + JSON.stringify(result));
  });
};

export const getAllImagesData = async () => {
  const result = await db.transactionAsync(async (tx) => {
    const {
      rows: { _array },
    } = await tx.executeSqlAsync("select * from images_data", []);
    console.log("GET ALL images_data: " + JSON.stringify(_array));
    return _array;
  });
  return result;
};
// setImagesData(_array);

export const deleteAll = async () => {
  await db.transactionAsync(async (tx) => {
    const result = await tx.executeSqlAsync(`delete from parsers;`, []);
    console.log("DELETED ALL PARSERS: " + JSON.stringify(result));
    const x = await tx.executeSqlAsync("select * from images_data", []); //NOT FOR PRODUCTION
    console.log("GET ALL IMAGE DATA (SHOULD BE NONE): " + JSON.stringify(x));
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
