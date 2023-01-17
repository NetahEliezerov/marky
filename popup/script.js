const allSelections = document.getElementById('allSelections');

const exportMarks = () => {
    console.log("asd");
    chrome.storage.sync.get(["selections"], function(result) {
        console.log(result.selections);
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
            console.log("asasd", contents);
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
        console.log(result.selections);
        allSelections.innerHTML = "";
        result.selections.forEach(selection => {
            console.log("asda", selection);
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
            markedContent.style.paddingLeft = '4px';
            markedContent.style.paddingRight = '4px';
            const where = selection.entireContent.indexOf(selection.content);
            const finalStr1 = selection.entireContent.substring(where-30, where+30);
            const asdasda = selection.entireContent.split(' ').find(e => e.includes(finalStr1.split(' ')[0]));
            const finalStr2 = finalStr1.replace(finalStr1.split(' ')[0], asdasda) + "...";
            
            console.log(where, finalStr1, finalStr2, selection, asdasda);
            let doubleClicked = false;
            container.onclick = () => {
                setTimeout(() => {
                    if(doubleClicked) return;
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
                }, 501);
            };
            deleteBtn.addEventListener('click', () => {
                let areusure = prompt(`Are you sure you want to delete "${selection.name}"`);
                if(areusure == null) return;
                const thisItemIdx = result.selections.indexOf(selection);
                console.log(thisItemIdx)
                if(thisItemIdx > -1) {
                    const slicedArray = result.selections.splice(thisItemIdx, 1);
                    console.log(slicedArray)
                    chrome.storage.sync.set({ selections: result.selections }, function() {
                        console.log('successfully deleted!');
                    });
                    doubleClicked = true;
                    getSelections();
                }
            });
    
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
            console.log(selection);
        });
    });
};

getSelections()