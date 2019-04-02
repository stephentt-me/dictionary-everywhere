function sendGoogleSearchRequest(info) {
    console.log("Request google search for define:" + info.word);
    var url = "https://www.google.com/search?q=define+" + info.word;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.responseType = 'document';
    xmlHTTP.onload = googleResultParserCallback();
    xmlHTTP.open("GET", url, true); // true for asynchronous request
    xmlHTTP.send();
}

function googleResultParserCallback() {
    const callback = function () {
        var document = this.responseXML;
        if (!document.querySelectorAll("[data-dobid='hdw']")[0]) {
            return noMeaningFound(popupDiv);
        }
        var word = document.querySelectorAll("[data-dobid='hdw']")[0].textContent;
        var meaning = "";

        document.querySelector(".PNlCoe [data-dobid='dfn']").querySelectorAll("span").forEach(function (span) {
            if (!span.querySelector("sup"))
                meaning = meaning + span.textContent;
        })
        meaning = meaning[0].toUpperCase() + meaning.substring(1);
        appendToDiv(popupDiv, { word: word, meaning: meaning });
    };
    return callback
}
