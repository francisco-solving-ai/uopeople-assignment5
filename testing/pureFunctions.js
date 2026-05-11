export function buildRagPrompt(documentChunks) {
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


export function traverseDomWithCoordinates(documentNode) {
    if (typeof documentNode === "undefined" || !documentNode.documentElement) {
      return null;
    }
  
    function describeElement(element) {
      const rect = element.getBoundingClientRect();
      const children = [];
  
      for (let i = 0; i < element.children.length; i += 1) {
        children.push(describeElement(element.children[i]));
      }
  
      return {
        tagName: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className || "",
        text: element.textContent ? element.textContent.trim() : "",
        coordinates: {
          x: rect.x,
          y: rect.y,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        children
      };
    }
  
    return describeElement(documentNode.documentElement);
  }



  // Function to create pulse animation at node positions
export function pulseNode(node) {
    // Calculate center position of the node
    const centerX = node.x + node.width / 2;
    const centerY = node.y + node.height / 2;
  
    // Create 3 pulses at each node position with staggered timing
    for (let i = 0; i < 3; i++) {
      setTimeout(
        () => {
          createPulse(centerX, centerY, 3000);
        },
        100 + i * 300,
      ); // Stagger nodes and pulses
    }
  }
  
  // Helper function to create a single pulse
 export function createPulse(x, y, duration) {
    const circle = document.createElement("div");
    circle.classList.add("showme-pulse-circle");
  
    // Set position
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
  
    // Set animation duration
    circle.style.setProperty("--pulse-duration", `${duration}ms`);
  
    document.body.appendChild(circle);
  
    // Remove circle after animation completes
    circle.addEventListener("animationend", () => {
      if (circle.parentNode) {
        circle.parentNode.removeChild(circle);
      }
    });
  }
  

