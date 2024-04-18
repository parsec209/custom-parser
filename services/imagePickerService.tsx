import * as ImagePicker from "expo-image-picker";

const [status, requestPermission] = ImagePicker.useCameraPermissions();

if (status === null) {
  requestPermission();
}

export const pickImage = async () => {
  const { assets } = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 1,
  });
  return assets ? assets[0].uri : assets;
};

export const takePhoto = async () => {
  const pendingResult = await ImagePicker.getPendingResultAsync();
  if (pendingResult && pendingResult.length > 0) {
    console.log(pendingResult);
  }
  const { assets } = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });
  return assets ? assets[0].uri : assets;
};
