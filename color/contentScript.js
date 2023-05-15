// contentScript.js

function handleTextNodes(node) {
    const textNodes = Array.from(node.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
    textNodes.forEach(textNode => {
        const parent = textNode.parentNode;
        const textContent = textNode.textContent;
        const colorRegex = /\[(red|blue|green)\](.*?)\[\/\1\]/g;

        let match = colorRegex.exec(textContent);
        let lastIndex = 0;
        if (match) { // Disconnect observer only if we need to make changes
            observer.disconnect();
            while (match) {
                parent.insertBefore(document.createTextNode(textContent.substring(lastIndex, match.index)), textNode);
                const colorSpan = document.createElement("span");
                console.log(match[2])
                colorSpan.style.color = match[1];
                colorSpan.innerText = match[2];
                parent.insertBefore(colorSpan, textNode);
                lastIndex = colorRegex.lastIndex;
                match = colorRegex.exec(textContent);
            }
            parent.insertBefore(document.createTextNode(textContent.substring(lastIndex)), textNode);
            parent.removeChild(textNode);
            observer.observe(document.body, { childList: true, subtree: true }); // Reconnect observer
        }
    });
}

const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
        if (mutation.addedNodes.length) {
            const addedNode = mutation.addedNodes[0];
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
                handleTextNodes(addedNode);
            }
        }
    }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });
