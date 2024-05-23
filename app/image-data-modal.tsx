import { useState, useEffect } from "react";
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
import { getImageData, updateImageData } from "../services/postService";
import ImageSelection from "../components/ImageSelection";

export default function ImageDataModal() {
  const { imageDataId, parserId } = useLocalSearchParams<{
    imageDataId?: string;
    parserId?: string;
  }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [modalFieldNameIndex, setModalFieldNameIndex] = useState(null); //string or null
  const [modalFieldDataIndex, setModalFieldDataIndex] = useState(null); //{ rowIndex, cellIndex } || null
  const [modalRowIndex, setModalRowIndex] = useState(null); //string or null
  const [fieldNames, setFieldNames] = useState([""]);
  const [rows, setRows] = useState([]);
  const [images, setImages] = useState([]); // [[null || string, null || string]
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
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

  const updateRowImages = (rowIndex) => {
    const updatedImages = [...images];
    updatedImages[rowIndex][0] = image1;
    updatedImages[rowIndex][1] = image2;
    setImages(updatedImages);
    setImage1(null);
    setImage2(null);
  };

  const handleImage1Update = (imageUri) => {
    setImage1(imageUri);
  };

  const handleImage2Update = (imageUri) => {
    setImage2(imageUri);
  };

  const saveData = async () => {
    setIsLoading(true);
    //delayedFunction();
    try {
      await updateImageData({
        fieldNames,
        imageDataRows: rows,
        images,
        imageDataId,
        parserId,
      });
      setIsLoading(false);
      router.back();
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

  const getAndSetImageDataFields = async () => {
    try {
      setIsLoading(true);
      const imageData = await getImageData({ imageDataId, parserId });
      setName(imageData.name);
      setFieldNames(imageData.fieldNames);
      setRows(imageData.imageDataRows);
      setImages(imageData.images);
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
    const updatedImages = [...images];
    const newRow = fieldNames.map(() => {
      return "";
    });
    const newImagePair = [null, null];
    updatedRows.push(newRow);
    updatedImages.push(newImagePair);
    setRows(updatedRows);
    setImages(updatedImages);
  };

  const deleteRow = (rowIndex) => {
    const updatedRows = [...rows];
    const updatedImages = [...images];
    updatedRows.splice(rowIndex, 1);
    updatedImages.splice(rowIndex, 1);
    setRows(updatedRows);
    setImages(updatedImages);
  };

  const deleteLastRow = () => {
    const updatedRows = [...rows];
    const updatedImages = [...images];
    updatedRows.pop();
    updatedImages.pop();
    setRows(updatedRows);
    setImages(updatedImages);
  };

  const resetRows = () => {
    setRows([]);
    setImages([]);
    setPage(0);
  };


  const sortByColumn = (fieldNameIndex) => {
  let ascending = rows.sort((row1, row2) => (row1[fieldNameIndex] > row2[fieldNameIndex]) ? 1 : -1);
let descending = arr.sort((row1, row2) => (row1[fieldNameIndex] < row2[fieldNameIndex]) ? 1 : -1);

  
  
  
  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      await getAndSetImageDataFields();
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={[styles.container, { opacity: isLoading ? 0.5 : 1 }]}>
      <View style={styles.nameContainer}>
        <TextInput
          label="Image category"
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
          onPress={deleteLastRow}
          disabled={isLoading}
        >
          Delete last row
        </Button>
        <Button
          icon="refresh"
          mode="text"
          onPress={resetRows}
          disabled={isLoading}
        >
          Reset rows
        </Button>
        <Text variant="bodySmall">
          ***To delete a specific row, long press that row's first cell***
        </Text>
        <Text variant="bodySmall">
          ***To sort by a specific column, long press that column's header***
        </Text>
      </View>
      <View style={styles.tableTitleContainer}>
        <Text variant="titleMedium">Scanned image table</Text>
      </View>
      <View>
        <ScrollView horizontal contentContainerStyle={styles.scrollView}>
          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text variant="bodySmall">Image link</Text>
              </View>
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
                      sortByColumn(fieldNameIndex);
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
            {rows?.length === 0 ? (
              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.emptyRowMsg}>No rows added yet</Text>
                </View>
                {fieldNames?.map((_, cellIndex) => (
                  <View key={cellIndex} style={styles.cell}></View>
                ))}
              </View>
            ) : (
              rows?.slice(from, to).map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  <View style={styles.cell}>
                    <Button
                      mode="text"
                      disabled={isLoading}
                      onPress={() => {
                        setModalRowIndex(rowIndex);
                        setImage1(images[rowIndex][0]);
                        setImage2(images[rowIndex][1]);
                      }}
                      onLongPress={() => {
                        deleteRow(rowIndex);
                      }}
                      labelStyle={{
                        textDecorationLine: "underline",
                        color: "blue",
                      }}
                    >
                      {images?.length > 0 &&
                      !images[rowIndex].some(
                        (image) => typeof image === "string",
                      )
                        ? "Add image"
                        : "View image"}
                    </Button>
                    <Portal>
                      <Modal
                        visible={modalRowIndex === rowIndex}
                        onDismiss={() => {
                          updateRowImages(rowIndex);
                          setModalRowIndex(null);
                        }}
                        contentContainerStyle={styles.modal}
                      >
                        <View style={styles.imageSelections}>
                          <ImageSelection
                            image={image1}
                            handleImageUpdate={handleImage1Update}
                          />
                          <ImageSelection
                            image={image2}
                            handleImageUpdate={handleImage2Update}
                          />
                        </View>
                      </Modal>
                    </Portal>
                  </View>
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
                        {cellData
                          ? cellData.length > 20
                            ? cellData.substring(0, 20) + "..."
                            : cellData
                          : "..."}
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
              ))
            )}
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
  emptyRowMsg: {
    marginVertical: 10,
  },
  imageSelections: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
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
