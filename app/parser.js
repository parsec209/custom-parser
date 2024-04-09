import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Platform, StyleSheet, View, ScrollView } from "react-native";
import {
  Text,
  RadioButton,
  Button,
  DataTable,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import { db } from "./_layout";
import { isValidIcon } from "react-native-paper/lib/typescript/components/Icon";

export default function ParserSetupModal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [titles, setTitles] = useState([""]);
  const [rows, setRows] = useState([[""]]);
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [fieldIndex, setFieldIndex] = useState(0);
  const [fieldType, setFieldType] = useState("title"); //title || row
  const [fieldText, setFieldText] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [nameIsInvalid, setNameIsInvalid] = useState(false);
  const [tableIsInvalid, setTableIsInvalid] = useState(false);


  const getEmptyStringIndices =  (array) => {
    const indices = array.reduce((acc, el, i) => (el === '' ? acc.concat(i) : acc), []);
    return indices
  }

  const validate = async () => {
    const emptyTitles = getEmptyStringIndices(titles)
    const emptyPrompts = getEmptyStringIndices(rows[0])

      await db.transactionAsync(async (tx) => {
        const stringifiedFields = JSON.stringify(titles);
        const stringifiedPrompts = JSON.stringify(rows[0]);
        await tx.executeSqlAsync(
          "insert into parsers (name, fields, prompts) values (?, ?, ?)",
          [name, stringifiedFields, stringifiedPrompts],
        );
      });
      router.replace("./parsers");
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };


  const dbPost = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        const stringifiedFields = JSON.stringify(titles);
        const stringifiedPrompts = JSON.stringify(rows[0]);
        await tx.executeSqlAsync(
          "insert into parsers (name, fields, prompts) values (?, ?, ?)",
          [name, stringifiedFields, stringifiedPrompts],
        );
      });
      router.replace("./parsers");
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  const dbEdit = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        const stringifiedFields = JSON.stringify(titles);
        const stringifiedPrompts = JSON.stringify(rows[0]);
        await tx.executeSqlAsync(
          `update parsers set name = ?, fields = ?, prompts = ? where id = ?;`,
          [name, stringifiedFields, stringifiedPrompts, id],
        );
      });
      router.replace("./parsers");
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  const dbDelete = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(`delete from parsers where id = ?;`, [id]);
      });
      router.replace("./parsers");
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  const createTwoButtonAlert = () =>
    Alert.alert("Warning", `Please confirm you want to delete this parser.`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: dbDelete },
    ]);

  const showModal = (currentFieldText, currentFieldType, currentFieldIndex) => {
    setVisible(true);
    setFieldText(currentFieldText);
    setFieldType(currentFieldType);
    setFieldIndex(currentFieldIndex);
  };

  const hideModal = () => {
    setVisible(false);
    if (fieldType === "title") {
      const updatedTitles = [...titles];
      updatedTitles[fieldIndex] = fieldText;
      setTitles(updatedTitles);
    } else {
      const updatedRows = [...rows];
      updatedRows[0][fieldIndex] = fieldText;
      setRows(updatedRows);
    }
  };

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, rows.length);

  const addColumn = () => {
    const updatedTitles = [...titles, ""];
    const updatedRows = rows.map((row) => {
      return [...row, ""];
    });
    setTitles(updatedTitles);
    setRows(updatedRows);
  };

  const resetFields = () => {
    setTitles([""]);
    setRows([[""]]);
  };

  const addRow = () => {
    const updatedRows = rows.map((row) => {
      return [...row];
    });
    const newRow = rows[0].map((prompt) => {
      return "";
    });
    updatedRows.push(newRow);
    setRows(updatedRows);
  };

  const deleteColumn = () => {
    let updatedTitles = [...titles];
    let updatedRows = rows.map((row) => {
      const updatedRow = [...row];
      updatedRow.pop();
      return updatedRow;
    });
    updatedTitles.pop();
    if (!updatedTitles.length) {
      updatedTitles.push("");
      updatedRows = [[""]];
    }
    setTitles(updatedTitles);
    setRows(updatedRows);
  };

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    if (id) {
      db.transaction((tx) => {
        tx.executeSql(
          "select * from parsers where id = ?;",
          [id],
          (_, { rows: { _array } }) => {
            // setName(parserName)
            console.log(_array);
            //see what data looks like before setting states
          },
        );
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <TextInput
          label="Parser name"
          style={{ width: "80%" }}
          value={name}
          placeholder="Enter a name for this parser"
          onChangeText={(name) => setName(name)}
        />
        {nameIsInvalid && <Text
        variant="bodySmall" style={styles.nameIsInvalidMsg}>
        </Text> }
      </View>
      <View style={styles.tableButtonContainer}>
        <Button icon="plus" mode="text" onPress={addColumn}>
          Add field
        </Button>
        <Button icon="minus" mode="text" onPress={deleteColumn}>
          Delete field
        </Button>
        <Button icon="plus" mode="text" onPress={addRow}>
          Add row
        </Button>
        <Button icon="refresh" mode="text" onPress={resetFields}>
          Reset
        </Button>
      </View>
      <View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
            >
              <TextInput
                label={
                  fieldType === "title" ? "Field name" : "Field value prompt"
                }
                value={fieldText}
                onChangeText={(fieldText) => setFieldText(fieldText)}
              />
            </Modal>
          </Portal>
          <DataTable style={styles.table}>
            <DataTable.Header>
              {titles.map((title, i) => (
                <DataTable.Title
                  key={i}
                  style={{ paddingHorizontal: 8 }}
                  textStyle={{ textDecorationLine: "underline", color: (!isValidated && !title || isValidated && title) ? "blue" : "red" } }
                  onPress={() => showModal(title, "title", i)}
                >
                  {title
                    ? title.length > 15
                      ? title.substring(0, 15) + "..."
                      : title
                    : "Field name"}
                </DataTable.Title>
              ))}
            </DataTable.Header>
            {rows.slice(from, to).map((row, i) => (
              <DataTable.Row key={i}>
                {row.map((prompt, j) => (
                  <DataTable.Cell
                    key={j}
                    style={{ paddingHorizontal: 8 }}
                    textStyle={{
                      textDecorationLine: "underline",
                      color: (!isValidated && !prompt || isValidated && prompt) ? "blue" : "red",
                    }}
                    onPress={() => showModal(prompt, "row", j)}
                  >
                    {prompt
                      ? prompt.length > 15
                        ? prompt.substring(0, 15) + "..."
                        : prompt
                      : "Field value prompt"}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>

        <DataTable.Pagination
          style={styles.pagination}
          page={page}
          numberOfPages={Math.ceil(rows.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${rows.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Rows per page"}
        />
      </View>
      <View style={styles.saveButtonContainer}>
        <Button
          mode="contained"
          style={{ width: "60%" }}
          onPress={id ? dbEdit : dbPost}
          buttonColor="blue"
        >
          Save
        </Button>
      </View>
      {id && (
        <Button mode="outlined" onPress={createTwoButtonAlert}>
          Delete
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  table: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "grey",
    // paddingBottom: 0,
  },
  pagination: {
    backgroundColor: "white",
    marginBottom: 20,
    //paddingVertical: 5,
  },
  nameContainer: { alignItems: "center", marginBottom: 20 },
  tableButtonContainer: { alignItems: "flex-start" },
  saveButtonContainer: { alignItems: "center" },

  nameIsInvalidMsg: {
    color: "red"
  }

  // nameContainer: {

  //   alignItems: "center",
  // },
});
