window.onload = getURL;
document.getElementById("btnGoToStrateegia").addEventListener("click", goToStrateegia);


const URL_API_SERVER = "https://strateegiaplus.herokuapp.com/";
//const URL_API_SERVER = "http://localhost:3000/";
const URL_STRATEEGIA = "https://app.strateegia.digital/"

const SUBROUTE_TAGCLOUD = "mstagcloud/tagcloud/"
const SUBROUTE_INFLUENTIAL_USERS = "msinfluentialusers/influential_users/"


function getURL() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;


        if (url.startsWith(URL_STRATEEGIA)) {

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
    showAndHide("loader", "divInfoKit");
    fetch(URL_API_SERVER + SUBROUTE_TAGCLOUD + contentId, requestOptions)
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

    fetch(URL_API_SERVER + SUBROUTE_INFLUENTIAL_USERS + contentId, requestOptions)
        .then(response => response.text())
        .then(result => showInfluentialUsers(result))
        .catch(error => console.log('error', error));
}

function showTagCloud(result) {
    document.getElementById("divTagCloud").innerHTML += result;
    showAndHide("divTagCloud", "loader");
    showAndHide("divInfluentialUsers", "loader");
    showAndHide("divInfoKit", "loader");
}

function showInfluentialUsers(result) {
    showKitInformation(result);
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

function showKitInformation(result) {
    const json = JSON.parse(result)["kit"];
    document.getElementById("kit-questions").innerHTML = json["amount_questions"];
    document.getElementById("kit-comments").innerHTML = json["total_comments"];
    document.getElementById("kit-agreements").innerHTML = json["total_agreements"];
    document.getElementById("kit-replys").innerHTML = json["total_replys"];
    document.getElementById("kit-users").innerHTML = json["total_users"];
}