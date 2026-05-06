import { useEffect, useState } from 'react';
import { useOnlineStatus } from './online-status';

enum WifiType {
  offline = 'offline',
  'slow-2g' = 'slow-2g',
  '2g' = '2g',
  '3g' = '3g',
  '4g' = '4g',
}

interface UseWifiTypeOptions {
  unit?: 'kbps' | 'mbps';
  recheckInterval?: number;
}

/**
 * Measures WiFi speed and returns the network type and speed.
 *
 * @param options.unit - Unit of network speed, either "kbps" or "mbps".
 * @param options.recheckInterval - Interval (in milliseconds) to recheck WiFi speed.
 *
 * @returns networkType - Type of WiFi connection ("offline", "slow-2g", "2g", "3g", "4g").
 * @returns networkSpeed - Speed of WiFi (in specified unit), or -1 if offline.
 */
export function useWifiType(
  options: UseWifiTypeOptions = {
    unit: 'mbps',
    recheckInterval: 30 * 1000, // 30 seconds
  },
) {
  const online = useOnlineStatus();
  const [networkType, setNetworkType] = useState<WifiType | string>();
  const [networkSpeed, setNetworkSpeed] = useState<number>();

  useEffect(() => {
    const interval = setInterval(measureWifiSpeed, options?.recheckInterval ?? 30 * 1000); // measure every 30 seconds
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // if online, measure wifi speed
    if (online) measureWifiSpeed();
  }, [online]);

  function measureWifiSpeed() {
    const imageUrl =
      'https://upload.wikimedia.org/wikipedia/commons/a/a6/Brandenburger_Tor_abends.jpg'; // this is just an example, you rather want an image hosted on your server
    const downloadSize = 2707459; // Must match the file above (from your server ideally)

    if (online) {
      // measure wifi speed
      let startTime, endTime;
      const download = new Image();
      startTime = new Date().getTime();

      var timestamp = '?t=' + startTime;
      download.src = imageUrl + timestamp;

      download.onload = function (d) {
        endTime = new Date().getTime();

        const duration = (endTime - startTime) / 1000;

        const bitsLoaded = downloadSize * 8;
        const speedBps = bitsLoaded / duration;
        const speedKbps = speedBps / 1024;
        const speedMbps = speedKbps / 1024;

        setNetworkType(determineWifiType(speedKbps));
        setNetworkSpeed(speedMbps);
      };

      download.onerror = function (err, msg) {
        console.error(err);
        setNetworkType(WifiType['offline']);
        setNetworkSpeed(-1);
      };
    }

    function determineWifiType(speedKbps: number) {
      // use this reference
      // https://wicg.github.io/netinfo/#effective-connection-types
      if (speedKbps < 50) return WifiType['slow-2g'];
      else if (speedKbps < 70) return WifiType['2g'];
      else if (speedKbps < 700) return WifiType['3g'];
      return WifiType['4g'];
    }
  }

  return { networkType, networkSpeed };
}
