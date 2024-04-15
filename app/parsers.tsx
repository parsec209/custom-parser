import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { Text, RadioButton, Button } from "react-native-paper";
import { Link } from "expo-router";
import { db } from "./_layout";

//import EditScreenInfo from '@/components/EditScreenInfo';
//import { Text, View } from '@/components/Themed';

export default function ParserSelectionModal() {
  const [parsers, setParsers] = useState([]); // [ { id, name }]
  const [checked, setChecked] = useState(null);

  const deleteAll = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        const result = await tx.executeSqlAsync(`delete from parsers;`, []);
        setParsers([]);
        console.log("DELETED ALL: " + JSON.stringify(result));
      });
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "select name, id from parsers order by name asc;",
        [],
        (_, { rows: { _array } }) => {
          console.log(
            "GET ALL, JUST NAME AND ID FIELDS: " + JSON.stringify(_array),
          );
          setParsers(_array);
          setChecked(_array.length ? _array[0].name : null);
        },
        (_, err) => {
          alert(err);
          console.log(err);
          return true;
        },
      );
    });
  }, []);

  const parserSelections = parsers.map(({ id, name }) => (
    <View style={styles.parserSelection} key={id}>
      <RadioButton
        value={name}
        status={checked === name ? "checked" : "unchecked"}
        onPress={() => setChecked(name)}
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
        onPress={() => console.log("SCAN!!!")}
        disabled={!parsers.length}
      >
        Start scan
      </Button>

      <Button
        mode="contained"
        buttonColor="blue"
        onPress={deleteAll}
        disabled={!parsers.length}
      >
        Delete All
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
