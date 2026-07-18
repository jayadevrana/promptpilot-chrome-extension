import { getUserConfig } from './storage.js';

const statusEl = document.getElementById('status');
const settingsBtn = document.getElementById('settingsBtn');
const apiBtn = document.getElementById('apiBtn');

async function init() {
  try {
    const config = await getUserConfig();
    if (!config) {
      statusEl.innerText = 'No config found';
      return;
    }
    statusEl.innerText = config.apiKey ? '✅ Ready' : '⚠️ Add API Key';
  } catch (err) {
    statusEl.innerText = 'Error loading config';
    // Surface minimal console info for debugging; popup has limited space.
    console.error('PromptPilot popup init error', err);
  }
}

settingsBtn.onclick = () => chrome.runtime.openOptionsPage();
apiBtn.onclick = () => chrome.tabs.create({ url: 'https://platform.openai.com/api-keys' });

init();
