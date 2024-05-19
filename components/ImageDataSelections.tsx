import { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, RadioButton } from "react-native-paper";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { getAllImagesData } from "../services/postService";

export default function ImageDataSelections() {
  const [imagesData, setImagesData] = useState([]);
  const [selectedImageDataIndex, setSelectedImageDataIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const imageDataList = imagesData?.map((imageData, index) => (
    <View style={styles.imageDataSelection} key={imageData.id}>
      <RadioButton
        value={imageData.id}
        status={
          imagesData && imagesData[selectedImageDataIndex].id === imageData.id
            ? "checked"
            : "unchecked"
        }
        onPress={() => {
          setSelectedImageDataIndex(index);
        }}
        disabled={isLoading}
      />
      <Text variant="titleMedium">{imageData.name}</Text>
    </View>
  ));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchImagesData = async () => {
        try {
          setIsLoading(true);
          const result = await getAllImagesData();
          if (isActive) {
            setImagesData(result);
            setSelectedImageDataIndex(0);
          }
          setIsLoading(false);
        } catch (err) {
          alert(err);
          console.error(err);
          setIsLoading(false);
        }
      };
      fetchImagesData();
      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={{ opacity: isLoading ? 0.5 : 1 }}>
      <View style={styles.title}>
        {imagesData?.length === 0 ? (
          <View>
            <Text variant="titleMedium">No tables available.</Text>
            <Button
              labelStyle={{
                textDecorationLine: "underline",
                color: "blue",
              }}
              mode="text"
              onPress={() => {}}
            >
              <Link
                href={{
                  pathname: `./parsers`,
                }}
              >
                Set up a parser first
              </Link>
            </Button>
          </View>
        ) : (
          <Text variant="headlineMedium">Select a table</Text>
        )}
      </View>
      <View style={styles.imageDataList}>{imageDataList}</View>
      {imagesData?.length > 0 && (
        <View style={styles.imageDataModificationButtons}>
          <Button
            icon="pencil-outline"
            mode="text"
            disabled={isLoading}
            onPress={() => {}}
          >
            <Link
              href={{
                pathname: `../image-data-modal`,
                params: {
                  imageDataId:
                    imagesData?.length > 0 &&
                    imagesData[selectedImageDataIndex].id,
                },
              }}
            >
              Edit selected table
            </Link>
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    alignItems: "center",
  },
  imageDataList: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  imageDataSelection: {
    flexDirection: "row",
  },
  imageDataModificationButtons: {
    alignItems: "flex-start",
  },
});
