import { UAParser } from 'ua-parser-js';

export interface DeviceCapabilities {
  canRender3D: boolean;
  maxTextureSize: number;
  reducedQuality: boolean;
  enableParticles: boolean;
}

export function getDeviceCapabilities(): DeviceCapabilities {
  const parser = new UAParser();
  const browser = parser.getBrowser();
  const device = parser.getDevice();
  const os = parser.getOS();
  const engine = parser.getEngine();

  // Check for low-end indicators
  const isLowEndDevice =
    // Mobile devices
    (device.type === 'mobile') ||
    (device.type === 'tablet') ||
    // Old browsers
    ((browser.name?.includes('Safari') ?? false) && (os.name?.includes('iOS') ?? false)) ||
    // Low memory indicators
    ((navigator.hardwareConcurrency ?? 4) <= 2) ||
    // Old Chrome versions
    ((browser.name?.includes('Chrome') ?? false) &&
      parseInt(browser.version?.split('.')[0] || '0') < 80);

  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const hasWebGL = !!gl;

  // Get max texture size
  let maxTextureSize = 512;
  if (gl && (gl instanceof WebGLRenderingContext)) {
    maxTextureSize = gl.getParameter(WebGLRenderingContext.MAX_TEXTURE_SIZE);
  }

  return {
    canRender3D: hasWebGL && !isLowEndDevice,
    maxTextureSize,
    reducedQuality: isLowEndDevice,
    enableParticles: !isLowEndDevice && hasWebGL,
  };
}
