import { useState, useCallback, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { StyleSheet, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Text,
  // DataTable,
  Button,
  Portal,
  Modal,
  TextInput,
  Menu,
  IconButton,
  Dialog,
} from "react-native-paper";
import { getParserData, updateParserData } from "../services/postService";
import ImageSelection from "../components/ImageSelection";

export default function ParserDataModal() {
  let { parserDataId, parserId, rowHighlighted } = useLocalSearchParams<{
    parserDataId?: string;
    parserId?: string;
    rowHighlighted?: string;
  }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView | null>(null);

  const [name, setName] = useState("");
  const [fetchedParserId, setFetchedParserId] = useState(null);
  const [modalHeaderIndex, setModalHeaderIndex] = useState(null); //string or null
  const [modalRowAndCellIndex, setModalRowAndCellIndex] = useState(null); //{ rowIndex, cellIndex } || null
  const [modalRowIndex, setModalRowIndex] = useState(null); //string or null
  const [sortMenuHeaderIndex, setSortMenuHeaderIndex] = useState(null); //string or null
  const [dialogRowIndex, setDialogRowIndex] = useState(null); //string or null
  const [headers, setHeaders] = useState([""]);
  const [rows, setRows] = useState([]);
  const [images, setImages] = useState([]); // [[null || string, null || string]
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  // const [page, setPage] = useState<number>(0);
  // const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  // const [itemsPerPage, onItemsPerPageChange] = useState(4);
  const [modalText, setModalText] = useState("");
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRowIsHighlighted, setLastRowIsHighlighted] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  // const from = page * itemsPerPage;
  // const to = Math.min((page + 1) * itemsPerPage, rows.length);
  // const numberOfPages = Math.ceil(rows.length / itemsPerPage);

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
    try {
      await updateParserData({
        headers,
        parserDataRows: rows,
        images,
        parserDataId,
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

  const getAndSetParserDataFields = async () => {
    try {
      setIsLoading(true);
      const parserData = await getParserData({ parserDataId, parserId });
      setName(parserData.name);
      setFetchedParserId(parserData.parserId);
      setHeaders(parserData.headers);
      setRows(parserData.parserDataRows);
      setImages(parserData.images);
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
    if (lastRowIsHighlighted) {
      setLastRowIsHighlighted(false);
    }
    const updatedRows = [...rows];
    const updatedImages = [...images];
    const newRow = headers.map(() => {
      return "";
    });
    const newImagePair = [null, null];
    updatedRows.push(newRow);
    updatedImages.push(newImagePair);
    setRows(updatedRows);
    setImages(updatedImages);
  };

  const deleteRow = (rowIndex) => {
    if (lastRowIsHighlighted) {
      setLastRowIsHighlighted(false);
    }
    const updatedRows = [...rows];
    const updatedImages = [...images];
    updatedRows.splice(rowIndex, 1);
    updatedImages.splice(rowIndex, 1);
    setRows(updatedRows);
    setImages(updatedImages);
  };

  const deleteLastRow = () => {
    if (lastRowIsHighlighted) {
      setLastRowIsHighlighted(false);
    }
    const updatedRows = [...rows];
    const updatedImages = [...images];
    updatedRows.pop();
    updatedImages.pop();
    setRows(updatedRows);
    setImages(updatedImages);
  };

  const resetRows = () => {
    if (lastRowIsHighlighted) {
      setLastRowIsHighlighted(false);
    }
    setRows([]);
    setImages([]);
    // setPage(0);
  };

  const sortColumn = (headerIndex, sortDirection) => {
    if (lastRowIsHighlighted) {
      setLastRowIsHighlighted(false);
    }
    const rowsWithIndices = rows.map((value, index) => ({ value, index }));
    if (sortDirection === "ascending") {
      rowsWithIndices.sort((a, b) =>
        a.value[headerIndex].localeCompare(b.value[headerIndex]),
      );
    } else if (sortDirection === "descending") {
      rowsWithIndices.sort((a, b) =>
        b.value[headerIndex].localeCompare(a.value[headerIndex]),
      );
    }
    const updatedRows = rowsWithIndices.map((item) => item.value);
    const updatedImages = rowsWithIndices.map((item) => images[item.index]);
    setRows(updatedRows);
    setImages(updatedImages);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const isRowHighlighted = Boolean(rowHighlighted);
  //     if (isRowHighlighted) {
  //       setLastRowIsHighlighted(isRowHighlighted);
  //       router.setParams({ rowHighlighted: "false" });
  //     }
  //   }, [rowHighlighted]),
  // );

  useFocusEffect(
    useCallback(() => {
      const isRowHighlighted = Boolean(rowHighlighted);
      setLastRowIsHighlighted(isRowHighlighted);
      if (isRowHighlighted && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current.scrollTo({ y: contentHeight, animated: true });
        }, 200);
      } 
    }, [rowHighlighted, contentHeight]),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getAndSetParserDataFields();
      return () => {
        isActive = false;
      };
    }, []),
  );

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
              To delete a specific row:
            </Text>
            <Text variant="bodySmall">Long press that row's image link.</Text>
            <Text> </Text>
            <Text variant="bodyMedium" style={styles.dialog}>
              To sort by column:
            </Text>
            <Text variant="bodySmall">
              Long press that column's header link.
            </Text>
          </Modal>
        </Portal>
      </View>
      <View style={styles.tableTitleContainer}>
        <Text variant="titleMedium">Headers and scanned data</Text>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView
          ref={scrollViewRef}
          // style={styles.scrollView}
          onContentSizeChange={(width, height) => setContentHeight(height)}
        >
          {/* <ScrollView horizontal contentContainerStyle={styles.horizontalScrollView}> */}
          <ScrollView horizontal>
            <View style={styles.table}>
              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text variant="bodySmall">Scanned images</Text>
                </View>
                {headers?.map((header, headerIndex) => (
                  <View key={headerIndex} style={[styles.cell, styles.header]}>
                    <Menu
                      visible={sortMenuHeaderIndex === headerIndex}
                      onDismiss={() => {
                        setSortMenuHeaderIndex(null);
                      }}
                      anchor={
                        <Button
                          mode="text"
                          disabled={isLoading}
                          onPress={() => {
                            setModalHeaderIndex(headerIndex);
                            setModalText(header);
                          }}
                          onLongPress={() => {
                            setSortMenuHeaderIndex(headerIndex);
                          }}
                          labelStyle={{
                            textDecorationLine: "underline",
                            color: "blue",
                          }}
                        >
                          {header?.length > 20
                            ? header.substring(0, 20) + "..."
                            : header}
                        </Button>
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          sortColumn(headerIndex, "ascending");
                          setSortMenuHeaderIndex(null);
                        }}
                        title="Sort ascending"
                      />
                      <Menu.Item
                        onPress={() => {
                          sortColumn(headerIndex, "descending");
                          setSortMenuHeaderIndex(null);
                        }}
                        title="Sort descending"
                      />
                    </Menu>

                    <Portal>
                      <Modal
                        visible={modalHeaderIndex === headerIndex}
                        onDismiss={() => {
                          setModalHeaderIndex(null);
                        }}
                        contentContainerStyle={styles.modal}
                      >
                        <TextInput
                          label={"Header name"}
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
                  {headers?.map((_, cellIndex) => (
                    <View key={cellIndex} style={styles.cell}></View>
                  ))}
                </View>
              ) : (
                //rows?.slice(from, to).map((row, rowIndex) => (
                rows?.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    <View
                      style={[
                        styles.cell,
                        rowIndex === rows.length - 1 &&
                          lastRowIsHighlighted &&
                          styles.highlightedCell,
                      ]}
                    >
                      <Button
                        mode="text"
                        disabled={isLoading}
                        onPress={() => {
                          setModalRowIndex(rowIndex);
                          setImage1(images[rowIndex][0]);
                          setImage2(images[rowIndex][1]);
                        }}
                        onLongPress={() => {
                          setDialogRowIndex(rowIndex);
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
                          contentContainerStyle={[
                            styles.modal,
                            styles.imageModal,
                          ]}
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
                      <Portal>
                        <Dialog
                          visible={dialogRowIndex === rowIndex}
                          onDismiss={() => {
                            setDialogRowIndex(null);
                          }}
                        >
                          <Dialog.Content>
                            <Text variant="bodyMedium">
                              Ok to delete this entire row?
                            </Text>
                          </Dialog.Content>
                          <Dialog.Actions>
                            <Button
                              onPress={() => {
                                deleteRow(rowIndex);
                              }}
                            >
                              OK
                            </Button>
                          </Dialog.Actions>
                          <Dialog.Actions>
                            <Button
                              onPress={() => {
                                setDialogRowIndex(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </Dialog.Actions>
                        </Dialog>
                      </Portal>
                    </View>
                    {row?.map((cellData, cellIndex) => (
                      <View
                        key={cellIndex}
                        style={[
                          styles.cell,
                          rowIndex === rows.length - 1 &&
                            lastRowIsHighlighted &&
                            styles.highlightedCell,
                        ]}
                      >
                        <Button
                          mode="text"
                          disabled={isLoading}
                          onPress={() => {
                            setModalRowAndCellIndex({ rowIndex, cellIndex });
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
                              modalRowAndCellIndex !== null &&
                              modalRowAndCellIndex.rowIndex === rowIndex &&
                              modalRowAndCellIndex.cellIndex === cellIndex
                            }
                            onDismiss={() => {
                              setModalRowAndCellIndex(null);
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
        </ScrollView>

        {/* <DataTable.Pagination
          style={styles.pagination}
          page={page}
          numberOfPages={numberOfPages}
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
            pathname: `./parserModal`,
            params: {
              parserId: fetchedParserId,
            },
          }}
        >
          View parser
        </Link>
      </Button>
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
  dialog: {
    fontWeight: "bold",
  },
  tableTitleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  scrollContainer: {
    // flex: 1,
    height: 200, // MUST
    marginBottom: 10, //MUST
    paddingHorizontal: 16, //MUST
  },
  // scrollView: {
  // height: 200,
  // flexGrow: 1,
  // marginBottom: 10,
  // paddingHorizontal: 16
  // },
  // horizontalScrollView: {
  //   flexDirection: 'row',
  // },
  modal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
  },
  imageModal: {
    alignItems: "center",
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
  header: {
    backgroundColor: "lightgrey",
  },
  highlightedCell: {
    backgroundColor: "lightgreen",
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
