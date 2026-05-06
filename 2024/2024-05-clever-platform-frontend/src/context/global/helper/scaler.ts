export function calculateScale(
  parentElement: { width: number; height: number },
  targetSize: { width: number; height: number },
) {
  const { width, height } = parentElement;
  const aspectRatio = width / height;
  const targetAspectRatio = targetSize.width / targetSize.height;

  const scale =
    aspectRatio > targetAspectRatio
      ? height / targetSize.height
      : width / targetSize.width;

  return scale;
}

export function calculateScaledSize(
  element: { width: number; height: number },
  scenarioSize = { width: 1440, height: 810 },
  includePadding = false,
) {
  if (!element) return { width: 0, height: 0 };

  const { width: cW, height: cH } = element;
  const { width: sW, height: sH } = scenarioSize;
  const aspect = sW / sH;

  let scaledW, scaledH;
  if (cW / cH > aspect) {
    // Canvas is wider: fit by height
    scaledH = cH;
    scaledW = scaledH * aspect;
  } else {
    // Canvas is taller: fit by width
    scaledW = cW;
    scaledH = scaledW / aspect;
  }

  let paddingX = 0;
  let paddingY = 0;

  if (includePadding) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Padding from edges of the window (centered layout)
    paddingX = (windowWidth - scaledW) / 2;
    paddingY = (windowHeight - scaledH) / 2;
  }

  return {
    scaleWidth: scaledW / sW,
    scaleHeight: scaledH / sH,
    width: scaledW,
    height: scaledH,
    paddingX,
    paddingY,
  };
}
