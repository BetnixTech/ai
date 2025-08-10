import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.1/dist/transformers.min.js";

let asr = null;

// Initialize ASR pipeline (Whisper-like). Model will be downloaded on first run and cached by the browser.
export async function initASR() {
  if (asr) return;
  // Use a compact ASR model; change model ID to a model you prefer/host.
  asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
}

// audioFile can be a File or Blob
export async function transcribeAudioFile(audioFile) {
  try {
    await initASR();
    // The pipeline expects audio input; pass the File/Blob directly.
    const out = await asr(audioFile);
    // Depending on the model output format, adapt as needed.
    if (typeof out === 'string') return out;
    if (out && out.text) return out.text;
    if (Array.isArray(out) && out.length > 0) return out[0].text || '';
    return '';
  } catch (err) {
    console.error("ASR error", err);
    return '';
  }
}
