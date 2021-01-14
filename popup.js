let editor;

onload = () => {
  setInterval(() => {
    if (editor) editor.save();
    if (editor)
      chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        tab = tab[0];

        localStorage[
          `extensions.jsInserter.${new URL(tab.url).host}.code`
        ] = editor.getTextArea().value;
      });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      tab = tab[0];
      chrome.tabs.sendMessage(
        tab.id,
        {
          do: "$",
          query: "disable-extension[extension=jsInserter]",
        },
        (res) => {
          if (res == null) {
            document.getElementById("main").style.display = "block";
            document.getElementById("disabled").style.display = "none";
          } else {
            document.getElementById("main").style.display = "none";
            document.getElementById("disabled").style.display = "flex";
          }
        }
      );
    });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    tab = tab[0];

    chrome.tabs.sendMessage(
      tab.id,
      {
        do: "$",
        query: "disable-extension[extension=jsInserter]",
      },
      (res) => {
        if (res == null) {
          document.getElementById("editor").value =
            localStorage[
              `extensions.jsInserter.${new URL(tab.url).host}.code`
            ] || "";

          setTimeout(() => {
            editor = CodeMirror.fromTextArea(
              document.getElementById("editor"),
              {
                lineNumbers: true,
                mode: "javascript",
                theme: "darcula",
                autofocus: true,
              }
            );
          });
        }
      }
    );
  });
};

document.getElementById("run").addEventListener("click", () => {
  editor.save();
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    tab = tab[0];

    chrome.tabs.sendMessage(tab.id, {
      do: "eval",
      code: editor.getTextArea().value,
    });
  });
});
