function switchMenu({target}, targetClass) {
    let switchNode = document.querySelector('.' + targetClass);

    if (targetClass === 'home') {
        loadHomePage();
        switchBrightness(target, '');
    } else if (switchNode) {
        const currentDisplay = window.getComputedStyle(switchNode).display;
        switchDisplay(switchNode, currentDisplay);
        switchBrightness(target, currentDisplay);
    }
}

function loadHomePage(backToHome = false) {
    if (document.body.getAttribute('data-state') !== 'home') {
        document.body.setAttribute('data-state', 'home');
        document.querySelector('.content-area').innerHTML = loadHomePage.innerHTML || '';
    }
    if (!backToHome)
        window.history.pushState('', 'home', formatNewURL(''));
    hideMenuContent();
    document.getElementById('home-button').className = 'menu-button menu-high-brightness';
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
    document.querySelector('.background-mask').setAttribute('data-display',
        (currentDisplay === 'block' ? 'hide' : 'show')) ;
}

function hideMenuContent() {
    const menuContent = document.getElementsByClassName('menu-content');
    if (menuContent) {
        const keys = Object.keys(menuContent);
        keys.map(k => menuContent[k].style.display = 'none');
    }
    document.body.style.overflow = 'auto';
    document.querySelector('.background-mask').setAttribute('data-display', 'hide');
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
            if (!backButton)
                changeNavigationHistory(contentArea.innerHTML, newURL);
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

function changeNavigationHistory(data, url) {
    const href = window.location.href;
    if (href.indexOf('#') === href.length - 1 || href === url)
        window.history.replaceState(data, '', url);
    else 
        window.history.pushState(data, '', url);
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
    if (target.tagName.toLowerCase() !== 'body'
    && (typeof target.className !== 'string'
        || (target.className.toLowerCase() !== 'menu-icons'
        && target.className.toLowerCase() !== 'background-mask'))) {
        while (typeof target.className !== 'string' || target.className.indexOf('content-area') < 0) {
            target = target.parentElement;
            if (!target)
                return;
        }
    }
    hideMenuContent();
    setButtonLowBrightness();
    if (document.body.getAttribute('data-state') === 'home')
        document.getElementById('home-button').className = 'menu-button menu-high-brightness';
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
        loadHomePage(backButton);
}

function handleMenuIconsResize() {
    const viewportHeight = document.documentElement.clientHeight;
    const menuHeight = parseInt(window.getComputedStyle(document.querySelector('.menu-icons')).height);
    const marginBottom = menuHeight - viewportHeight + 10 + 'px';
    document.querySelector('.menu-bottom-container').style.setProperty('margin-bottom', marginBottom);
}

window.addEventListener('load', restoreTheme);
window.addEventListener('load', handleHashNavigation);
window.addEventListener('load', handleMenuIconsResize);
window.addEventListener('resize', handleMenuIconsResize);
window.addEventListener('popstate', () => handleHashNavigation(null, true));
