import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";

import { SelectedImagesProvider } from "../contexts/selectedImagesContext";
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
        await createTables();
      } catch (err) {
        alert(err);
        console.error(err);
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
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="parsersModal"
            options={{
              presentation: "modal",
              title: "Parsers",
            }}
          />
          <Stack.Screen
            name="parserModal"
            options={{ presentation: "modal", title: "Parser" }}
          />
          <Stack.Screen
            name="parserDataModal"
            options={{ presentation: "modal", title: "Parser data" }}
          />
        </Stack>
      </SelectedImagesProvider>
    </PaperProvider>
  );
}
