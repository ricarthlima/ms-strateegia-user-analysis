window.onload = getURL;

document.getElementById("btnGoToStrateegia").addEventListener("click", goToStrateegia);

function getURL() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;


        if (url.startsWith("https://app.strateegia.digital/")) {

            // Aparecer div do Strateegia
            showAndHide("inStrateegia", "notInStrateegia")

            if (url.includes("content")) {
                showAndHide("inContentKit", "notContentKit")

                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabs[0].id, allFrames: true },
                        function: getTokenFromTabLocalStorage,
                    },
                    (injectionResults) => {
                        for (const frameResult of injectionResults)
                            makeTagCloudRequest(url, frameResult.result);
                    });


            } else {
                showAndHide("notContentKit", "inContentKit")
            }

            var txtInfos = document.getElementById("infos");
        } else {
            showAndHide("notInStrateegia", "inStrateegia")
            /** Não é aqui! */
        }
    });
}


function goToStrateegia() {
    var strateegiaURL = "https://app.strateegia.digital/";
    chrome.tabs.create({ url: strateegiaURL });
}

function getTokenFromTabLocalStorage() {
    return window.localStorage.getItem("logged_user");
}

function showAndHide(toShow, toHide) {
    document.getElementById(toHide).style.display = "none";
    document.getElementById(toShow).style.display = "block";
}

function makeTagCloudRequest(url, token) {
    var contentId = url.substr(url.indexOf("content") + 8, url.length - 1);

    /*var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'text/html',
        },

    };

    fetch("http://localhost:3000/tagcloud/" + contentId, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error)); */
    console.log(token.substr(1, token.length - 2));
    console.log(contentId);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token.substr(1, token.length - 2));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    showAndHide("loader", "divTagCloud");
    fetch("http://localhost:3000/tagcloud/" + contentId, requestOptions)
        .then(response => response.text())
        .then(result => showTagCloud(result))
        .catch(error => console.log('error', error));
}

function showTagCloud(result) {
    document.getElementById("divTagCloud").innerHTML += result
    showAndHide("divTagCloud", "loader");
}

