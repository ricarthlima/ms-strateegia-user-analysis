window.onload = getURL;
chrome.runtime.onMessage.addListener((message, callback) => {
    if (message == "runContentScript") {
        chrome.scripting.executeScript({
            file: 'inject.js'
        });
    }
});

document.getElementById("btnGoToStrateegia").addEventListener("click", goToStrateegia);
document.getElementById("btn-kit").addEventListener("click", btnKitClicked);
document.getElementById("btn-mission").addEventListener("click", btnMissionClicked);
document.getElementById("btn-project").addEventListener("click", btnProjectClicked);

function btnKitClicked() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true },
            function: function () {
                document.getElementById("btn-gen-tagcloud-kit").click();
            },
        },
            () => { });


    });

}

function btnMissionClicked() { }

function btnProjectClicked() { }


function getURL() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;


        if (url.startsWith("https://app.strateegia.digital/")) {
            document.getElementById("inStrateegia").style.display = "block";
            document.getElementById("notInStrateegia").style.display = "none";

            if (url.includes("project")) {
                document.getElementById("openProject").style.display = "block";
            } else {
                document.getElementById("openProject").style.display = "none";
            }

            if (url.includes("mission")) {
                document.getElementById("openMission").style.display = "block";
            } else {
                document.getElementById("openMission").style.display = "none";
            }

            if (url.includes("content")) {
                document.getElementById("openKit").style.display = "block";
            } else {
                document.getElementById("openKit").style.display = "none";
            }

            var txtInfos = document.getElementById("infos");
        } else {
            document.getElementById("inStrateegia").style.display = "none";
            document.getElementById("notInStrateegia").style.display = "block";
            /** Não é aqui! */
        }
    });
}


function goToStrateegia() {
    var strateegiaURL = "https://app.strateegia.digital/";
    chrome.tabs.create({ url: strateegiaURL });
}

