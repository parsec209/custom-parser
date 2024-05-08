import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";

import { SelectedImagesProvider } from "../contexts/selectedImagesContext";
import { ParsersProvider } from "../contexts/parsersContext";
import { SelectedParserProvider } from "../contexts/selectedParserContext";
import { SelectedTableProvider } from "../contexts/selectedImageDataContext";
import { ImagesDataProvider } from "../contexts/imagesDataContext";
import { createTables } from "../services/postService";

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
  const [selectedImages, setSelectedImages] = useState([null, null]);
  const [parsers, setParsers] = useState([]);
  const [selectedParser, setSelectedParser] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [imagesData, setImagesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      try {
        setIsLoading(true);
        await createTables();
        setIsLoading(false);
      } catch (err) {
        alert(err);
        console.error(err);
        setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
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
        <ParsersProvider
          value={{
            parsers,
            setParsers,
          }}
        >
          <SelectedParserProvider
            value={{
              selectedParser,
              setSelectedParser,
            }}
          >
            <SelectedTableProvider
              value={{
                selectedTable,
                setSelectedTable,
              }}
            >
              <ImagesDataProvider
                value={{
                  imagesData,
                  setImagesData,
                }}
              >
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="parsers-modal"
                    options={{
                      presentation: "modal",
                      title: "Parser selection",
                    }}
                  />
                  <Stack.Screen
                    name="parser-modal"
                    options={{ presentation: "modal", title: "Parser setup" }}
                  />
                </Stack>
              </ImagesDataProvider>
            </SelectedTableProvider>
          </SelectedParserProvider>
        </ParsersProvider>
      </SelectedImagesProvider>
    </PaperProvider>
  );
}
