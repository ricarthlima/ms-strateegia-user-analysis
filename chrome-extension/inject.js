var toogleButton = document.createElement("BUTTON");
toogleButton.textContent = "ShowTagCloud";
toogleButton.onclick = showTagCloudClicked;
document.getElementsByClassName("aside-controls")[0].appendChild(toogleButton);

function showTagCloudClicked() {
    var token = window.localStorage.getItem("logged_user");
    var url = window.location.href;

    if (url.includes("content")) {
        var contentId = url.substr(url.indexOf("content") + 8, url.length - 1);

        console.log(token);
        console.log(url);
        console.log(contentId);

        const myRequest = new Request('http://localhost/api', { method: 'POST', body: '{"foo":"bar"}' });
    }
}

chrome.runtime.onMessage.addListener((message, callback) => {
    if (message == "runContentScript") {
        chrome.scripting.executeScript({
            file: 'inject.js'
        });
    }
});