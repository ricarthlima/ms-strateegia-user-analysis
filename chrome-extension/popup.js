document.getElementById("btnGoToStrateegia").addEventListener("click", goToStrateegia);

window.onload = getURL;



function getURL() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;


        if (url.startsWith("https://app.strateegia.digital/")) {
            document.getElementById("inStrateegia").style.display = "block";
            document.getElementById("notInStrateegia").style.display = "none";

            var txtInfos = document.getElementById("infos");

            /* chrome.storage.sync.set({ 'foo': 'hello', 'bar': 'hi' }, function () {
                console.log('Settings saved');
            });

            chrome.storage.sync.get(['foo', 'bar'], function (items) {
                txtInfos.innerHTML = items;
                console.log(items.bar);
            }); */

            if (url.includes("content")) {
                document.getElementById("txtInStrateegia").innerHTML += "\n E estamos com um Kit aberto!";
                var contentId = url.substr(url.indexOf("content") + 8, url.length - 1);
                txtInfos.innerHTML += ("\n" + contentId + "\n");
            }
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id, allFrames: true },
                    function: getTitle,
                },
                (injectionResults) => {
                    for (const frameResult of injectionResults)
                        txtInfos.innerHTML += frameResult.result;
                });
        } else {
            document.getElementById("inStrateegia").style.display = "none";
            document.getElementById("notInStrateegia").style.display = "block";

        }
    });
}

function getTitle() {
    return window.localStorage.getItem("logged_user");
}


function goToStrateegia() {
    var strateegiaURL = "https://app.strateegia.digital/";
    chrome.tabs.create({ url: strateegiaURL });
}

