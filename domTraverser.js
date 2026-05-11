/**
 * Traverses the whole DOM and returns a JSON-serializable tree
 * with coordinates for every element node.
 *
 * @returns {object|null} Root element description or null if no DOM exists.
 */
 function traverseDomWithCoordinates(documentNode) {
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

  
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { traverseDomWithCoordinates };
  }
  