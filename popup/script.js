const allSelections = document.getElementById('allSelections');
console.log(chrome.storage.sync);
const getSelections = () => {
    chrome.storage.sync.get(["selections"], function(result) {
        console.log(result.selections);
        allSelections.innerHTML = "";
        result.selections.forEach(selection => {
            console.log("asda", selection);
            let container = document.createElement('div');
            let title = document.createElement('h1');
            let subtitle = document.createElement('h3');
            let urltitle = document.createElement('h4');
            let markedContent = document.createElement('mark');
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
                    if(Object.keys(params).length == 0) {
                        window.open((selection.url + `?openWithMarky=true&outer=${finalStr1}&marked=${selection.content}`));
                    } else {
                        window.open((selection.url + `&openWithMarky=true&outer=${finalStr1}&marked=${selection.content}`));
                    };
                }, 501);
            };
    
            container.addEventListener('dblclick', () => {
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
            urltitle.innerHTML = selection.url.substring(0, 50) + '...';
            urltitle.style.opacity = "0.4";
            container.className = "container";
            title.innerHTML = selection.name;
            container.appendChild(title);
            container.appendChild(subtitle);
            container.appendChild(urltitle);
    
            allSelections.appendChild(container);
            console.log(selection);
        });
    });
};

getSelections()