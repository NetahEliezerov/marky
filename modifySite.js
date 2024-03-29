let lastFocused;

const styles = `
    @keyframes fade {
        from {opacity: 0;}
        to {opacity: 1;}
    }
`;
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.querySelector('body').appendChild(styleElement);
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if(params.openWithMarky) {
    const text = params.outer;

    const matches = [];

    for (const div of document.querySelectorAll('p')) {
        if (div.textContent.includes(text)) {
            matches.push(div);
        }
    }
    if(matches.length == 0) {
        for (const div of document.querySelectorAll('span')) {
            if (div.textContent.includes(text)) {
                matches.push(div);
            }
        }
    }
    if(matches.length == 0) {
        for (const div of document.querySelectorAll('h1')) {
            if (div.textContent.includes(text)) {
                matches.push(div);
            }
        }
    }
    if(matches.length == 0) {
        for (const div of document.querySelectorAll('div')) {
            if (div.textContent.includes(text)) {
                matches.push(div);
            }
        }
    };
    if(matches.length == 0) {
        for (const div of document.querySelectorAll('h2')) {
            if (div.textContent.includes(text)) {
                matches.push(div);
            }
        }
    };
    console.log(matches, "hre");
    if(matches.length !== 0) {
        // matches[0].style.background = "#a1a1ff";
        // matches[0].style.color = "white";
        const coords = matches[0].getBoundingClientRect();
        window.scrollTo(0, coords.y - 150);
        matches[0].innerHTML = (matches[0].innerHTML.replace(params.marked, `<mark style="
            border-radius: 0.5vw;
            padding-left: 4px;
            padding-right: 4px;
            background: #a1a1ff;";
        >${params.marked}</mark>`));
    }
}

document.addEventListener('keydown', function(e){
    if (e.key.toLowerCase() === 's' && e.shiftKey) {
        var selection;

        if (window.getSelection) {
            selection = window.getSelection();
        } else if (document.selection) {
            selection = document.selection.createRange();
        }
        let name = prompt('Enter the name of this mark', selection.toString());
        if(name == null) {
            return;
        }
        const selectionData = {
            content: selection.toString(),
            url: selection.anchorNode.baseURI,
            entireContent: selection.anchorNode.textContent,
            name,
            outerHtml: selection.toString(),
        };
        chrome.storage.sync.get(["selections"], function(result) {
            var array = result.selections?result.selections:[];

            array.push(selectionData);
            chrome.storage.sync.set({ selections: array }, function() {
            });
        });
    }
});