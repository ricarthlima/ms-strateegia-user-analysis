window.onload = getURL;
document.getElementById("btnGoToStrateegia").addEventListener("click", goToStrateegia);

var SERVER_URL = "https://ms-strateegia-tagcloud.herokuapp.com/";
//var SERVER_URL = "http://localhost:3000/";

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
                            makeRequests(url, frameResult.result);
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

function makeRequests(url, token) {
    makeTagCloudRequest(url, token);
    makeInfluentialUsersRequest(url, token);
}

function makeTagCloudRequest(url, token) {
    var contentId = url.substr(url.indexOf("content") + 8, url.length - 1);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token.substr(1, token.length - 2));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    showAndHide("loader", "divTagCloud");
    showAndHide("loader", "divInfluentialUsers");
    fetch(SERVER_URL + "tagcloud/" + contentId, requestOptions)
        .then(response => response.text())
        .then(result => showTagCloud(result))
        .catch(error => console.log('error', error));
}

function makeInfluentialUsersRequest(url, token) {
    var contentId = url.substr(url.indexOf("content") + 8, url.length - 1);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token.substr(1, token.length - 2));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/influential_users/" + contentId, requestOptions)
        .then(response => response.text())
        .then(result => console.log(showInfluentialUsers(result)))
        .catch(error => console.log('error', error));
}

function showTagCloud(result) {
    document.getElementById("divTagCloud").innerHTML += result;
    showAndHide("divTagCloud", "loader");
    showAndHide("divInfluentialUsers", "loader");
}

function showInfluentialUsers(result) {
    const json = JSON.parse(result);
    var listAuthors = json["authors"]
    listAuthors.sort(function (a, b) {
        if (a["score"] > b["score"]) {
            return -1;
        } else if (b["score"] > a["score"]) {
            return 1;
        } else {
            return;
        }
    })
    for (var i = 0; i < 3; i++) {
        var author = listAuthors[i];
        document.getElementById("top-name-" + i.toString()).innerHTML = author["name"];
        document.getElementById("top-score-" + i.toString()).innerHTML = "Score: " + author["score"].toString();
        document.getElementById("top-agreement-" + i.toString()).innerHTML = author["total_agreements"];
        document.getElementById("top-replys-" + i.toString()).innerHTML = author["total_inner_replys"];
    }

    for (var i = 3; i < listAuthors.length; i++) {
        var author = listAuthors[i];
        var div = document.createElement("DIV");
        div.classList.add("col-2");
        div.classList.add("mb-15");
        div.innerHTML = "<b sytle = 'font-size: 0.77em;'>" + author["name"] + "</b><br>Score: " + author["score"] + "<br>Concordos: " + author["total_agreements"] + "<br>Respostas: " + author["total_inner_replys"];
        document.getElementById("divOthers").appendChild(div);
    }


    /*  document.getElementById("divInfluentialUsers").innerHTML += result; */
}

