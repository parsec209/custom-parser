import { useState, useEffect, useContext } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View, ScrollView } from "react-native";

import {
  Text,
  DataTable,
  Button,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import {
  getAllImagesData,
  getImageData,
  updateImageData,
} from "../services/postService";
import { ImagesDataContext } from "../contexts/imagesDataContext";

export default function ImageDataModal() {
  const { id, parserId } = useLocalSearchParams<{
    id?: string;
    parserId?: string;
    //routerPath: string;
  }>();
  const router = useRouter();

  const { setImagesData } = useContext(ImagesDataContext);

  const [name, setName] = useState("");
  const [modalFieldNameIndex, setModalFieldNameIndex] = useState(null); //string or null
  const [modalFieldDataIndex, setModalFieldDataIndex] = useState(null); //{ rowIndex, cellIndex } || null
  const [fieldNames, setFieldNames] = useState([""]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
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

  const saveData = async () => {
    setIsLoading(true);
    //delayedFunction();
    try {
      await updateImageData(name, fieldNames, rows, id);
      const updatedImagesData = await getAllImagesData();
      setImagesData(updatedImagesData);
      setIsLoading(false);
      //router.navigate(routerPath);
      router.back();
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

  const getAndSetImageDataTextFields = async () => {
    try {
      setIsLoading(true);
      const imageData = id
        ? await getImageData(id)
        : getImageData(parserId, true);
      const imageDataFieldNames = JSON.parse(imageData.fields);
      const imageDataRows = JSON.parse(imageData.data);
      const imageDataName = imageData.name;
      setName(imageDataName);
      setFieldNames(imageDataFieldNames);
      setRows(imageDataRows);
      setIsLoading(false);
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

  const updateCell = (rowIndex, cellIndex, text) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][cellIndex] = text;
    setRows(updatedRows);
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

  const resetRows = () => {
    setRows([]);
    setPage(0);
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
        await getAndSetImageDataTextFields();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={[styles.container, { opacity: isLoading ? 0.5 : 1 }]}>
      <View style={styles.nameContainer}>
        <TextInput
          label="Image category name"
          style={styles.nameInput}
          value={name}
          disabled={true}
        />
      </View>

      <View style={styles.tableButtonContainer}>
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
          onPress={resetRows}
          disabled={isLoading}
        >
          Reset
        </Button>
      </View>
      <View style={styles.tableTitleContainer}>
        <Text variant="titleMedium">Image data table</Text>
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
                    labelStyle={{
                      textDecorationLine: "underline",
                      color: "blue",
                    }}
                  >
                    {fieldName?.length > 20
                      ? fieldName.substring(0, 20) + "..."
                      : fieldName}
                  </Button>
                  <Portal>
                    <Modal
                      visible={modalFieldNameIndex === fieldNameIndex}
                      onDismiss={() => {
                        setModalFieldNameIndex(null);
                      }}
                      contentContainerStyle={styles.modal}
                    >
                      <TextInput
                        label={"Field name"}
                        value={modalText}
                        disabled={true}
                      />
                    </Modal>
                  </Portal>
                </View>
              ))}
            </View>

            {rows?.slice(from, to).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row?.map((cellData, cellIndex) => (
                  <View key={cellIndex} style={styles.cell}>
                    <Button
                      mode="text"
                      disabled={isLoading}
                      onPress={() => {
                        setModalFieldDataIndex({ rowIndex, cellIndex });
                        setModalText(cellData);
                      }}
                      labelStyle={{
                        textDecorationLine: "underline",
                        color: "blue",
                      }}
                    >
                      {cellData?.length > 20
                        ? cellData.substring(0, 20) + "..."
                        : cellData}
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
                          updateCell(rowIndex, cellIndex, modalText);
                        }}
                        contentContainerStyle={styles.modal}
                      >
                        <TextInput
                          label={"Cell value"}
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
    </View>
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
