import { callLLM } from './llmService.js';
import { getUserConfig } from './storage.js';

chrome.runtime.onInstalled.addListener(() => {
  // Keep future room for declarative content; no-op for now.
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'improvePrompt') {
    handleImprove(message)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    // Indicate async response
    return true;
  }
  return undefined;
});

async function handleImprove(message) {
  const { prompt } = message;
  const config = await getUserConfig();
  const result = await callLLM({
    apiKey: config.apiKey,
    endpoint: config.endpoint,
    prompt
  });
  return result;
}
