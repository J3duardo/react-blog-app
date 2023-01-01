declare module "react-image-file-resizer" {
  export function imageFileResizer(
    file: Blob,
    maxWidth: number,
    maxHeight: number,
    compressFormat: string,
    quality: number,
    rotation: number,
    responseUriFunc: (
      value: string | Blob | File | ProgressEvent<FileReader>
    ) => void,
    outputType?: string,
    minWidth?: number,
    minHeight?: number
  ): void
}