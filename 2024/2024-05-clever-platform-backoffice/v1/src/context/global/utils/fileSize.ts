export const getDataURLSize = (dataURL: string) => {
  // Remove data URL prefix to get actual base64 data
  const base64Data = dataURL.split(',')[1] || dataURL;

  // Calculate size more accurately for base64
  const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0;
  const sizeInBytes = (base64Data.length * 3) / 4 - padding;

  return {
    bytes: sizeInBytes,
    kb: (sizeInBytes / 1024).toFixed(2),
    mb: (sizeInBytes / (1024 * 1024)).toFixed(2),
    stringLength: dataURL.length,
  };
};

export const getJsonSize = (json: Record<string, any>) => {
  const jsonString = JSON.stringify(json);
  const sizeInBytes = new Blob([jsonString]).size;
  return {
    bytes: sizeInBytes,
    kb: (sizeInBytes / 1024).toFixed(2),
    mb: (sizeInBytes / (1024 * 1024)).toFixed(2),
    stringLength: jsonString.length,
  };
};

export const convertBytesToMb = (bytes: number) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};
