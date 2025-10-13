import { Platform } from 'react-native';
let NetworkInfo;
try {
  // Lazy require to avoid crashing if native module isn't available (Expo Go)
  // eslint-disable-next-line global-require
  NetworkInfo = require('react-native-network-info').NetworkInfo;
} catch (e) {
  NetworkInfo = null;
}

export async function getCurrentSsidSafe() {
  try {
    if (NetworkInfo && typeof NetworkInfo.getSSID === 'function') {
      const ssid = await NetworkInfo.getSSID();
      return ssid || 'Unknown SSID';
    }
  } catch (e) {
    // ignore and fall through
  }
  // Fallbacks
  if (Platform.OS === 'android') return 'Unknown SSID';
  return 'Unknown SSID';
}

