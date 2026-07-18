// Simple wrapper around chrome.storage.local to keep keys consistent.
const STORAGE_KEY = 'promptpilot:userConfig';

export async function getUserConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(
        result[STORAGE_KEY] || {
          apiKey: '',
          endpoint: 'https://api.openai.com/v1/chat/completions'
        }
      );
    });
  });
}

export async function saveUserConfig(config) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: config }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(true);
      }
    });
  });
}
