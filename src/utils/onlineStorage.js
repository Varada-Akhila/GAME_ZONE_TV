// Online Storage Synchronizer for GameZone TV
// Monkey-patches window.localStorage to automatically sync scores/progress with games.vrplay.in

const API_BASE = "https://games.vrplay.in/api";
const DEVICE_ID_KEY = "tv_device_id";

// Store the original localStorage methods
const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
const originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

// Generate a unique device ID
function getOrCreateDeviceId() {
  let deviceId = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = "tv_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    originalSetItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// Check if a key should be synced online
function shouldSync(key) {
  if (!key) return false;
  if (key === DEVICE_ID_KEY) return false;
  // Ignore dev tools or bundle-related keys
  if (key.startsWith("__") || key.startsWith("vite") || key.includes("loglevel")) return false;
  return true;
}

// Push local storage updates to the PHP server
async function pushToServer(key, value) {
  const deviceId = getOrCreateDeviceId();
  try {
    const response = await fetch(`${API_BASE}/save_score.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deviceId,
        key,
        value
      })
    });
    if (!response.ok) {
      console.warn(`[OnlineStorage] Failed to push key "${key}" to server. Status: ${response.status}`);
    }
  } catch (err) {
    console.error(`[OnlineStorage] Error pushing key "${key}" to server:`, err);
  }
}

// Remove key on server
async function deleteFromServer(key) {
  const deviceId = getOrCreateDeviceId();
  try {
    const response = await fetch(`${API_BASE}/save_score.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deviceId,
        key,
        value: null // null indicates deletion
      })
    });
    if (!response.ok) {
      console.warn(`[OnlineStorage] Failed to delete key "${key}" from server. Status: ${response.status}`);
    }
  } catch (err) {
    console.error(`[OnlineStorage] Error deleting key "${key}" from server:`, err);
  }
}

// Monkey-patch localStorage to intercept writes and deletes
function applyMonkeyPatch() {
  window.localStorage.setItem = function (key, value) {
    // Write locally first
    originalSetItem(key, value);

    // Sync online asynchronously
    if (shouldSync(key)) {
      pushToServer(key, value);
    }
  };

  window.localStorage.removeItem = function (key) {
    // Remove locally first
    originalRemoveItem(key);

    // Sync online asynchronously
    if (shouldSync(key)) {
      deleteFromServer(key);
    }
  };
}

// Initialize online storage: sync existing values from the server to localStorage
export async function initOnlineStorage() {
  const deviceId = getOrCreateDeviceId();

  try {
    console.log(`[OnlineStorage] Fetching online scores for device: ${deviceId}`);
    // Set a timeout for the fetch to avoid hanging the app startup if server is down
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_BASE}/get_scores.php?deviceId=${encodeURIComponent(deviceId)}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response content-type (not application/json)");
      }
      const data = await response.json();
      if (data && typeof data === "object") {
        console.log("[OnlineStorage] Synchronized data from server:", Object.keys(data));
        // Seed the local storage with remote data
        Object.entries(data).forEach(([key, value]) => {
          if (shouldSync(key) && value !== null && value !== undefined) {
            // Write stringified or raw values locally
            const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
            originalSetItem(key, stringValue);
          }
        });
      }
    } else {
      console.warn("[OnlineStorage] Failed to retrieve scores from server. Using local cache.");
    }
  } catch (err) {
    console.error("[OnlineStorage] Connection to online storage server failed, using local offline mode:", err.message);
  }

  // Apply monkey patching so future updates are synced online
  applyMonkeyPatch();
}
