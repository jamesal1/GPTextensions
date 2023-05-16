// contentScript.js

function handleTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      const fullTextContent = node.textContent;
  
      const colorRegex = /\[(\w+)](.*?)\[\/\1]/g;
      let match = colorRegex.exec(fullTextContent);
      let lastIndex = 0;
      if (match) {
        while (match) {
          const preText = document.createTextNode(fullTextContent.substring(lastIndex, match.index));
          parent.insertBefore(preText, node);
  
          const colorValue = match[1];
          const isValidColor = CSS.supports('color', colorValue);
  
          if (isValidColor) {
            const colorSpan = document.createElement("span");
            colorSpan.style.color = colorValue;
            colorSpan.innerText = match[2];
            parent.insertBefore(colorSpan, node);
          }
  
          lastIndex = colorRegex.lastIndex;
          match = colorRegex.exec(fullTextContent);
        }
        const postText = document.createTextNode(fullTextContent.substring(lastIndex));
        parent.insertBefore(postText, node);
        parent.removeChild(node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(childNode => {
        handleTextNodes(childNode); // Recursively process child nodes
      });
    }
  }
  
  

const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.target.nodeType === Node.ELEMENT_NODE && mutation.target.tagName === "BUTTON") {
        let currentElement = mutation.target;
        handleTextNodes(document.body);
      }
    }
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  