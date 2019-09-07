function switchMenu({target}, targetClass) {
    let switchNode = document.querySelector('.' + targetClass);

    if (targetClass === 'home') {
        loadHomePage();
    } else if (switchNode) {
        const currentDisplay = window.getComputedStyle(switchNode).display;
        switchDisplay(switchNode, currentDisplay);
        switchBrightness(target, currentDisplay);
    }
}

function loadHomePage() {
    if (document.body.getAttribute('data-state') !== 'home') {
        document.body.setAttribute('data-state', 'home');
        document.querySelector('.content-area').innerHTML = loadHomePage.innerHTML || '';
    }
    window.location.hash = '';
    hideMenuContent();
}

function hideHomePage() {
    if (document.body.getAttribute('data-state') === 'home') {
        loadHomePage.innerHTML = document.querySelector('.content-area').innerHTML;
        document.body.setAttribute('data-state', '');
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

function switchBrightness(target, currentDisplay) {
    setButtonLowBrightness();
    while(target.nodeName.toUpperCase() !== 'BUTTON' && target.parentElement)
        target = target.parentElement;
    target.className = 'menu-button';
    target.className += (currentDisplay === 'block' ? ' menu-low-brightness' : ' menu-high-brightness');
}

function setButtonLowBrightness() {
    const menuButton = document.getElementsByClassName('menu-button');
    if (menuButton) {
        const keys = Object.keys(menuButton);
        keys.map(k => menuButton[k].className = 'menu-button menu-low-brightness');
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

    if (url !== window.location.hash.slice(1))
        changePageContent(url);
}

function changePageContent(contentAddress, backButton = false) {
    let xhttp = new XMLHttpRequest();
    let contentArea = document.querySelector('.content-area');

    xhttp.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            hideHomePage();
            contentArea.innerHTML = parseMarkdown(this.responseText);
            const newURL = formatNewURL(contentAddress);
            if (!backButton) {
                if (window.location.href.indexOf('#') === window.location.href.length - 1
                || window.location.href === newURL)
                    window.history.replaceState(contentArea.innerHTML, '', newURL);
                else 
                    window.history.pushState(contentArea.innerHTML, '', newURL);
            }
            setExternalLinkToBlank();
            hideMenuContent();
            setButtonLowBrightness();
        }
    };

    xhttp.open("GET", contentAddress, true);
    xhttp.send();
}

function formatNewURL(contentAddress) {
    let newURL = window.location.href;
    const hashIndex = newURL.indexOf('#');
    if (hashIndex >= 0)
        newURL = newURL.slice(0, hashIndex);
    newURL += '#' + contentAddress;

    return newURL;
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
    if (target.tagName.toLowerCase() === 'body'
    || (typeof target.className === 'string' && target.className.toLowerCase() === 'menu-icons')) {
        hideMenuContent();
        setButtonLowBrightness();
        return;
    }
    
    while (typeof target.className !== 'string' || target.className.indexOf('content-area') < 0) {
        target = target.parentElement;
        if (!target)
            return;
    }

    hideMenuContent();
    setButtonLowBrightness();
}

function restoreTheme() {
    let themeClass = localStorage.getItem('themeClass');
    let themeNodeId = localStorage.getItem('themeNodeId');

    let node = (themeNodeId ? document.getElementById(themeNodeId) : null);
    
    if (themeClass && node)
        changeBodyTheme({target: node}, themeClass);
}

function handleHashNavigation(event, backButton = false) {
    if (window.location.hash)
        changePageContent(window.location.hash.slice(1), backButton);
    else if(backButton)
        loadHomePage();
}

window.addEventListener('load', restoreTheme);
window.addEventListener('load', handleHashNavigation);
window.addEventListener('popstate', () => handleHashNavigation(null, true));
