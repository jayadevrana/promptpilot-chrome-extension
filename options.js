console.log('PromptPilot options script loaded');

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'promptpilot:userConfig'; // must match storage.js / background usage
  const defaults = {
    apiKey: '',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  };

  const apiKey = document.getElementById('apiKey');
  const endpoint = document.getElementById('endpoint');
  const saveBtn = document.getElementById('saveBtn');

  // Load existing settings
  chrome.storage.local.get([STORAGE_KEY], (data) => {
    const cfg = Object.assign({}, defaults, data[STORAGE_KEY] || {});
    apiKey.value = cfg.apiKey || '';
    endpoint.value = cfg.endpoint || defaults.endpoint;
  });

  saveBtn.addEventListener('click', () => {
    const settings = {
      apiKey: apiKey.value,
      endpoint: endpoint.value || defaults.endpoint
    };

    chrome.storage.local.set({ [STORAGE_KEY]: settings }, () => {
      console.log('Settings saved:', settings);
      alert('✅ Settings Saved!');
    });
  });
});
