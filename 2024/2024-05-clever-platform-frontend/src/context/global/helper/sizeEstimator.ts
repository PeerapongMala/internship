export interface ModelData {
  size?: string | number;
  url?: string;
}

export const estimateFileSize = (model: ModelData): number => {
  if (model.size) return Number(model.size);
  if (model.url) {
    if (model.url.endsWith('.glb') || model.url.endsWith('.gltf'))
      return 1.5 * 1024 * 1024;
    if (model.url.endsWith('.jpg') || model.url.endsWith('.jpeg')) return 500 * 1024;
    if (model.url.endsWith('.png')) return 1 * 1024 * 1024;
  }
  return 1 * 1024 * 1024;
};

export const formatFileSize = (bytes: number): string => {
  const MB = bytes / (1024 * 1024);
  return MB.toFixed(2);
};
