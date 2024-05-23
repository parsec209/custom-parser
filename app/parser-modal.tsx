import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Link } from "expo-router";

import {
  Text,
  DataTable,
  Button,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import {
  getParser,
  updateParser,
  postParser,
  getImageData,
  postImageData,
  updateImageData,
} from "../services/postService";

export default function ParserModal() {
  const { parserId } = useLocalSearchParams<{
    parserId?: string;
  }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [modalFieldNameIndex, setModalFieldNameIndex] = useState(null); //string or null
  const [modalFieldDataIndex, setModalFieldDataIndex] = useState(null); //{ rowIndex, cellIndex } || null
  const [fieldNames, setFieldNames] = useState([""]);
  const [rows, setRows] = useState([[""]]);
  const [imageDataRows, setImageDataRows] = useState([]); //ONLY EDITED WHEN DELETING COLUMN
  const [images, setImages] = useState([]); //ONLY EDITED WHEN DELETING LAST REMAINING COLUMN
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

  const getAndSetParserTextFields = async () => {
    try {
      setIsLoading(true);
      const parser = await getParser({ parserId });
      const imageData = await getImageData({ parserId });
      setName(parser.name);
      setFieldNames(parser.fieldNames);
      setRows(parser.parserRows);
      setImageDataRows(imageData.imageDataRows);
      setImages(imageData.images);
      setIsLoading(false);
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

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
        if (parserId) {
          await updateParser({ name, fieldNames, parserRows: rows, parserId });
          await updateImageData({
            name,
            fieldNames,
            imageDataRows,
            images,
            parserId,
          });
          //add function for updating locally stored images
        } else {
          await postParser({ name, fieldNames, parserRows: rows });
          const { parserId } = await getParser({ name });
          await postImageData({
            name,
            fieldNames,
            imageDataRows: [],
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
    const updatedImageDataRows = imageDataRows.map((row) => {
      return [...row, ""];
    });
    setFieldNames(updatedFieldNames);
    setRows(updatedRows);
    setImageDataRows(updatedImageDataRows);
  };

  const deleteLastColumn = () => {
    let updatedFieldNames = [...fieldNames];
    updatedFieldNames.pop();
    let updatedRows = rows.map((row) => {
      row.pop();
      return row;
    });
    let updatedImageDataRows = imageDataRows.map((row) => {
      row.pop();
      return row;
    });
    let updatedImages = [...images];
    if (!updatedFieldNames.length) {
      updatedFieldNames = [""];
      updatedRows = [[""]];
      updatedImageDataRows = [];
      updatedImages = [];
      //Add function to delete all stored images for table
    }
    setFieldNames(updatedFieldNames);
    setRows(updatedRows);
    setImageDataRows(updatedImageDataRows);
    setImages(updatedImages);
  };

  const deleteColumn = (columnIndex) => {
    let updatedFieldNames = [...fieldNames];
    updatedFieldNames.splice(columnIndex, 1);

    let updatedRows = rows.map((row) => {
      row.splice(columnIndex, 1);
      return row;
    });
    let updatedImageDataRows = imageDataRows.map((row) => {
      row.splice(columnIndex, 1);
      return row;
    });
    let updatedImages = [...images];
    if (!updatedFieldNames.length) {
      updatedFieldNames = [""];
      updatedRows = [[""]];
      updatedImageDataRows = [];
      updatedImages = [];
    }
    setFieldNames(updatedFieldNames);
    setRows(updatedRows);
    setImageDataRows(updatedImageDataRows);
    setImages(updatedImages);
  };

  const createTwoButtonAlert = (columnIndex) =>
    Alert.alert("Alert", `OK to delete column?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteColumn(columnIndex);
        },
      },
    ]);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      if (parserId) {
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
          label="Image category"
          style={styles.nameInput}
          value={name}
          placeholder="Enter image category"
          onChangeText={(name) => {
            setName(name);
          }}
          disabled={isLoading}
        />
        {isValidated && !name && (
          <Text variant="bodySmall" style={styles.invalidField}>
            Image category is required.
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
          onPress={deleteLastColumn}
          disabled={isLoading}
        >
          Delete last column
        </Button>
        <Text variant="bodySmall">
          ***To delete a specific column, long press the column's header***
        </Text>
      </View>
      <View style={styles.tableTitleContainer}>
        <Text variant="titleMedium">Parser table</Text>
        {isValidated && (!arefieldNamesValid() || !areRowsValid()) && (
          <Text variant="bodySmall" style={styles.invalidField}>
            Please fill out any table fields that are in red.I'm confused by
          </Text>
        )}
      </View>
      <View>
        <ScrollView horizontal contentContainerStyle={styles.scrollView}>
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
                    onLongPress={() => {
                      createTwoButtonAlert(fieldNameIndex);
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
              pathname: `./image-data-modal`,
              params: {
                parserId,
              },
            }}
          >
            View parser's scanned data
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
  tableTitleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  scrollView: {
    flexGrow: 1,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
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
