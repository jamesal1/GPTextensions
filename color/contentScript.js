// contentScript.js

function handleTextNodes(node) {
    const textNodes = Array.from(node.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
    textNodes.forEach(textNode => {
        const parent = textNode.parentNode;
        const fullTextContent = textNode.textContent;

        const colorRegex = /\[(red|blue|green)\](.*?)\[\/\1\]/g;
        let match = colorRegex.exec(fullTextContent);
        let lastIndex = 0;
        if (match) {
            while (match) {
                const preText = document.createTextNode(fullTextContent.substring(lastIndex, match.index));
                parent.insertBefore(preText, textNode);
                const colorSpan = document.createElement("span");
                colorSpan.style.color = match[1];
                colorSpan.innerText = match[2];
                parent.insertBefore(colorSpan, textNode);
                lastIndex = colorRegex.lastIndex;
                match = colorRegex.exec(fullTextContent);
            }
            const postText = document.createTextNode(fullTextContent.substring(lastIndex));
            parent.insertBefore(postText, textNode);
            parent.removeChild(textNode);
        }
    });
}
const observer = new MutationObserver(mutationsList => {
  for (let mutation of mutationsList) {
    const target = mutation.target;
    console.log("Mutation on target:", target);
  }
});

const options = {
  childList: true,
  subtree: true
};

observer.observe(document.body, options);
