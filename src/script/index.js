function switchMenu({target}, targetClass) {
    let switchNode = document.querySelector('.' + targetClass);
    if (switchNode) {
        const currentDisplay = window.getComputedStyle(switchNode).display;
        switchDisplay(switchNode, currentDisplay);
        switchOpacity(target, currentDisplay);
    }
}

function switchDisplay(node, currentDisplay) {
    hideMenuContent();
    node.style.display = (currentDisplay === 'block' ? 'none' : 'block');
    document.body.style.overflow = (currentDisplay === 'block' ? 'auto' : 'hidden');
}

function hideMenuContent() {
    const menuContent = document.getElementsByClassName('menu-content');
    if (menuContent) {
        const keys = Object.keys(menuContent);
        keys.map(k => menuContent[k].style.display = 'none');
    }
    document.body.style.overflow = 'auto';
}

function switchOpacity(target, currentDisplay) {
    setOpacityDefault();
    while(target.nodeName.toUpperCase() !== 'BUTTON' && target.parentElement)
        target = target.parentElement;
    target.className = 'menu-button ' + (currentDisplay === 'block' ? 'menu-low-opacity' : 'menu-high-opacity');
}

function setOpacityDefault() {
    const menuButton = document.getElementsByClassName('menu-button');
    if (menuButton) {
        const keys = Object.keys(menuButton);
        keys.map(k => menuButton[k].className = 'menu-button menu-low-opacity');
    }
}

function changeBodyTheme({target: node}, themeClass) {
    document.querySelector('body').className = themeClass;
    localStorage.setItem('themeClass', themeClass);

    let nodeId = node.id;
    if (nodeId) {
        localStorage.setItem('themeNodeId', nodeId);
        selectThemeNode(node);
    }
}

function selectThemeNode(node) {
    if (selectThemeNode.currentNode)
        selectThemeNode.currentNode.className = '';
        
    if (node)
        node.className = 'selected';

    selectThemeNode.currentNode = node;
}

function switchPage({target: node}, page) {
    if (!page)
        return;

    if (switchPage.currentNode)
        switchPage.currentNode.className = '';

    if (node)
        node.className = 'selected';

    switchPage.currentNode = node;
    
    const url = (
        page.charAt(0) != '/'
        ? page :
        'https://raw.githubusercontent.com/rafaeltmbr/rafaeltmbr.github.io/master/content' + page
    );

    changePageContent(url);
}

function changePageContent(contentAddress, backButton = false) {
    let xhttp = new XMLHttpRequest();
    let contentArea = document.querySelector('.content-area');

    xhttp.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            contentArea.innerHTML = parseMarkdown(this.responseText);
            if (!backButton)
                window.history.pushState(contentArea.innerHTML, '', window.location.pathname + '#' + contentAddress);
            setExternalLinkToBlank();
            hideMenuContent();
            setOpacityDefault();
        }
    };

    xhttp.open("GET", contentAddress, true);
    xhttp.send();
}

function setExternalLinkToBlank() {
    const links = document.querySelectorAll('.content-area a[href^="http"]');
    if (links && links.length)
        Object.keys(links).map(k => links[k].setAttribute('target', '_blank'));
}

function parseMarkdown(text) {
    let parser = new showdown.Converter();
    return parser.makeHtml(text);
}

function checkHideMenuContentEvent({target}) {
    if (target.tagName.toLowerCase() === 'body') {
        hideMenuContent();
        return;
    }
    
    while (typeof target.className !== 'string' || target.className.indexOf('content-area') < 0) {
        target = target.parentElement;
        if (!target)
            return;
    }

    hideMenuContent();
}

function restoreTheme() {
    let themeClass = localStorage.getItem('themeClass');
    let themeNodeId = localStorage.getItem('themeNodeId');

    let node = (themeNodeId ? document.getElementById(themeNodeId) : null);
    
    if (themeClass && node)
        changeBodyTheme({target: node}, themeClass);
}

function handleHashNavigation(backButton = false) {
    if (window.location.hash)
        changePageContent(window.location.hash.slice(1), backButton);
}

window.addEventListener('load', restoreTheme);
window.addEventListener('load', handleHashNavigation);
window.addEventListener('popstate', () => handleHashNavigation(true));
