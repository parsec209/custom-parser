import axios from "axios";

import { getParserData, updateParserData } from "./postService";

export const scan = async (parser, selectedImages) => {
  const parserIDString = parser.id.toString();
  const category = parser.name;
  const prompts = JSON.parse(parser.rows)[0];
  const headers = JSON.parse(parser.headers);
  const stringifiedPrompts = JSON.stringify(prompts);
  const imageUris = selectedImages.filter((image) => typeof image === "string");

  const getMimeType = (extension) => {
    switch (extension.toLowerCase()) {
      case "webp":
        return "image/webp";
      case "png":
        return "image/png";
      case "jpeg":
      case "jpg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      default:
        throw new Error(`Unsupported file extension: ${extension}`);
    }
  };

  const formData = new FormData();
  formData.append("prompts", stringifiedPrompts);
  formData.append("category", category);

  imageUris.forEach((uri, i) => {
    const extension = uri.split(".").pop();
    const type = getMimeType(extension);
    formData.append("images", {
      uri,
      type,
      name: `image-${i}.${extension}`,
    });
  });

  const { data } = await axios({
    url: process.env.EXPO_PUBLIC_API_URL,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const { parserDataId, parserDataRows, images } = await getParserData({
    parserId: parserIDString,
  });

  parserDataRows.push(data);
  images.push(selectedImages);

  await updateParserData({
    parserId: parserIDString,
    headers,
    parserDataRows,
    images,
  });

  return parserDataId;
};
