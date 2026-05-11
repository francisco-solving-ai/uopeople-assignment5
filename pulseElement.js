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
  function createPulse(x, y, duration) {
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
  