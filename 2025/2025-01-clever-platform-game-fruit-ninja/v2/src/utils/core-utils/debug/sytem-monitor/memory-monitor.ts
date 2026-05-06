export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private isMonitoring = false;
  private memoryThreshold = 50 * 1024 * 1024; // 50MB threshold
  private intervalId?: NodeJS.Timeout;

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  getCurrentMemoryUsage(): number {
    if ('memory' in performance) {
      const perfMemory = (performance as any).memory;
      return perfMemory.usedJSHeapSize || 0;
    }

    // Fallback estimation for browsers without performance.memory
    const estimatedUsage = this.estimateMemoryUsage();
    return estimatedUsage;
  }

  private estimateMemoryUsage(): number {
    // Estimate memory based on DOM complexity and viewport
    const domNodes = document.querySelectorAll('*').length;
    const imageElements = document.querySelectorAll('img');
    const canvasElements = document.querySelectorAll('canvas');

    // Base estimation
    let estimation = 16 * 1024 * 1024; // 16MB base

    // Add DOM node estimation (~1KB per node)
    estimation += domNodes * 1000;

    // Add image estimation (rough)
    imageElements.forEach((img: HTMLImageElement) => {
      if (img.naturalWidth && img.naturalHeight) {
        estimation += img.naturalWidth * img.naturalHeight * 4; // RGBA
      } else {
        estimation += 100 * 1024; // 100KB default per image
      }
    });

    // Add canvas estimation
    canvasElements.forEach((canvas: HTMLCanvasElement) => {
      estimation += canvas.width * canvas.height * 4; // RGBA
    });

    return estimation;
  }

  isMemoryHigh(): boolean {
    const current = this.getCurrentMemoryUsage();
    return current > this.memoryThreshold;
  }

  startMonitoring(callback: (usage: number) => void): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Initial call
    const usage = this.getCurrentMemoryUsage();
    callback(usage);

    // Set up interval monitoring
    this.intervalId = setInterval(() => {
      if (!this.isMonitoring) return;

      const usage = this.getCurrentMemoryUsage();
      callback(usage);

      if (usage > this.memoryThreshold) {
        console.warn(
          'High memory usage detected:',
          (usage / 1024 / 1024).toFixed(1),
          'MB',
        );
      }
    }, 5000); // Update every 2 seconds for better responsiveness
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
