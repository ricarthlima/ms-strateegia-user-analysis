var toogleButton = document.createElement("BUTTON");
toogleButton.style.display = "none"
toogleButton.onclick = tagCloudKit;
toogleButton.id = "btn-gen-tagcloud-kit"
document.body.appendChild(toogleButton);

var toogleButton = document.createElement("BUTTON");
toogleButton.style.display = "none"
toogleButton.onclick = tagCloudMission;
toogleButton.id = "btn-gen-tagcloud-mission"
document.body.appendChild(toogleButton);

var toogleButton = document.createElement("BUTTON");
toogleButton.style.display = "none"
toogleButton.onclick = tagCloudProject;
toogleButton.id = "btn-gen-tagcloud-project"
document.body.appendChild(toogleButton);

function tagCloudKit() {
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

function tagCloudMission() {

}

function tagCloudProject() {

}
