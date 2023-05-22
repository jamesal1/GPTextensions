// contentScript.js

var colors = [
  "Green",
  "Turquoise",
  "DodgerBlue",
  "MediumPurple",
  "HotPink",
  "Red",
  "MediumVioletRed",
  "MediumSeaGreen",
  "Salmon",
  "Tomato",
  "Coral",
  "Orange",
  "LimeGreen",
  "DeepSkyBlue",
  "LightPink",
  "Orchid",
  "DarkOrange",
  "MediumSpringGreen"
];

function parseStringToInt(inputString) {
  const parsedInt = parseInt(inputString, 10);
  
  if (!isNaN(parsedInt) && parsedInt >= 0 && parsedInt <= 17) {
    return parsedInt;
  } else {
    return -1;
  }
}

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
  
          const colorValue = parseStringToInt(match[1]);
          
  
          if (colorValue>-1) {
            const colorSpan = document.createElement("span");
            colorSpan.style.color = colors[colorValue];
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
    } else if (node.getAttribute("data-role") === "user") {
		console.log("skipped", node);
	}
    else if (node.nodeType === Node.ELEMENT_NODE) {
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
  
