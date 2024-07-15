import { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, RadioButton } from "react-native-paper";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { getAllParserData } from "../services/postService";

export default function ParserDataSelections() {
  const [parsersData, setParsersData] = useState([]);
  const [selectedParserDataIndex, setSelectedParserDataIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const parserDataList = parsersData?.map((parserData, index) => (
    <View style={styles.parserDataSelection} key={parserData.id}>
      <RadioButton
        value={parserData.id}
        status={
          parsersData && parsersData[selectedParserDataIndex].id === parserData.id
            ? "checked"
            : "unchecked"
        }
        onPress={() => {
          setSelectedParserDataIndex(index);
        }}
        disabled={isLoading}
      />
      <Text variant="titleMedium">{parserData.name}</Text>
    </View>
  ));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchParsersData = async () => {
        try {
          setIsLoading(true);
          const result = await getAllParserData();
          if (isActive) {
            setParsersData(result);
            setSelectedParserDataIndex(0);
          }
          setIsLoading(false);
        } catch (err) {
          alert(err);
          console.error(err);
          setIsLoading(false);
        }
      };
      fetchParsersData();
      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={{ opacity: isLoading ? 0.5 : 1 }}>
      <View style={styles.title}>
        {parsersData?.length === 0 ? (
          <View>
            <Text variant="titleMedium">No images scanned yet.</Text>
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
          <Text variant="headlineMedium">Select a parser's data</Text>
        )}
      </View>
      <View style={styles.parserDataList}>{parserDataList}</View>
      {parsersData?.length > 0 && (
        <View style={styles.parserDataModificationButtons}>
          <Button
            icon="pencil-outline"
            mode="text"
            disabled={isLoading}
            onPress={() => {}}
          >
            <Link
              href={{
                pathname: `../parserDataModal`,
                params: {
                  parserDataId:
                    parsersData?.length > 0 &&
                    parsersData[selectedParserDataIndex].id,
                },
              }}
            >
              Edit selected parser's data
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
  parserDataList: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  parserDataSelection: {
    flexDirection: "row",
  },
  parserDataModificationButtons: {
    alignItems: "flex-start",
  },
});
