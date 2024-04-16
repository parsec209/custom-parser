import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Link } from "expo-router";
import { db } from "../_layout";

export default function TablesPage() {
  const [tables, setTables] = useState([]); // [ { id, name }]

  const deleteAll = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        const result = await tx.executeSqlAsync(`delete from tables;`, []);
        setTables([]);
        console.log("DELETED ALL TABLES: " + JSON.stringify(result));
      });
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "select name, id from tables order by name asc;",
        [],
        (_, { rows: { _array } }) => {
          console.log(
            "GET ALL TABLES, JUST NAME AND ID FIELDS: " +
              JSON.stringify(_array),
          );
          setTables(_array);
        },
        (_, err) => {
          alert(err);
          console.error(err);
          return true;
        },
      );
    });
  }, []);

  const tableSelections = tables.map(({ id, name }) => (
    <View key={id}>
      <Button
        mode="text"
        onPress={() => {}}
        labelStyle={{
          textDecorationLine: "underline",
          color: "blue",
        }}
      >
        <Link href={`../table?id=${id}`}>{name}</Link>
      </Button>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant="headlineMedium">
        Select a table
      </Text>
      <View style={styles.tablesContainer}>{tableSelections}</View>

      <Button
        mode="contained"
        buttonColor="red"
        onPress={deleteAll}
        disabled={!tables.length}
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
  tablesContainer: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 20,
  },
});
