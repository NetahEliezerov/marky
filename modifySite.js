let lastFocused;
console.log(chrome)

const styles = `
    @keyframes fade {
        from {opacity: 0;}
        to {opacity: 1;}
    }
`;
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.querySelector('body').appendChild(styleElement);

document.addEventListener('mouseup', function(e){
    var selection;
    let container = document.createElement('button');

    container.style.background = '#005bff';
    container.style.animationName = "fade";
    container.style.animationDuration = "300ms";
    container.style.color = "white";
    container.style.width = '10vw';
    container.style.height = '7vh';
    container.style.zIndex = "1";
    container.style.borderRadius = '2vw';
    container.id = "markerExtensionThing";
    container.style.padding = '0.75vw';
    container.style.textAlign = "center";
    container.style.border = "none";
    container.style.cursor = 'pointer';
    container.innerHTML = "Save";

    container.addEventListener('click', () => {
        let name = prompt('Enter the name of this mark');
        console.log(name);
        if(name == null) {
            return;
        };
        const selection = window.getSelection();
        const selectionData = {
            content: selection.toString(),
            url: selection.anchorNode.baseURI,
            entireContent: selection.anchorNode.textContent,
            name
        };
        console.log(selectionData);
        chrome.storage.sync.get(["selections"], function(result) {
            var array = result.selections?result.selections:[];

            array.push(selectionData);
            chrome.storage.sync.set({ selections: array }, function() {
                console.log("Saved a new array item");
                lastFocused.removeChild(document.getElementById('markerExtensionThing'));
                lastFocused.removeChild(document.getElementById('markerExtensionThing'));
            });
        });
    });

    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.selection) {
        selection = document.selection.createRange();
    }
    
    if(selection.toString() !== '') {
        if(lastFocused != selection.focusNode.parentNode && lastFocused) {
            lastFocused.removeChild(document.getElementById('markerExtensionThing'));
            lastFocused = null;
        }

        selection.focusNode.parentNode.appendChild(container);
        lastFocused = selection.focusNode.parentNode;
    } else {
        if(document.getElementById('markerExtensionThing') != null) {
            console.log("here", document.getElementById('markerExtensionThing'));
            lastFocused.removeChild(document.getElementById('markerExtensionThing'));
            lastFocused = null;
        };
    }
});