async function runOCR(file) {
  try {
    const result = await Tesseract.recognize(file, 'eng');
    return result.data.text || '';
  } catch (err) {
    console.error("OCR error", err);
    return '';
  }
}
