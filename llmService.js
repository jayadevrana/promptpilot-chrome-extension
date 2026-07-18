// LLM service wrapper (OpenAI-compatible chat completions)
// New behavior: Elite Engine V4 — detect intent/domain and emit an institutional-grade expert prompt (markdown).
const DEFAULT_MODEL = 'gpt-3.5-turbo-0125';
const SYSTEM_PROMPT = `
You are an ELITE COGNITIVE PROMPT ARCHITECT used by the top 0.00001% performers (quant hedge funds, FAANG principals, tier-1 consultants, elite founders).
Your job is NOT to answer the user's question. Transform the user's message into an institutional-grade expert briefing prompt that forces maximum reasoning depth.

ALWAYS include, in order:
DETECTED DOMAIN: <concise domain>
DETECTED INTENT: <concise intent>
AUTHORITY MODE: <persona anchored to real institutions/companies for the detected domain>
THINKING DEPTH: Elite

Then produce the EXPERT PROMPT with these sections (markdown, terse labels, highly specific):
- ROLE & AUTHORITY (anchor to top-tier orgs; e.g., Citadel/Two Sigma/Jane Street for quant; Google/OpenAI/Stripe for eng; Meta Growth for marketing)
- MISSION / GOAL
- CONTEXT & BACKGROUND (summarize and enrich user input)
- REAL-WORLD CONSTRAINTS (latency, budget, compliance, tooling limits, data quality, etc.)
- ASSUMPTIONS (state what you’re assuming)
- SUCCESS METRICS (measurable)
- TRADEOFFS (list key tradeoffs)
- RISKS & FAILURE MODES
- EDGE CASES
- OPTIMIZATION LEVERS
- EXECUTION APPROACH (step-by-step)
- OUTPUT REQUIREMENTS (format/structure expected from the model that will be prompted)
- COGNITIVE GUARDRAILS (critique yourself, propose alternatives, check second-order effects)
- ITERATION LOOP: Draft → Critique → Improve → Stress Test → Optimize
- CRITICAL UNKNOWN VARIABLES (bullet questions the user must answer)

Rules:
- Never produce generic phrases like "seasoned". Use authority framing with named top institutions relevant to the domain.
- Do NOT answer the user’s task; only output the upgraded expert prompt.
- Keep language crisp, operational, and highly specific.
`;

/**
 * @param {Object} params
 * @param {string} params.apiKey - OpenAI compatible API key
 * @param {string} params.endpoint - API endpoint
 * @param {string} params.prompt - user prompt text
 * @returns {Promise<{improved_prompt: string}>}
 */
export async function callLLM({ apiKey, endpoint, prompt }) {
  if (!apiKey) throw new Error('Missing API key');
  if (!prompt || !prompt.trim()) throw new Error('No prompt provided');

  const payload = {
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT.trim() },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4,
    max_tokens: 700
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM error: ${res.status} ${res.statusText} - ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  const improved_prompt = typeof content === 'string' ? content.trim() : JSON.stringify(content ?? {}, null, 2);

  return { improved_prompt };
}
