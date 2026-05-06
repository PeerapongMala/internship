import { DeviceCapabilities, getDeviceCapabilities } from './device-detector';
import { MemoryMonitor } from './memory-monitor';
// import StoreGlobal from '@store/global';
// import StoreGlobalPersist from '@store/global/persist';
import React, { useEffect, useState } from 'react';

interface MemoryInfo {
  used: number;
  total: number;
  limit: number;
  percentage: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  pressure?: string; // Memory pressure level
  availableRAM?: number; // Available system RAM estimate
}

interface PerformanceInfo {
  fps: number;
  frameTime: number;
  domNodes: number;
  activeListeners: number;
  imageCount: number;
  canvasCount: number;
  gpuVendor?: string;
  gpuRenderer?: string;
  webglVersion?: string;
  maxTextureUnits?: number;
  maxVertexAttribs?: number;
  connectionType?: string;
  devicePixelRatio: number;
  screenResolution: string;
  viewportSize: string;
  batteryLevel?: number;
  batteryCharging?: boolean;
  concurrentRequests: number;
  serviceWorkerActive: boolean;
}

// interface SystemInfoProps {
//   // isVisible: boolean;
//   // setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
// }

const FloatingModalSystemInfo: React.FC<{
  children?: React.ReactNode;
  settingChildren?: React.ReactNode;
}> = ({ children, settingChildren }) => {
  // const { showMemoryInfo } = StoreGlobalPersist.StateGet(['showMemoryInfo']);
  // const { settings } = StoreGlobalPersist.StateGet(['settings']);

  const [showMemoryInfo, setShowMemoryInfo] = useState(true);

  // useEffect(() => {
  //   setShowMemoryInfo(isVisible);
  // }, [isVisible]);

  // useEffect(() => {
  //   if (showMemoryInfo) setShowMemoryInfo(false);
  // }, [showMemoryInfo]);

  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(
    null,
  );
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo>({
    used: 0,
    total: 0,
    limit: 0,
    percentage: 0,
    status: 'low',
  });
  const [performanceInfo, setPerformanceInfo] = useState<PerformanceInfo>({
    fps: 0,
    frameTime: 0,
    domNodes: 0,
    activeListeners: 0,
    imageCount: 0,
    canvasCount: 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    screenResolution: `${screen.width}x${screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    concurrentRequests: 0,
    serviceWorkerActive:
      'serviceWorker' in navigator && navigator.serviceWorker.controller !== null,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMemmoryUsageExpanded, setIsMemmoryUsageExpanded] = useState(false);
  const [isPerformanceExpanded, setIsPerformanceExpanded] = useState(false);
  const [isDeviceInfoExpanded, setIsDeviceInfoExpanded] = useState(false);
  const [isGraphicsInfoExpanded, setIsGraphicsInfoExpanded] = useState(false);
  const [isSystemNetworkExpanded, setIsSystemNetworkExpanded] = useState(false);
  const [isDiagnosticsExpanded, setIsDiagnosticsExpanded] = useState(false);
  const [isDebugExpanded, setIsDebugExpanded] = useState(false);
  const [isSettingExpanded, setIsSettingExpanded] = useState(false);

  const [position, setPosition] = useState({ x: 16, y: 16 }); // Default top-4 right-4 (16px)
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const memoryMonitor = MemoryMonitor.getInstance();

  // Check debug mode from URL params and update global store
  // const checkDebugMode = (): void => {
  //   // Check URL parameters
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const enableDebugModeParam = urlParams.get('enableDebugMode');

  //   // Only update if the parameter is explicitly provided
  //   if (enableDebugModeParam !== null) {
  //     // StoreGlobalPersist.MethodGet().setShowMemoryInfo(enableDebugMode);
  //   }
  // };

  // // Initialize debug mode
  // useEffect(() => {
  //   // checkDebugMode();

  //   if (showMemoryInfo) {
  //     setIsExpanded(true); // Auto-expand when memory info is shown
  //   }
  // }, [showMemoryInfo]);

  // Calculate memory status
  const getMemoryStatus = (percentage: number): MemoryInfo['status'] => {
    if (percentage < 50) return 'low';
    if (percentage < 70) return 'medium';
    if (percentage < 90) return 'high';
    return 'critical';
  };

  // Get comprehensive memory info with better fallback
  const getComprehensiveMemoryInfo = (): MemoryInfo => {
    const performance = window.performance as any;

    let used = 0;
    let total = 0;
    let limit = 0;
    let pressure = 'unknown';
    let availableRAM = 0;

    // Try to get memory info from performance API
    if (performance.memory) {
      used = performance.memory.usedJSHeapSize || 0;
      total = performance.memory.totalJSHeapSize || 0;
      limit = performance.memory.jsHeapSizeLimit || 0;
    }

    // Enhanced fallback for devices without performance.memory
    if (used === 0 || limit === 0) {
      // Estimate based on device capabilities and viewport
      const viewportArea = window.innerWidth * window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      const totalPixels = viewportArea * pixelRatio * pixelRatio;

      // Rough memory estimation based on various factors
      const baseMemoryEstimate = Math.max(
        totalPixels * 4, // 4 bytes per pixel minimum
        16 * 1024 * 1024, // 16MB minimum
      );

      // Factor in DOM complexity
      const domNodes = document.querySelectorAll('*').length;
      const domMemoryEstimate = domNodes * 1000; // ~1KB per DOM node estimate

      // Factor in images and canvases
      const images = document.querySelectorAll('img');
      const canvases = document.querySelectorAll('canvas');
      let mediaMemoryEstimate = 0;

      images.forEach((img) => {
        if (img.naturalWidth && img.naturalHeight) {
          mediaMemoryEstimate += img.naturalWidth * img.naturalHeight * 4; // RGBA
        }
      });

      canvases.forEach((canvas) => {
        mediaMemoryEstimate += canvas.width * canvas.height * 4; // RGBA
      });

      used = baseMemoryEstimate + domMemoryEstimate + mediaMemoryEstimate;

      // Estimate system limits based on device characteristics
      const cores = navigator.hardwareConcurrency || 2;
      const isLowEnd = cores <= 2 || navigator.userAgent.includes('Mobile');

      if (isLowEnd) {
        limit = 512 * 1024 * 1024; // 512MB for low-end devices
        availableRAM = 1024 * 1024 * 1024; // 1GB estimate
      } else {
        limit = 2 * 1024 * 1024 * 1024; // 2GB for better devices
        availableRAM = 4 * 1024 * 1024 * 1024; // 4GB estimate
      }

      total = Math.max(used, limit * 0.1);
    }

    // Memory pressure detection
    if ('memory' in performance && performance.memory) {
      const efficiency = used / total;
      if (efficiency > 0.9) pressure = 'critical';
      else if (efficiency > 0.7) pressure = 'high';
      else if (efficiency > 0.5) pressure = 'medium';
      else pressure = 'low';
    }

    const percentage = limit > 0 ? (used / limit) * 100 : 0;
    const status = getMemoryStatus(percentage);

    return {
      used,
      total,
      limit,
      percentage,
      status,
      pressure,
      availableRAM,
    };
  };

  // Enhanced performance info gathering
  const getPerformanceInfo = (): Omit<PerformanceInfo, 'fps' | 'frameTime'> => {
    const domNodes = document.querySelectorAll('*').length;
    const imageCount = document.querySelectorAll('img').length;
    const canvasCount = document.querySelectorAll('canvas').length;

    // More accurate listener count estimation
    let activeListeners = 0;
    try {
      activeListeners = document.querySelectorAll(
        '[onclick], [onmouseover], [onmouseout], [addEventListener]',
      ).length;
      // Add event listeners attached to common elements
      activeListeners += document.querySelectorAll(
        'button, a, input, select, textarea',
      ).length;
    } catch (e) {
      activeListeners = 0;
    }

    // Get WebGL info for GPU debugging
    let gpuVendor = 'Unknown';
    let gpuRenderer = 'Unknown';
    let webglVersion = 'None';
    let maxTextureUnits = 0;
    let maxVertexAttribs = 0;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (gl && gl instanceof WebGLRenderingContext) {
        webglVersion = 'WebGL 1.0';
        // const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        // if (debugInfo) {
        //   gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
        //   gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
        // }
        maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) || 0;
        maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) || 0;

        // Try WebGL 2
        const gl2 = canvas.getContext('webgl2');
        if (gl2) {
          webglVersion = 'WebGL 2.0';
        }
      }
    } catch (e) {
      // WebGL not supported or blocked
    }

    // Network connection info
    let connectionType = 'Unknown';
    try {
      const nav = navigator as any;
      if (nav.connection) {
        connectionType = nav.connection.effectiveType || nav.connection.type || 'Unknown';
      }
    } catch (e) {
      // Connection API not supported
    }

    // Battery info for mobile debugging
    let batteryLevel: number | undefined;
    let batteryCharging: boolean | undefined;
    try {
      const nav = navigator as any;
      if (nav.getBattery) {
        nav.getBattery().then((battery: any) => {
          batteryLevel = battery.level * 100;
          batteryCharging = battery.charging;
        });
      }
    } catch (e) {
      // Battery API not supported
    }

    // Count active network requests (approximate)
    const concurrentRequests = (window as any).activeRequestCount || 0;

    // Service worker status
    const serviceWorkerActive =
      'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;

    return {
      domNodes,
      activeListeners,
      imageCount,
      canvasCount,
      gpuVendor,
      gpuRenderer,
      webglVersion,
      maxTextureUnits,
      maxVertexAttribs,
      connectionType,
      devicePixelRatio: window.devicePixelRatio || 1,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      batteryLevel,
      batteryCharging,
      concurrentRequests,
      serviceWorkerActive,
    };
  };

  // FPS tracking
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    let frameTime = 0;

    const trackFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      const deltaTime = currentTime - lastTime;
      frameTime = deltaTime;

      if (deltaTime >= 1000) {
        fps = Math.round((frameCount * 1000) / deltaTime);
        frameCount = 0;
        lastTime = currentTime;

        setPerformanceInfo((prev) => ({
          ...prev,
          fps,
          frameTime: frameTime,
        }));
      }

      requestAnimationFrame(trackFPS);
    };

    const animationId = requestAnimationFrame(trackFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);

    // Initialize memory info immediately
    const initialMemInfo = getComprehensiveMemoryInfo();
    setMemoryInfo(initialMemInfo);

    const initialPerfInfo = getPerformanceInfo();
    setPerformanceInfo((prev) => ({
      ...prev,
      ...initialPerfInfo,
    }));

    // Start comprehensive memory monitoring with shorter interval for better responsiveness
    memoryMonitor.startMonitoring(() => {
      const memInfo = getComprehensiveMemoryInfo();
      setMemoryInfo(memInfo);

      const perfInfo = getPerformanceInfo();
      setPerformanceInfo((prev) => ({
        ...prev,
        ...perfInfo,
      }));

      // Enhanced warning system
      if (memInfo.status === 'high' || memInfo.status === 'critical') {
        console.warn('High memory usage detected:', {
          used: `${(memInfo.used / 1024 / 1024).toFixed(1)}MB`,
          percentage: `${memInfo.percentage.toFixed(1)}%`,
          status: memInfo.status,
          domNodes: perfInfo.domNodes,
          images: perfInfo.imageCount,
          canvases: perfInfo.canvasCount,
        });
      }

      // Performance warnings
      if (performanceInfo.fps < 30 && performanceInfo.fps > 0) {
        console.warn('Low FPS detected:', performanceInfo.fps);
      }

      if (perfInfo.domNodes > 10000) {
        console.warn('High DOM node count:', perfInfo.domNodes);
      }
    });

    // Add resize listener to update viewport size
    const handleResize = () => {
      setPerformanceInfo((prev) => ({
        ...prev,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      }));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      memoryMonitor.stopMonitoring();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Memory status color
  const getStatusColor = (status: MemoryInfo['status']) => {
    switch (status) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-orange-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Drag handlers - Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest('.drag-handle')
    ) {
      setIsDragging(true);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - 300; // Account for component width
      const maxY = window.innerHeight - 200; // Account for component height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest('.drag-handle')
    ) {
      setIsDragging(true);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - 300; // Account for component width
      const maxY = window.innerHeight - 200; // Account for component height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners for drag (mouse and touch)
  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // Touch events
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        // Clean up mouse events
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Clean up touch events
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  // Basic view with enhanced low-spec device info
  const renderBasicInfo = () => (
    <div className="space-y-1 border-b border-gray-600 pb-2">
      <div className={`font-bold ${getStatusColor(memoryInfo.status)}`}>
        Memory: {formatBytes(memoryInfo.used)} ({memoryInfo.percentage.toFixed(1)}%)
      </div>
      <div>
        Status:{' '}
        <span className={getStatusColor(memoryInfo.status)}>
          {memoryInfo.status.toUpperCase()}
        </span>
        {memoryInfo.pressure && memoryInfo.pressure !== 'unknown' && (
          <span className="text-xs text-gray-400"> ({memoryInfo.pressure})</span>
        )}
      </div>
      <div>FPS: {performanceInfo.fps}</div>
      <div>Frame: {performanceInfo.frameTime.toFixed(1)}ms</div>
      <div>3D: {deviceCapabilities?.canRender3D ? 'Yes' : 'No'}</div>
      <div>GPU: {performanceInfo.webglVersion || 'None'}</div>
      <div className="text-xs text-yellow-300">
        Resolution: {performanceInfo.screenResolution}
        {performanceInfo.devicePixelRatio > 1 && (
          <span> @{performanceInfo.devicePixelRatio}x</span>
        )}
      </div>
      {deviceCapabilities?.reducedQuality && (
        <div className="text-xs text-orange-400">⚠️ Low-spec mode</div>
      )}
      {performanceInfo.batteryLevel !== undefined && (
        <div className="text-xs">
          🔋 {performanceInfo.batteryLevel.toFixed(0)}%
          {performanceInfo.batteryCharging ? ' ⚡' : ''}
        </div>
      )}
    </div>
  );

  // Detailed view with comprehensive debugging info
  const renderDetailedInfo = () => (
    <div className="space-y-2 border-b border-gray-600 pb-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsMemmoryUsageExpanded(!isMemmoryUsageExpanded)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {isMemmoryUsageExpanded ? '▼' : '▶'}
        </button>
        <div className="font-bold text-yellow-400">Memory Usage</div>
      </div>
      {isMemmoryUsageExpanded && (
        <div className="border-b border-gray-600 pb-2">
          <div className={getStatusColor(memoryInfo.status)}>
            Used: {formatBytes(memoryInfo.used)}
          </div>
          <div>Total: {formatBytes(memoryInfo.total)}</div>
          <div>Limit: {formatBytes(memoryInfo.limit)}</div>
          <div>Usage: {memoryInfo.percentage.toFixed(1)}%</div>
          {memoryInfo.availableRAM && (
            <div>Est. RAM: {formatBytes(memoryInfo.availableRAM)}</div>
          )}
          <div>
            Status:{' '}
            <span className={getStatusColor(memoryInfo.status)}>
              {memoryInfo.status.toUpperCase()}
            </span>
            {memoryInfo.pressure && memoryInfo.pressure !== 'unknown' && (
              <span className="text-xs"> ({memoryInfo.pressure})</span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsPerformanceExpanded(!isPerformanceExpanded)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {isPerformanceExpanded ? '▼' : '▶'}
        </button>
        <div className="font-bold text-blue-400">Performance</div>
      </div>
      {isPerformanceExpanded && (
        <div className="border-b border-gray-600 pb-2">
          <div>FPS: {performanceInfo.fps}</div>
          <div>Frame Time: {performanceInfo.frameTime.toFixed(1)}ms</div>
          <div>DOM Nodes: {performanceInfo.domNodes.toLocaleString()}</div>
          <div>Event Listeners: {performanceInfo.activeListeners}</div>
          <div>Images: {performanceInfo.imageCount}</div>
          <div>Canvas: {performanceInfo.canvasCount}</div>
          <div>Active Requests: {performanceInfo.concurrentRequests}</div>
          <div>SW Active: {performanceInfo.serviceWorkerActive ? 'Yes' : 'No'}</div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsDeviceInfoExpanded(!isDeviceInfoExpanded)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {isDeviceInfoExpanded ? '▼' : '▶'}
        </button>
        <div className="font-bold text-green-400">Device Info</div>
      </div>
      {isDeviceInfoExpanded && (
        <div className="border-b border-gray-600 pb-2">
          <div>3D Enabled: {deviceCapabilities?.canRender3D ? 'Yes' : 'No'}</div>
          <div>Reduced Quality: {deviceCapabilities?.reducedQuality ? 'Yes' : 'No'}</div>
          <div>Max Texture: {deviceCapabilities?.maxTextureSize || 'Unknown'}</div>
          <div>Particles: {deviceCapabilities?.enableParticles ? 'Yes' : 'No'}</div>
          <div>Pixel Ratio: {performanceInfo.devicePixelRatio}x</div>
          <div>Screen: {performanceInfo.screenResolution}</div>
          <div>Viewport: {performanceInfo.viewportSize}</div>
          <div>CPU Cores: {navigator.hardwareConcurrency || 'Unknown'}</div>
          {performanceInfo.batteryLevel !== undefined && (
            <>
              <div>Battery: {performanceInfo.batteryLevel.toFixed(0)}%</div>
              <div>Charging: {performanceInfo.batteryCharging ? 'Yes' : 'No'}</div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsGraphicsInfoExpanded(!isGraphicsInfoExpanded)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {isGraphicsInfoExpanded ? '▼' : '▶'}
        </button>
        <div className="font-bold text-purple-400">Graphics Info</div>
      </div>
      {isGraphicsInfoExpanded && (
        <div className="border-b border-gray-600 pb-2">
          <div>WebGL: {performanceInfo.webglVersion || 'Not supported'}</div>
          {performanceInfo.gpuVendor && performanceInfo.gpuVendor !== 'Unknown' && (
            <>
              <div className="text-xs">Vendor: {performanceInfo.gpuVendor}</div>
              <div className="text-xs">Renderer: {performanceInfo.gpuRenderer}</div>
            </>
          )}
          {(performanceInfo.maxTextureUnits || 0) > 0 && (
            <>
              <div>Texture Units: {performanceInfo.maxTextureUnits}</div>
              <div>Vertex Attribs: {performanceInfo.maxVertexAttribs}</div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsSystemNetworkExpanded(!isSystemNetworkExpanded)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {isSystemNetworkExpanded ? '▼' : '▶'}
        </button>
        <div className="font-bold text-cyan-400">Network & System</div>
      </div>
      {isSystemNetworkExpanded && (
        <div className="border-b border-gray-600 pb-2">
          <div>Connection: {performanceInfo.connectionType}</div>
          <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
          <div>Platform: {navigator.platform}</div>
          <div>Language: {navigator.language}</div>
          <div>Online: {navigator.onLine ? 'Yes' : 'No'}</div>
          <div>Cookies: {navigator.cookieEnabled ? 'Yes' : 'No'}</div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsDiagnosticsExpanded(!isDiagnosticsExpanded)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {isDiagnosticsExpanded ? '▼' : '▶'}
        </button>
        <div className="font-bold text-orange-400">Low-Spec Diagnostics</div>
      </div>
      {isDiagnosticsExpanded && (
        <div className="border-b border-gray-600 pb-2">
          {deviceCapabilities?.reducedQuality && (
            <div className="text-orange-300">⚠️ Device identified as low-spec</div>
          )}
          {performanceInfo.fps < 30 && performanceInfo.fps > 0 && (
            <div className="text-red-300">
              ⚠️ Low FPS detected ({performanceInfo.fps})
            </div>
          )}
          {performanceInfo.frameTime > 33 && (
            <div className="text-yellow-300">
              ⚠️ High frame time ({performanceInfo.frameTime.toFixed(1)}ms)
            </div>
          )}
          {performanceInfo.domNodes > 10000 && (
            <div className="text-orange-300">
              ⚠️ High DOM complexity ({performanceInfo.domNodes.toLocaleString()} nodes)
            </div>
          )}
          {memoryInfo.percentage > 70 && (
            <div className="text-red-300">
              ⚠️ High memory usage ({memoryInfo.percentage.toFixed(1)}%)
            </div>
          )}
          {performanceInfo.devicePixelRatio > 2 && (
            <div className="text-yellow-300">
              ⚠️ High pixel density may impact performance (@
              {performanceInfo.devicePixelRatio}x)
            </div>
          )}
          {performanceInfo.webglVersion === 'None' && (
            <div className="text-red-300">❌ WebGL not available</div>
          )}
          {(navigator.hardwareConcurrency || 4) <= 2 && (
            <div className="text-orange-300">
              ⚠️ Limited CPU cores ({navigator.hardwareConcurrency || 'Unknown'})
            </div>
          )}
          {performanceInfo.batteryLevel !== undefined &&
            performanceInfo.batteryLevel < 20 && (
              <div className="text-red-300">
                🔋 Low battery may affect performance (
                {performanceInfo.batteryLevel.toFixed(0)}%)
              </div>
            )}
          {!navigator.onLine && <div className="text-red-300">📶 Offline mode</div>}
          {performanceInfo.connectionType === 'slow-2g' && (
            <div className="text-red-300">📶 Very slow connection detected</div>
          )}
          {performanceInfo.connectionType === '2g' && (
            <div className="text-orange-300">📶 Slow connection detected</div>
          )}
          {performanceInfo.imageCount > 100 && (
            <div className="text-yellow-300">
              🖼️ High image count may impact memory ({performanceInfo.imageCount})
            </div>
          )}
          {performanceInfo.canvasCount > 5 && (
            <div className="text-yellow-300">
              🎨 Multiple canvas elements detected ({performanceInfo.canvasCount})
            </div>
          )}

          {/* Performance recommendations */}
          <div className="mt-2 text-xs text-gray-400">
            <div className="font-semibold text-blue-300">Recommendations:</div>
            {deviceCapabilities?.reducedQuality && (
              <div>• Use low-quality graphics settings</div>
            )}
            {performanceInfo.fps < 30 && (
              <div>• Reduce animations and visual effects</div>
            )}
            {memoryInfo.percentage > 70 && (
              <div>• Clear browser cache and close other tabs</div>
            )}
            {performanceInfo.domNodes > 10000 && (
              <div>• Optimize DOM structure for better performance</div>
            )}
            {performanceInfo.webglVersion === 'None' && (
              <div>• Enable hardware acceleration in browser</div>
            )}
            {performanceInfo.batteryLevel !== undefined &&
              performanceInfo.batteryLevel < 20 && (
                <div>• Charge device for better performance</div>
              )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Only show if showMemoryInfo is enabled */}
      {showMemoryInfo && (
        <div
          className={`bg-opacity-70 absolute z-50 max-w-sm rounded bg-black p-3 font-mono text-xs text-white select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            touchAction: 'none', // Prevent default touch behaviors
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="drag-handle mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 transition-colors hover:text-white"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
              <span className="font-bold text-cyan-400">System Monitor</span>
            </div>
            <button
              onClick={() => {
                setShowMemoryInfo(false);
                // setVisibleModal(false)
              }}
              className="ml-2 text-red-400 transition-colors hover:text-red-300"
            >
              ✕
            </button>
          </div>

          {isExpanded ? renderDetailedInfo() : renderBasicInfo()}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDebugExpanded(!isDebugExpanded)}
              className="text-gray-400 transition-colors hover:text-white"
            >
              {isDebugExpanded ? '▼' : '▶'}
            </button>
            <div className="text-white-400 font-bold">Debug Controls</div>
          </div>
          {isDebugExpanded && <div>{children}</div>}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSettingExpanded(!isSettingExpanded)}
              className="text-gray-400 transition-colors hover:text-white"
            >
              {isSettingExpanded ? '▼' : '▶'}
            </button>
            <div className="text-white-400 font-bold">Global Setting</div>
          </div>
          {isSettingExpanded && <div>{settingChildren}</div>}

          {/* Memory usage bar */}
          <div className="mt-2">
            <div className="h-2 w-full rounded-full bg-gray-700">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  memoryInfo.status === 'low'
                    ? 'bg-green-500'
                    : memoryInfo.status === 'medium'
                      ? 'bg-yellow-500'
                      : memoryInfo.status === 'high'
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(memoryInfo.percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingModalSystemInfo;
