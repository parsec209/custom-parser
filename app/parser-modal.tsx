import { useState, useEffect, useContext } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from "react-native";

import {
  Text,
  DataTable,
  Button,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import {
  getAllParsers,
  getParser,
  updateParser,
  postParser,
} from "../services/postService";
import { ParsersContext } from "../contexts/parsersContext";
import { SelectedParserContext } from "../contexts/selectedParserContext";


export default function ParserModal() {
  const { id } = useLocalSearchParams<{
    id?: string;
    //routerPath: string;
  }>();
  const router = useRouter();

  const { parsers, setParsers } = useContext(ParsersContext);
  const { selectedParser, setSelectedParser } = useContext(
    SelectedParserContext,
  );

  const [name, setName] = useState("");
  const [modalFieldNameIndex, setModalFieldNameIndex] = useState(null); //string or null
  const [modalFieldDataIndex, setModalFieldDataIndex] = useState(null); //{ rowIndex, cellIndex } || null
  const [fieldNames, setFieldNames] = useState([""]);
  const [rows, setRows] = useState([[""]]);
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const [isValidated, setIsValidated] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, rows.length);

  // const delayedFunction = () => {
  //   setTimeout(() => {
  //     // Your function goes here
  //     setIsLoading(false);
  //     console.log("Button pressed with 5 second delay!");
  //   }, 5000); // Delay of 5 seconds
  // };

  const arefieldNamesValid = () => {
    return !fieldNames.includes("");
  };

  const areRowsValid = () => {
    return !rows.some((row) => row.includes(""));
  };

  const saveData = async () => {
    setIsLoading(true);
    //delayedFunction();
    if (name && arefieldNamesValid() && areRowsValid()) {
      try {
        id
          ? await updateParser(name, fieldNames, rows, id)
          : await postParser(name, fieldNames, rows);
        const updatedParsers = await getAllParsers();
        const updatedParserSelection = updatedParsers.find(parser => parser.name === name);
        setParsers(updatedParsers);
        setSelectedParser(updatedParserSelection)
        setIsLoading(false);
        //router.navigate(routerPath);
        router.back();
      } catch (err) {
        alert(err);
        console.error(err);
        setIsLoading(false);
      }
    } else {
      setIsValidated(true);
      setIsLoading(false);
    }
  };

  const getAndSetParserTextFields = async () => {
    try {
      setIsLoading(true);
      const result = await getParser(id);
      const parser = result[0];
      const parserFieldNames = JSON.parse(parser.fields);
      const parserRows = JSON.parse(parser.prompts);
      const parserName = parser.name;
      setName(parserName);
      setFieldNames(parserFieldNames);
      setRows(parserRows);
      setIsLoading(false);
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

  const updateFieldNameText = (fieldNameIndex, text) => {
    const updatedFieldNames = [...fieldNames];
    updatedFieldNames[fieldNameIndex] = text;
    setFieldNames(updatedFieldNames);
  };

  const updatePrompt = (rowIndex, cellIndex, text) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][cellIndex] = text;
    setRows(updatedRows);
  };

  const addColumn = () => {
    const updatedFieldNames = [...fieldNames, ""];
    const updatedRows = rows.map((row) => {
      return [...row, ""];
    });
    setFieldNames(updatedFieldNames);
    setRows(updatedRows);
  };

  const resetFields = () => {
    setFieldNames([""]);
    setRows([[""]]);
    setPage(0);
  };

  const addRow = () => {
    const updatedRows = [...rows];
    const newRow = updatedRows[0].map(() => {
      return "";
    });
    updatedRows.push(newRow);
    setRows(updatedRows);
  };

  const deleteRow = () => {
    const updatedRows = [...rows];
    updatedRows.pop();
    setRows(updatedRows);
  };

  const deleteColumn = () => {
    let updatedFieldNames = [...fieldNames];
    let updatedRows = rows.map((row) => {
      row.pop();
      return row;
    });
    updatedFieldNames.pop();
    if (!updatedFieldNames.length) {
      updatedFieldNames = [""];
      updatedRows = [[""]];
    }
    setFieldNames(updatedFieldNames);
    setRows(updatedRows);
  };

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      if (id) {
        await getAndSetParserTextFields();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
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
          onChangeText={(name) => {
            setName(name);
          }}
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
          Add column
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
          icon="minus"
          mode="text"
          onPress={deleteRow}
          disabled={isLoading}
        >
          Delete row
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
        {isValidated && (!arefieldNamesValid() || !areRowsValid()) && (
          <Text variant="bodySmall" style={styles.invalidField}>
            Please fill out any red-highlighted table fields.
          </Text>
        )}
      </View>
      <View>
        <ScrollView horizontal contentContainerStyle={styles.scrollView}>
          {/* <Portal>
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
          </Portal> */}

          <View style={styles.table}>
            <View style={styles.row}>
              {fieldNames?.map((fieldName, fieldNameIndex) => (
                <View key={fieldNameIndex} style={styles.cell}>
                  <Button
                    mode="text"
                    disabled={isLoading}
                    onPress={() => {
                      setModalFieldNameIndex(fieldNameIndex);
                      setModalText(fieldName);
                    }}
                    labelStyle={{
                      textDecorationLine: "underline",
                      color: !isValidated || fieldName ? "blue" : "red",
                    }}
                  >
                    {fieldName
                      ? fieldName.length > 20
                        ? fieldName.substring(0, 20) + "..."
                        : fieldName
                      : "Field name"}
                  </Button>
                  <Portal>
                    <Modal
                      visible={modalFieldNameIndex === fieldNameIndex}
                      onDismiss={() => {
                        setModalFieldNameIndex(null);
                        updateFieldNameText(fieldNameIndex, modalText);
                      }}
                      contentContainerStyle={styles.modal}
                    >
                      <TextInput
                        label={"Field name"}
                        value={modalText}
                        onChangeText={(text) => {
                          setModalText(text);
                        }}
                      />
                    </Modal>
                  </Portal>
                </View>
              ))}
            </View>

            {rows?.slice(from, to).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row?.map((prompt, cellIndex) => (
                  <View key={cellIndex} style={styles.cell}>
                    <Button
                      mode="text"
                      disabled={isLoading}
                      onPress={() => {
                        setModalFieldDataIndex({ rowIndex, cellIndex });
                        setModalText(prompt);
                      }}
                      labelStyle={{
                        textDecorationLine: "underline",
                        color: !isValidated || prompt ? "blue" : "red",
                      }}
                    >
                      {prompt
                        ? prompt.length > 20
                          ? prompt.substring(0, 20) + "..."
                          : prompt
                        : "Field value prompt"}
                    </Button>
                    <Portal>
                      <Modal
                        visible={
                          modalFieldDataIndex !== null &&
                          modalFieldDataIndex.rowIndex === rowIndex &&
                          modalFieldDataIndex.cellIndex === cellIndex
                        }
                        onDismiss={() => {
                          setModalFieldDataIndex(null);
                          updatePrompt(rowIndex, cellIndex, modalText);
                        }}
                        contentContainerStyle={styles.modal}
                      >
                        <TextInput
                          label={"Field value prompt"}
                          value={modalText}
                          onChangeText={(text) => setModalText(text)}
                        />
                      </Modal>
                    </Portal>
                  </View>
                ))}
              </View>
            ))}
          </View>
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
          onPress={saveData}
          buttonColor="blue"
        >
          Save
        </Button>
      </View>

      {/* </View> */}
    </KeyboardAvoidingView>
  );
}

//not all of these are under an element's "style" property, make sure they still work!!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    //paddingLeft: 16,
    //paddingRight: 16,
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
    marginLeft: 16,
  },
  scrollView: {
    flexGrow: 1,
    marginBottom: 10,
    paddingHorizontal: 16,
    //width: 300,
    // justifyContent: "center",
  },
  scrollViewContainer: {
    //width: 300,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
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
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "grey",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  cell: {
    flex: 1,
    // padding: 8,
    width: 175,
    borderRightWidth: 1,
    borderColor: "grey",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  pagination: {
    backgroundColor: "white",
    marginBottom: 20,
    marginHorizontal: 16,
  },
  saveButtonContainer: {
    alignItems: "center",
  },
  saveButton: {
    width: "60%",
  },
});
