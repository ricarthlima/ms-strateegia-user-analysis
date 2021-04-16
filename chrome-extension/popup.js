document.getElementById("btnGoToStrateegia").addEventListener("click", goToStrateegia);

window.onload = getURL;
chrome.runtime.onMessage.addListener((message, callback) => {
    if (message == "runContentScript") {
        chrome.scripting.executeScript({
            file: 'inject.js'
        });
    }
});


function getURL() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;


        if (url.startsWith("https://app.strateegia.digital/")) {
            document.getElementById("inStrateegia").style.display = "block";
            document.getElementById("notInStrateegia").style.display = "none";

            var txtInfos = document.getElementById("infos");



        } else {
            document.getElementById("inStrateegia").style.display = "none";
            document.getElementById("notInStrateegia").style.display = "block";

        }
    });
}


function goToStrateegia() {
    var strateegiaURL = "https://app.strateegia.digital/";
    chrome.tabs.create({ url: strateegiaURL });
}

