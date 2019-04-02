document.addEventListener('dblclick', showMeaningDoubleClickHandler);
document.addEventListener('click', closePopupHandler);

var popupDiv;

function showMeaningDoubleClickHandler(event) {
    var info = getSelectionInfo(event);
    console.log("Search for defination: " + info.word);
    if (!info) {
        return;
    }

    sendGoogleSearchRequest(info);
    popupDiv = createPopup(info);
}


function getSelectionInfo(event) {
    var word;
    var boundingRect;

    if (window.getSelection().toString().length > 1) {
        word = window.getSelection().toString();
        boundingRect = getSelectionCoords(window.getSelection());
    } else {
        return null;
    }

    var top = boundingRect.top + window.scrollY;
    var bottom = boundingRect.bottom + window.scrollY;
    var left = boundingRect.left + window.scrollX;

    if (boundingRect.height == 0) {
        top = event.pageY;
        bottom = event.pageY;
        left = event.pageX;
    }

    return {
        top: top,
        bottom: bottom,
        left: left,
        word: word,
        clientY: event.clientY,
        height: boundingRect.height
    };
}

function createPopup(info) {
    var hostDiv = document.createElement("div");
    hostDiv.className = "dictionaryDiv";
    hostDiv.style.left = info.left - 10 + "px";
    hostDiv.style.position = "absolute";
    hostDiv.attachShadow({ mode: 'open' });

    var shadow = hostDiv.shadowRoot;
    // TODO:
    // var style = document.createElement("style");
    // style.textContent = "";
    // shadow.appendChild(style);

    var popupDiv = document.createElement("div");

    popupDiv.style = "border-radius: 4px";
    shadow.appendChild(popupDiv);

    var contentContainer = document.createElement("div");
    contentContainer.className = "mwe-popups-container";
    popupDiv.appendChild(contentContainer);


    var content = document.createElement("div");
    content.className = "mwe-popups-extract";
    content.style = "margin-top: 0px; margin-bottom: 11px; max-height: none";
    contentContainer.appendChild(content);


    var heading = document.createElement("h3");
    heading.style = "-webkit-margin-after: 0px";
    heading.textContent = "Searching";

    var meaning = document.createElement("p");
    meaning.style = "margin-top: 10px";
    meaning.textContent = "Please Wait...";

    var moreInfo = document.createElement("a");
    moreInfo.href = "https://www.google.com/search?q=define+" + info.word;
    moreInfo.style = "float: right; text-decoration: none;"
    moreInfo.target = "_blank";

    content.appendChild(heading);
    content.appendChild(meaning);
    content.appendChild(moreInfo);
    document.body.appendChild(hostDiv);

    if (info.clientY < window.innerHeight / 2) {
        popupDiv.className = "mwe-popups mwe-popups-no-image-tri mwe-popups-is-not-tall";
        hostDiv.style.top = info.bottom + 10 + "px";
        if (info.height == 0) {
            hostDiv.style.top = parseInt(hostDiv.style.top) + 8 + "px";
        }
    } else {
        popupDiv.className = "mwe-popups flipped_y mwe-popups-is-not-tall";
        hostDiv.style.top = info.top - 10 - popupDiv.clientHeight + "px";
        if (info.height == 0) {
            hostDiv.style.top = parseInt(hostDiv.style.top) - 8 + "px";
        }
    }

    return { heading: heading, meaning: meaning, moreInfo: moreInfo };
}

function getSelectionCoords(selection) {
    var oRange = selection.getRangeAt(0); //get the text range
    var oRect = oRange.getBoundingClientRect();
    return oRect;
}

function appendToDiv(createdDiv, content) {
    var hostDiv = createdDiv.heading.getRootNode().host;
    var popupDiv = createdDiv.heading.getRootNode().querySelectorAll("div")[0];

    var heightBefore = popupDiv.clientHeight;

    createdDiv.heading.textContent = content.word;
    createdDiv.meaning.textContent = content.meaning;
    createdDiv.moreInfo.textContent = "More »";

    var heightAfter = popupDiv.clientHeight;
    var difference = heightAfter - heightBefore;

    if (popupDiv.classList.contains("flipped_y")) {
        hostDiv.style.top = parseInt(hostDiv.style.top) - difference + "px";
    }
}

function noMeaningFound(createdDiv) {
    createdDiv.heading.textContent = "Sorry";
    createdDiv.meaning.textContent = "No definition found.";
}

function closePopupHandler(event) {
    var element = event.target;
    if (!element.classList.contains("dictionaryDiv")) {
        document.querySelectorAll(".dictionaryDiv").forEach(function (Node) {
            Node.remove();
        });
    }
}
