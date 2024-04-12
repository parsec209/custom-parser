import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  DataTable,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import { db } from "./_layout";

export default function ParserSetupModal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [titles, setTitles] = useState([""]); 
  const [rows, setRows] = useState([[""]]);
  const [selectedFieldDetails, setSelectedFieldDetails] = useState({}); // {type, text, index} type = title || row
  //const [fieldIndex, setFieldIndex] = useState(0);
  //const [fieldType, setFieldType] = useState("title"); //title || row
  //const [fieldText, setFieldText] = useState("");
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const [isValidated, setIsValidated] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const getEmptyStringIndices = (array) => {
  //   const indices = array.reduce(
  //     (acc, el, i) => (el === "" ? acc.concat(i) : acc),
  //     [],
  //   );
  //   return indices;
  // };

  // const delayedFunction = () => {
  //   setTimeout(() => {
  //     // Your function goes here
  //     setIsLoading(false);
  //     console.log("Button pressed with 5 second delay!");
  //   }, 5000); // Delay of 5 seconds
  // };

  const setValidity = () => {
    if (name && !titles.includes("") && !rows[0].includes("")) {
      setIsValid(true);
    }
  };

  const dbPost = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        const stringifiedTitles = JSON.stringify(titles);
        const stringifiedRow = JSON.stringify(rows[0]);
        const {
          rows: { _array },
        } = await tx.executeSqlAsync(
          "insert into parsers (name, fields, prompts) values (?, ?, ?)",
          [name, stringifiedTitles, stringifiedRow],
        );
        console.log("POSTED: " + _array);
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
        const stringifiedTitles = JSON.stringify(titles);
        const stringifiedRow = JSON.stringify(rows[0]);
        const {
          rows: { _array },
        } = await tx.executeSqlAsync(
          `update parsers set name = ?, fields = ?, prompts = ? where id = ?;`,
          [name, stringifiedTitles, stringifiedRow, id],
        );
        console.log("UPDATED: " + _array);
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
        const {
          rows: { _array },
        } = await tx.executeSqlAsync(`delete from parsers where id = ?;`, [id]);
        console.log("DELETED ONE: " + _array);
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

  const showModal = (fieldType, fieldIndex, fieldText) => {
    setSelectedFieldDetails({
      fieldType,
      fieldIndex,
      fieldText,
    });
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    if (selectedFieldDetails.fieldType === "title") {
      const updatedTitles = [...titles];
      updatedTitles[selectedFieldDetails.fieldIndex] =
        selectedFieldDetails.fieldText;
      setTitles(updatedTitles);
    } else {
      const updatedRows = [...rows];
      updatedRows[0][selectedFieldDetails.fieldIndex] =
        selectedFieldDetails.fieldText;
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
            console.log("GET ONE: " + _array);
            //see what data looks like before setting states
          },
        );
      });
    }
  }, []);

  return (
    // <View style={styles.container}>
    <KeyboardAvoidingView
      behavior="height"
      style={[styles.container, { opacity: isLoading ? 0.5 : 1 }]}
    >
      <View style={styles.nameContainer}>
        <TextInput
          label="Parser name"
          style={styles.nameInput}
          value={name}
          placeholder="Enter a name for this parser"
          onChangeText={(name) => setName(name)}
          disabled={isLoading}
        />
        {isValidated && !name && (
          <Text variant="bodySmall" style={styles.invalidField}>
            Parser name is required.
          </Text>
        )}
      </View>
      <View style={styles.tableButtonContainer}>
        <Button
          icon="plus"
          mode="text"
          onPress={addColumn}
          disabled={isLoading}
        >
          Add field
        </Button>
        <Button
          icon="minus"
          mode="text"
          onPress={deleteColumn}
          disabled={isLoading}
        >
          Delete field
        </Button>
        <Button icon="plus" mode="text" onPress={addRow} disabled={isLoading}>
          Add row
        </Button>
        <Button
          icon="refresh"
          mode="text"
          onPress={resetFields}
          disabled={isLoading}
        >
          Reset
        </Button>
      </View>
      <View style={styles.tableTitleContainer}>
        <Text variant="titleMedium">Parser table</Text>
        {isValidated && (titles.includes("") || rows[0].includes("")) && (
          <Text variant="bodySmall" style={styles.invalidField}>
            Please fill out any red-highlighted table fields.
          </Text>
        )}
      </View>
      <View>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollView}>
          <Portal>
            <Modal
              visible={isVisible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modal}
            >
              <TextInput
                label={
                  selectedFieldDetails.fieldType === "title"
                    ? "Field name"
                    : "Field value prompt"
                }
                value={selectedFieldDetails.fieldText}
                onChangeText={(text) =>
                  setSelectedFieldDetails({
                    fieldType: selectedFieldDetails.fieldType,
                    fieldIndex: selectedFieldDetails.fieldIndex,
                    fieldText: text,
                  })
                }
              />
            </Modal>
          </Portal>

          <DataTable style={styles.table}>
            <DataTable.Header>
              {titles.map((title, i) => (
                <DataTable.Title
                  key={i}
                  
                  // sortDirection="ascending"
                  // style={styles.tableField}
                  style={{width: 30}}
                  textStyle={{
                    textDecorationLine: "underline",
                    color:
                      (!isValidated) || (isValidated && title)
                        ? "blue"
                        : "red",
                  }}
                  onPress={() => !isLoading && showModal("title", i, title)}
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
                  
                    // style={styles.tableField}
                    style={{width: 30}}
                    textStyle={{
                      textDecorationLine: "underline",
                      color:
                        (!isValidated) || (isValidated && prompt)
                          ? "blue"
                          : "red",
                    }}
                    onPress={() => !isLoading && showModal("row", j, prompt)}
                  >
                    {prompt
                      ? prompt.length > 15
                        ? prompt.substring(0, 15) + "..."
                        : prompt
                      : "Value prompt"}
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
          style={styles.saveButton}
          disabled={isLoading}
          onPress={() => {
            setIsLoading(true);
            //delayedFunction();
            setIsValidated(true);
            setValidity();
            isValid && (id ? dbEdit() : dbPost());
            setIsLoading(false);
          }}
          buttonColor="blue"
        >
          Save
        </Button>
      </View>
      {id && (
        <Button
          mode="outlined"
          onPress={createTwoButtonAlert}
          disabled={isLoading}
        >
          Delete
        </Button>
      )}
      {/* </View> */}
    </KeyboardAvoidingView>
  );
}

//not all of these are under an element's "style" property, make sure they still work!!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  nameInput: {
    width: "80%",
  },
  tableButtonContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
  },
  tableTitleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  invalidField: {
    color: "red",
  },
  table: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "grey",
  },
  // tableField: {
  //   paddingHorizontal: 8,
  // },
  pagination: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  saveButtonContainer: {
    alignItems: "center",
  },
  saveButton: {
    width: "60%",
  },
});
