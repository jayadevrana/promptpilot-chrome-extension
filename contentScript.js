// Vanilla content script to inject floating widget and call background LLM.

(function () {
  if (window.__promptPilotInjected) return;
  window.__promptPilotInjected = true;

  console.log('PromptPilot content script loaded');

  const STORAGE_KEY = 'promptpilot:userConfig';

  // Capture prompt live from the page (ChatGPT/Claude/Gemini friendly)
  function getPromptFromPage() {
    const composer = document.querySelector('[data-testid=\"composer-input\"]');
    if (composer && composer.innerText && composer.innerText.trim()) return composer.innerText.trim();

    const editable = document.querySelector('div[contenteditable=\"true\"]');
    if (editable && editable.innerText && editable.innerText.trim()) return editable.innerText.trim();

    const textarea = document.querySelector('textarea');
    if (textarea && textarea.value && textarea.value.trim()) return textarea.value.trim();

    return '';
  }

  // Build minimal inline-styled widget for reliability
  function createWidget() {
    const wrapper = document.createElement('div');
    wrapper.id = 'promptpilot-widget';
    Object.assign(wrapper.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '280px',
      background: '#0f172a',
      color: '#e5e7eb',
      borderRadius: '10px',
      padding: '12px',
      zIndex: '2147483646',
      boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '13px',
      border: '1px solid #1f2937'
    });

    wrapper.innerHTML = `
      <div style="font-weight:700; font-size:15px;">PromptPilot</div>
      <div id="pp-status" style="color:#9ca3af; margin-bottom:8px;">Idle</div>
      <button id="pp-improve" style="width:100%; padding:8px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:700;">
        Improve Prompt
      </button>
      <button id="pp-clear" style="width:100%; padding:7px; margin-top:6px; background:#374151; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">
        Clear
      </button>
      <div style="margin-top:10px;">
        <div style="font-size:12px; color:#9ca3af;">Expert prompt</div>
        <textarea id="pp-output" rows="8" style="width:100%; background:#0b1020; color:#e5e7eb; border:1px solid #1f2937; border-radius:8px; padding:8px; resize:vertical;"></textarea>
        <button id="pp-copy" style="margin-top:6px; width:100%; padding:7px; background:#111827; color:white; border:1px solid #1f2937; border-radius:8px; cursor:pointer;">Copy</button>
      </div>
    `;

    document.body.appendChild(wrapper);

    document.getElementById('pp-improve').addEventListener('click', handleImprove);
    document.getElementById('pp-copy').addEventListener('click', handleCopy);
    document.getElementById('pp-clear').addEventListener('click', handleClear);
  }

  function setStatus(text, isError = false) {
    const el = document.getElementById('pp-status');
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#fca5a5' : '#9ca3af';
  }

  function renderResult(result) {
    if (!result) return;
    const output = document.getElementById('pp-output');
    if (output) {
      output.value = result.improved_prompt || '';
    }
  }

  function handleCopy() {
    const output = document.getElementById('pp-output');
    if (!output || !output.value) return;
    navigator.clipboard.writeText(output.value).then(
      () => setStatus('Copied improved prompt'),
      () => setStatus('Copy failed (permissions?)', true)
    );
  }

  function handleImprove() {
    const prompt = getPromptFromPage();
    if (!prompt || !prompt.trim()) {
      setStatus('No prompt detected. Click into your prompt box.', true);
      return;
    }
    setStatus('Improving...');
    chrome.runtime.sendMessage({ type: 'improvePrompt', prompt }, (res) => {
      if (!res || !res.ok) {
        setStatus(res?.error || 'Unexpected error', true);
        return;
      }
      renderResult(res.result);
      setStatus('Done');
    });
  }

  function handleClear() {
    const output = document.getElementById('pp-output');
    if (output) output.value = '';
    setStatus('Cleared. Enter a prompt and click Improve.');
  }

  // Ensure storage key exists; if not, nudge user via status
  chrome.storage.local.get([STORAGE_KEY], (data) => {
    if (!data || !data[STORAGE_KEY] || !data[STORAGE_KEY].apiKey) {
      setStatus('Add API key in options page', true);
    }
  });

  createWidget();
})();
