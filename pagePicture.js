/**
 * Renders the full page with html2canvas and returns a PNG data URL
 * (`data:image/png;base64,...`). Requires the html2canvas CDN script before this file.
 *
 * @param {object} [options] - Optional html2canvas options (merged after full-page defaults).
 * @returns {Promise<string>}
 */
async function capturePageAsBase64() {
  const canvas = await html2canvas(document.documentElement);

  return canvas.toDataURL("image/png");
}

if (typeof window !== "undefined") {
  window.capturePageAsBase64 = capturePageAsBase64;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { capturePageAsBase64 };
}
