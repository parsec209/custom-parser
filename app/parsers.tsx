import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { Text, RadioButton, Button } from "react-native-paper";
import { Link } from "expo-router";
import { db } from "./_layout";

//import EditScreenInfo from '@/components/EditScreenInfo';
//import { Text, View } from '@/components/Themed';

export default function ParserSelectionModal() {
  const [parsers, setParsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [checked, setChecked] = useState(null);

  const scan = async () => {
    try {
      const table = tables.filter((table) => table.parser_id === checked);
      const parser = parsers.filter((parser) => parser.id === checked);
      //send stringified parsers.rows[0] to backend
      //backend returns stringified array of string values
      const values = []
      const newTableRow = [];
      const tableFieldNames = table.fields
      for (let i = 0; i < values.length; i++) {
        let value = values[i]
        for (let j = 0; j < tableFieldNames.length; j++) {
          let tableFieldName = tableFieldNames[j]
          if (condition) {
            const element = array[index];
            const element = array[index];
          }
        }
        for
      }
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  const deleteAll = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        const result = await tx.executeSqlAsync(`delete from parsers;`, []);
        setParsers([]);
        console.log("DELETED ALL PARSERS: " + JSON.stringify(result));
        const x = await tx.executeSqlAsync("select * from tables", []);
        console.log("GET ALL TABLES (SHOULD BE NONE): " + JSON.stringify(x));
      });
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  const dropAll = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        const result1 = await tx.executeSqlAsync(
          `drop table if exists parsers`,
          [],
        );
        console.log("DROPPED TABLE parsers: " + JSON.stringify(result1));
        const result2 = await tx.executeSqlAsync(
          `drop table if exists tables`,
          [],
        );
        console.log("DROPPED TABLE tables: " + JSON.stringify(result2));
      });
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  useEffect(() => {
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
  }, []);

  const parserSelections = parsers.map(({ id, name }) => (
    <View style={styles.parserSelection} key={id}>
      <RadioButton
        value={id}
        status={checked === id ? "checked" : "unchecked"}
        onPress={() => setChecked(id)}
      />
      <Button
        mode="text"
        onPress={() => {}}
        labelStyle={{
          textDecorationLine: "underline",
          color: "blue",
        }}
      >
        <Link href={`./parser?id=${id}`}>{name}</Link>
      </Button>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant="headlineMedium">
        Select a parser
      </Text>
      <View style={styles.parsersContainer}>{parserSelections}</View>

      <Button icon="plus" mode="text" onPress={() => {}}>
        <Link href="./parser">Add new parser</Link>
      </Button>

      <Button
        style={styles.scanButton}
        icon="scan-helper"
        mode="contained"
        buttonColor="blue"
        onPress={scan}
        disabled={!parsers.length}
      >
        Start scan
      </Button>

      <Button
        mode="contained"
        buttonColor="red"
        onPress={deleteAll}
        disabled={!parsers.length}
      >
        Delete All Parsers
      </Button>

      <Button mode="contained" buttonColor="red" onPress={dropAll}>
        Drop All SQL Tables
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  parsersContainer: {
    alignItems: "flex-start",
  },
  parserSelection: {
    flexDirection: "row",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 20,
  },
  scanButton: {
    marginVertical: 20,
  },
  // separator: {
  //   marginVertical: 30,
  //   height: 1,
  //   width: "80%",
  // },
});
