import { appConfig } from '../config.js';

/**
 * Future AI trip fill-in entrypoint.
 *
 * This must call a server-owned endpoint, preferably a Supabase Edge Function.
 * Do not put OpenRouter, OpenAI, or any other AI provider API key in this client bundle.
 * The browser may only send the user's draft trip fields to `VITE_AI_ENDPOINT_URL` and
 * receive completed structured trip data back from the server.
 */
export async function requestAiTripDraft(payload) {
  if (!appConfig.aiEndpointUrl) {
    throw new Error('AI trip generation is not configured. Set VITE_AI_ENDPOINT_URL to a server endpoint.');
  }

  const response = await fetch(appConfig.aiEndpointUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI trip generation failed: ${response.status}`);
  }

  return response.json();
}
