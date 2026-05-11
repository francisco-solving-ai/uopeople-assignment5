const API_KEY = "API_KEY";
const MODEL = "gemini-1.5-flash";
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * Builds a retrieval-augmented prompt: the model must answer only from the
 * attached passages you retrieved (your RAG layer supplies those chunks).
 *
 * @param {Array<{ name?: string, content: string }>} documentChunks -
 *   Retrieved text segments; use stable `name` (e.g. file name or chunk id) for citations.
 * @returns {string} Full prompt for generateContent.
 */
function buildRagPrompt(documentChunks) {
  const docsBlock = (documentChunks || [])
    .map((doc, i) => {
      const label = doc.name?.trim() || `Document_${i + 1}`;
      return [
        `[${label}]`,
        (doc.content || "").trim(),
        "---",
      ].join("\n");
    })
    .join("\n");

  const hasDocs = docsBlock.trim().length > 0;

  return [
    "You are a careful assistant answering questions using ONLY the information in <attached_documents> below.",
    "",
    "Rules:",
    "- Base every factual claim on the attached documents. If the documents do not contain enough information, say what is missing and answer only with what is supported.",
    "- If the question cannot be answered from the documents, reply clearly that the attached documents do not contain the answer; do not guess or use outside knowledge for factual claims.",
    "- When you use a fact, briefly indicate which document it came from using the label in square brackets (e.g. [filename.pdf] or [Document_1]).",
    "- If documents conflict, mention the conflict and what each source says.",
    "- Keep the answer focused and structured; use short lists when helpful.",
    "",
    "<attached_documents>",
    hasDocs ? docsBlock : "(No documents were attached.)",
    "</attached_documents>",
    "",
    "Answer the user's question using the rules above.",
  ].join("\n");
}

/**
 * Runs RAG-style Q&A: pass retrieved chunks from your indexer/vector DB here.
 *
 * @param {string} userQuestion
 * @param {Array<{ name?: string, content: string }>} documentChunks
 * @returns {Promise<string>}
 */
async function askGeminiWithRag(userQuestion, documentChunks) {
  const base = buildRagPrompt(documentChunks);
  const trimmed = userQuestion == null ? "" : String(userQuestion).trim();
  const prompt =
    trimmed.length > 0 ? `${base}\n\nUser question:\n${trimmed}` : base;
  return askGemini(prompt);
}

/**
 * Sends a prompt to Gemini and returns the generated text.
 *
 * @param {string} prompt - User prompt for the model.
 * @returns {Promise<string>} Generated text response.
 */
async function askGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

if (typeof window !== "undefined") {
  window.askGemini = askGemini;
  window.buildRagPrompt = buildRagPrompt;
  window.askGeminiWithRag = askGeminiWithRag;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { askGemini, buildRagPrompt, askGeminiWithRag };
}

// Example:
// askGemini("Say hello in one sentence.")
//   .then(console.log)
//   .catch(console.error);
//
// RAG example (you fetch `chunks` from your retriever):
// askGeminiWithRag("What is the refund policy?", [
//   { name: "policy.pdf", content: "Refunds within 30 days..." },
// ])
//   .then(console.log)
//   .catch(console.error);
