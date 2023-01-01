import Resizer from "react-image-file-resizer";

const resizeFile = (file: File) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      600,
      600,
      "JPEG",
      90,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });
};

export const imageResizer = async (file: File) => {
  try {
    const resizedImage = await resizeFile(file) as File;
    return resizedImage;
    
  } catch (error: any) {
    throw new Error(error.message)
  }
};