const allSelections = document.getElementById('allSelections');

const exportMarks = () => {
    chrome.storage.sync.get(["selections"], function(result) {
        chrome.downloads.download({
            url: `data:appliction/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result.selections))}`,
            filename: "marky.json"
        });
    });
};

const importMarks = (e) => {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        chrome.storage.sync.set({ selections: JSON.parse(contents) }, function() {
            getSelections();
        });
    };
    reader.readAsText(file);
};
document.getElementById('file-input')
    .addEventListener('change', importMarks, false);

document.getElementById('exportBtn').onclick = exportMarks;

const getSelections = () => {
    chrome.storage.sync.get(["selections"], function(result) {
        allSelections.innerHTML = "";
        result.selections.forEach(selection => {

            let container = document.createElement('div');
            let title = document.createElement('h1');
            let subtitle = document.createElement('h3');
            let deleteBtn = document.createElement('h1');
            let urltitle = document.createElement('h4');
            let markedContent = document.createElement('mark');
            title.style.fontWeight = "800"
            subtitle.style.fontWeight = "600"
            urltitle.style.fontWeight = "500"
            markedContent.style.borderRadius = "0.7vw";
            deleteBtn.style.zIndex = '1';
            markedContent.style.paddingLeft = '4px';
            markedContent.style.paddingRight = '4px';
            const where = selection.entireContent.indexOf(selection.content);
            const finalStr1 = selection.entireContent.substring(where-30, where+30);
            const asdasda = selection.entireContent.split(' ').find(e => e.includes(finalStr1.split(' ')[0]));
            const finalStr2 = finalStr1.replace(finalStr1.split(' ')[0], asdasda) + "...";
            
            let doubleClicked = false;
            
            deleteBtn.addEventListener('click', () => {
                let areusure = confirm(`Are you sure you want to delete "${selection.name}"`);
                doubleClicked = true;
                if(areusure === false) return;
                const thisItemIdx = result.selections.indexOf(selection);
                if(thisItemIdx > -1) {
                    const slicedArray = result.selections.splice(thisItemIdx, 1);
                    chrome.storage.sync.set({ selections: result.selections }, function() {
                    });
                    doubleClicked = true;
                    getSelections();
                }
            });

            container.onclick = () => {
                if(doubleClicked === true) {
                    doubleClicked = false;
                    return;
                };
                const urlSearchParams = new URLSearchParams(new URL(selection.url).search);
                const params = Object.fromEntries(urlSearchParams.entries());
                if(String(selection.url)[selection.url.length] != "/") {
                    if(Object.keys(params).length == 0) {
                        window.open((selection.url + `?openWithMarky=true&outer=${finalStr1}&marked=${selection.content}`));
                    } else {
                        window.open((selection.url + `&openWithMarky=true&outer=${finalStr1}&marked=${selection.content}`));
                    };
                } else {
                    if(Object.keys(params).length == 0) {
                        window.open((selection.url + `?openWithMarky=true&outer=${finalStr1}&marked=${selection.content}`));
                    } else {
                        window.open((selection.url + `&openWithMarky=true&outer=${finalStr1}&marked=${selection.content}`));
                    };
                }
                doubleClicked = false;
            };
    
            markedContent.innerHTML = selection.content;
            markedContent.style.background = "#a1a1ff";
            subtitle.innerHTML = finalStr2.replace(selection.content, markedContent.outerHTML);
            subtitle.style.width = "60%";
            urltitle.innerHTML = new URL(selection.url).host;
            urltitle.style.opacity = "0.4";
            container.className = "container";
            title.style.display = 'inline-block';
            deleteBtn.innerHTML = 'x';
            deleteBtn.className = 'deleteBtn';
            title.innerHTML = selection.name;
            container.appendChild(title);
            container.appendChild(deleteBtn);
            container.appendChild(subtitle);
            container.appendChild(urltitle);
    
            allSelections.appendChild(container);
        });
    });
};

getSelections()