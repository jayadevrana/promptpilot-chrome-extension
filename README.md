# PromptPilot (Chrome Extension Prototype)

Floating expert-prompt copilot for AI websites. Captures the active prompt, sends it to an OpenAI-compatible endpoint, and returns a fully-structured expert prompt (role, goal, context, constraints, tools, output format, missing questions).

## Features
- Manifest V3, React-powered floating widget injected on every page.
- Stores API key and endpoint in `chrome.storage.local`.
- One-click **Improve Prompt** with copy button.
- Structured expert prompt output (markdown) with missing-information questions embedded.
- Minimal styling with Tailwind-like utilities; shadow DOM to avoid page CSS clashes.

## File Layout
```
promptpilot-extension/
  manifest.json
  background.js           # service worker, routes improve requests to LLM
  contentScript.js        # injects floating UI, captures prompt
  llmService.js           # OpenAI-compatible fetch helper
  storage.js              # chrome.storage helpers
  popup.html/js           # toolbar popup UI
  options.html/js         # settings page for API key/endpoint
  styles.css              # shared + widget styles
  icons/                  # placeholder icons
```

## Setup: Load Unpacked (local dev)
1. Open Chrome → `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select this repository's folder (`promptpilot-extension`).
4. Pin **PromptPilot** to the toolbar if desired.
5. Open the extension popup → **Open settings** → add your API key (and endpoint if using a custom provider).

## Getting an API Key
- For OpenAI: visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) and create a secret key.
- You can also use any OpenAI-compatible endpoint; set the URL in Settings.

## How to Test on ChatGPT (or any AI site)
1. Navigate to chat.openai.com (or another AI/chat tool).
2. Click inside the prompt textbox and type a draft prompt.
3. Use the floating **PromptPilot** widget (bottom-left by default) → **Improve Prompt**.
4. Review the score, missing details, suggestions, and the expert-level prompt; click **Copy** to paste it back.

## Build / Production Pack
No bundler is required. To ship:
1. Ensure files are committed/clean.
2. Create a ZIP of the `promptpilot-extension` folder (required by the Chrome Web Store):
   ```bash
   zip -r promptpilot-extension.zip promptpilot-extension
   ```
3. Upload the ZIP to the Chrome Web Store dashboard or distribute manually as an unpacked extension.

## Troubleshooting
- **No prompt detected**: click the target textarea/contenteditable field, then retry.
- **Missing API key**: open Settings and add the key; the widget will surface errors returned by the LLM API.
- **Clipboard blocked**: some sites disallow clipboard access; copy manually from the improved prompt textarea.

## Phase 2 Roadmap (next additions)
- Learning memory & prompt history
- Thinking modes and domain templates
- Analytics and multi-model support
- SaaS backend + user accounts

## Author
Built by [Jayadev Rana](https://jayadevrana.in) — @bluealgocapital · [YouTube](https://www.youtube.com/@jayadevrana3657) · [GitHub](https://github.com/jayadevrana)
