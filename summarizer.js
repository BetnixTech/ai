import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.1/dist/transformers.min.js";

let summarizer = null;

// Initialize summarizer pipeline. Model will be downloaded on first run and cached by the browser.
export async function initSummarizer() {
  if (summarizer) return;
  // Using a compact summarization model. Change model name if you host a different one.
  summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
}

export async function summarizeText(text) {
  if (!text || text.length < 40) return '';
  try {
    await initSummarizer();
    // Chunk if text is too long for the model; this is a simple split by sentences fallback.
    const maxChunk = 1000; // characters
    if (text.length <= maxChunk) {
      const out = await summarizer(text, { max_length: 120, min_length: 20 });
      return out[0].summary_text || '';
    } else {
      // naive chunking
      const parts = [];
      for (let i=0; i<text.length; i+=maxChunk) {
        parts.push(text.slice(i, i+maxChunk));
      }
      const summaries = [];
      for (const p of parts) {
        const out = await summarizer(p, { max_length: 90, min_length: 15 });
        summaries.push(out[0].summary_text || '');
      }
      return summaries.join('\n');
    }
  } catch (err) {
    console.error("Summarizer error", err);
    return '';
  }
}
