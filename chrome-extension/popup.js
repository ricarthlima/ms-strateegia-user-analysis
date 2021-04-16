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

            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id, allFrames: true },
                    function: getTitle,
                },
                (injectionResults) => {
                    for (const frameResult of injectionResults)
                        txtInfos.innerHTML = frameResult.result;
                });
        } else {
            document.getElementById("inStrateegia").style.display = "none";
            document.getElementById("notInStrateegia").style.display = "block";

        }
    });
}

function getTitle() {
    console.log(window.localStorage.getItem("logged_user"));
    return window.localStorage.getItem("logged_user");
}


function goToStrateegia() {
    var strateegiaURL = "https://app.strateegia.digital/";
    chrome.tabs.create({ url: strateegiaURL });
}

