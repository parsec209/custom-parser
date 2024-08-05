import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, Link } from "expo-router";

import {
  Text,
  // DataTable,
  Button,
  Portal,
  Modal,
  TextInput,
  IconButton,
  Dialog,
  HelperText,
} from "react-native-paper";
import {
  getParser,
  updateParser,
  postParser,
  getParserData,
  postParserData,
  updateParserData,
} from "../services/postService";

export default function ParserModal() {
  const { parserId } = useLocalSearchParams<{
    parserId?: string;
  }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [modalHeaderIndex, setModalHeaderIndex] = useState(null); //string or null
  const [modalRowAndCellIndex, setModalRowAndCellIndex] = useState(null); //{ rowIndex, cellIndex } || null
  const [dialogColumnIndex, setDialogColumnIndex] = useState(null); //string or null
  const [headers, setHeaders] = useState([""]);
  const [rows, setRows] = useState([[""]]);
  const [parserDataRows, setParserDataRows] = useState([]); //ONLY EDITED WHEN DELETING COLUMN
  const [images, setImages] = useState([]); //ONLY EDITED WHEN DELETING LAST REMAINING COLUMN
  //const [page, setPage] = useState<number>(0);
  // const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  // const [itemsPerPage, onItemsPerPageChange] = useState(4);
  const [isValidated, setIsValidated] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  

  // const from = page * itemsPerPage;
  // const to = Math.min((page + 1) * itemsPerPage, rows.length);

  const getAndSetParserTextFields = async () => {
    try {
      setIsLoading(true);
      const parser = await getParser({ parserId });
      const parserData = await getParserData({ parserId });
      setName(parser.name);
      setHeaders(parser.headers);
      setRows(parser.parserRows);
      setParserDataRows(parserData.parserDataRows);
      setImages(parserData.images);
      setIsLoading(false);
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

  const areHeadersValid = () => {
    return !headers.includes("");
  };

  const areRowsValid = () => {
    return !rows.some((row) => row.includes(""));
  };

  const saveData = async () => {
    setIsLoading(true);
    if (name && areHeadersValid() && areRowsValid()) {
      try {
        if (parserId) {
          await updateParser({ name, headers, parserRows: rows, parserId });
          await updateParserData({
            name,
            headers,
            parserDataRows,
            images,
            parserId,
          });
        } else {
          await postParser({ name, headers, parserRows: rows });
          const { parserId } = await getParser({ name });
          await postParserData({
            name,
            headers,
            parserDataRows: [],
            images: [],
            parserId,
          });
        }
        setIsLoading(false);
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

  const updateHeaderText = (fieldNameIndex, text) => {
    const updatedHeaders = [...headers];
    updatedHeaders[fieldNameIndex] = text;
    setHeaders(updatedHeaders);
  };

  const updatePrompt = (rowIndex, cellIndex, text) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][cellIndex] = text;
    setRows(updatedRows);
  };

  const addColumn = () => {
    const updatedHeaders = [...headers, ""];
    const updatedRows = rows.map((row) => {
      return [...row, ""];
    });
    const updatedParserDataRows = parserDataRows.map((row) => {
      return [...row, ""];
    });
    setHeaders(updatedHeaders);
    setRows(updatedRows);
    setParserDataRows(updatedParserDataRows);
  };

  const deleteLastColumn = () => {
    let updatedHeaders = [...headers];
    updatedHeaders.pop();
    let updatedRows = rows.map((row) => {
      row.pop();
      return row;
    });
    let updatedParserDataRows = parserDataRows.map((row) => {
      row.pop();
      return row;
    });
    let updatedImages = [...images];
    if (!updatedHeaders.length) {
      updatedHeaders = [""];
      updatedRows = [[""]];
      updatedParserDataRows = [];
      updatedImages = [];
    }
    setHeaders(updatedHeaders);
    setRows(updatedRows);
    setParserDataRows(updatedParserDataRows);
    setImages(updatedImages);
  };

  const deleteColumn = (columnIndex) => {
    let updatedHeaders = [...headers];
    updatedHeaders.splice(columnIndex, 1);

    let updatedRows = rows.map((row) => {
      row.splice(columnIndex, 1);
      return row;
    });
    let updatedParserDataRows = parserDataRows.map((row) => {
      row.splice(columnIndex, 1);
      return row;
    });
    let updatedImages = [...images];
    if (!updatedHeaders.length) {
      updatedHeaders = [""];
      updatedRows = [[""]];
      updatedParserDataRows = [];
      updatedImages = [];
    }
    setHeaders(updatedHeaders);
    setRows(updatedRows);
    setParserDataRows(updatedParserDataRows);
    setImages(updatedImages);
  };





  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (parserId) {
        getAndSetParserTextFields();
      }
      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={[styles.container, { opacity: isLoading ? 0.5 : 1 }]}
    >
      <View style={styles.nameContainer}>
        <TextInput
          label="Image category"
          style={styles.nameInput}
          value={name}
          maxLength={50}
          placeholder="Enter image category"
          onChangeText={(name) => {
            setName(name);
          }}
          disabled={isLoading}
        />
        <HelperText type="error" visible={isValidated && !name}>
          Image category required
        </HelperText>
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
          onPress={deleteLastColumn}
          disabled={isLoading}
        >
          Delete last column
        </Button>
        <IconButton
          icon="help-circle-outline"
          size={20}
          onPress={() => {
            setIsHintVisible(true);
          }}
        />
        <Portal>
          <Modal
            visible={isHintVisible}
            onDismiss={() => {
              setIsHintVisible(false);
            }}
            contentContainerStyle={styles.modal}
          >
            <Text variant="bodyMedium" style={styles.dialog}>
              To delete a specific column,{" "}
            </Text>
            <Text variant="bodyMedium">
              long press that column's header link.
            </Text>
          </Modal>
        </Portal>
      </View>
      <View style={styles.tableTitleContainer}>
        <Text variant="titleMedium">Headers and prompts table</Text>
        {isValidated && (!areHeadersValid() || !areRowsValid()) && (
          <Text variant="bodySmall" style={styles.invalidField}>
            Please add text to any red-colored table fields
          </Text>
        )}
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView>
          <ScrollView horizontal>
            <View style={styles.table}>
              <View style={styles.row}>
                {headers?.map((header, headerIndex) => (
                  <View key={headerIndex} style={[styles.cell, styles.header]}>
                    <Button
                      mode="text"
                      disabled={isLoading}
                      onPress={() => {
                        setModalHeaderIndex(headerIndex);
                        setModalText(header);
                      }}
                      onLongPress={() => {
                        setDialogColumnIndex(headerIndex);
                      }}
                      labelStyle={{
                        textDecorationLine: "underline",
                        color: !isValidated || header ? "blue" : "red",
                      }}
                    >
                      {header
                        ? header.length > 20
                          ? header.substring(0, 20) + "..."
                          : header
                        : "Header name"}
                    </Button>
                    <Portal>
                      <Modal
                        visible={modalHeaderIndex === headerIndex}
                        onDismiss={() => {
                          setModalHeaderIndex(null);
                          updateHeaderText(headerIndex, modalText);
                        }}
                        contentContainerStyle={styles.modal}
                      >
                        <TextInput
                          label={"Header name"}
                          value={modalText}
                          onChangeText={(text) => {
                            setModalText(text);
                          }}
                        />
                      </Modal>
                    </Portal>

                    <Portal>
                      <Dialog
                        visible={dialogColumnIndex === headerIndex}
                        onDismiss={() => {
                          setDialogColumnIndex(null);
                        }}
                      >
                        <Dialog.Content>
                          <Text variant="bodyMedium" style={styles.dialog}>
                            Ok to delete this column?
                          </Text>
                          <Text> </Text>
                          <Text variant="bodySmall">
                            This will also delete the same column of this
                            parser's data table.
                          </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                          <Button
                            onPress={() => {
                              deleteColumn(headerIndex);
                              setDialogColumnIndex(null);
                            }}
                          >
                            OK
                          </Button>
                        </Dialog.Actions>
                        <Dialog.Actions>
                          <Button
                            onPress={() => {
                              setDialogColumnIndex(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </Dialog.Actions>
                      </Dialog>
                    </Portal>
                  </View>
                ))}
              </View>
              {/* {rows?.slice(from, to).map((row, rowIndex) => ( */}
              {rows?.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row?.map((prompt, cellIndex) => (
                    <View key={cellIndex} style={styles.cell}>
                      <Button
                        mode="text"
                        disabled={isLoading}
                        onPress={() => {
                          setModalRowAndCellIndex({ rowIndex, cellIndex });
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
                          : "Cell value prompt"}
                      </Button>
                      <Portal>
                        <Modal
                          visible={
                            modalRowAndCellIndex !== null &&
                            modalRowAndCellIndex.rowIndex === rowIndex &&
                            modalRowAndCellIndex.cellIndex === cellIndex
                          }
                          onDismiss={() => {
                            setModalRowAndCellIndex(null);
                            updatePrompt(rowIndex, cellIndex, modalText);
                          }}
                          contentContainerStyle={styles.modal}
                        >
                          <TextInput
                            label={"Cell value prompt"}
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
        </ScrollView>

        {/* <DataTable.Pagination
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
        /> */}
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
      {parserId && (
        <Button
          labelStyle={{
            textDecorationLine: "underline",
            color: "blue",
          }}
          mode="text"
          disabled={isLoading}
          onPress={() => {}}
        >
          <Link
            href={{
              pathname: `./parserDataModal`,
              params: {
                parserId,
              },
            }}
          >
            View parser's data
          </Link>
        </Button>
      )}
    </KeyboardAvoidingView>
  );
}

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
    marginLeft: 16,
  },
  dialog: {
    fontWeight: "bold",
  },
  invalidField: {
    color: "red",
  },
  tableTitleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  scrollContainer: {
    // flex: 1,
    height: 200, // Set a fixed height for the scrollable area
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  // scrollView: {
  //   flexGrow: 1,
  //   marginBottom: 10,
  //   paddingHorizontal: 16,
  // },
  modal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
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
    width: 175,
    borderRightWidth: 1,
    borderColor: "grey",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  header: {
    backgroundColor: "lightgrey",
  },
  // pagination: {
  //   backgroundColor: "white",
  //   marginBottom: 20,
  //   marginHorizontal: 16,
  // },
  saveButtonContainer: {
    alignItems: "center",
  },
  saveButton: {
    width: "60%",
    marginVertical: 10,
  },
});
