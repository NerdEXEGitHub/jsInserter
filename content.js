console.log("%cjsRunner loaded", "color: orange; font-weight: bold;");

const $ = (sel) => document.querySelector(sel);

function insertHTML(html, parent) {
  const element = document.createElement("jsinserter-element");

  element.innerHTML = html;

  parent.appendChild(element);

  return element;
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
  switch (req.do) {
    case "eval":
      eval(req.code);
      break;
    case "$":
      res(document.querySelector(req.query));
      break;
  }
});
