import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import * as SQLite from "expo-sqlite";

import { SelectedImagesProvider } from "../contexts/selectedImagesContext";

const [selectedImages, setSelectedImages] = useState([null, null]);

export const db = SQLite.openDatabase("db.db");

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists parsers (id integer primary key not null, name text unique, fields text, prompts text);",
        [],
        (_, result) => {
          console.log("CREATED PARSERS TABLE: " + JSON.stringify(result));
          tx.executeSql(
            "create table if not exists images_data (id integer primary key not null, name text unique, fields text, data text, parser_id integer, foreign key(parser_id) references parsers(id));",
            [],
            (_, result) => {
              console.log(
                "CREATED IMAGES_DATA TABLE: " + JSON.stringify(result),
              );
            },
            (_, err) => {
              alert(err);
              console.error(err);
              return true;
            },
          );
        },
        (_, err) => {
          alert(err);
          console.error(err);
          return true;
        },
      );
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider>
      <SelectedImagesProvider
        value={{
          selectedImages,
          setSelectedImages,
        }}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="parsers"
            options={{ presentation: "modal", title: "Parser selection" }}
          />
          <Stack.Screen
            name="parser"
            options={{ presentation: "modal", title: "Parser setup" }}
          />
        </Stack>
      </SelectedImagesProvider>
    </PaperProvider>
  );
}
