function animateHeaders() {
    const headers = document.getElementsByTagName('header');
    const k = Object.keys(headers);
    k.map( h => headers[h].addEventListener('click', (event) => {
        const {target} = event;
        if (target.parentElement && target.parentElement.parentElement
            && target.parentElement.parentElement.className.indexOf('menu-categories') >= 0) {
            hideMenuCategories(target.parentElement.parentElement);
        }
        switchListAroundHeader(event);
    }));
}

function switchListAroundHeader({target: header}) {
    const sibling = header.parentElement && header.parentElement.children;
    if (sibling) {
        const keys = Object.keys(sibling);
        keys.map(k => {
            if (sibling[k].tagName.toLowerCase() === 'ul' || sibling[k].tagName.toLowerCase() === 'ol') {
                const display = window.getComputedStyle(sibling[k]).display;
                sibling[k].style.display = ( display === 'none' ? 'block' : 'none');
            }
        });
    }
}

function hideMenuCategories(node) {
    if (!node)
        return;

    while(node.className.indexOf('menu-categories') < 0) {
        node = node.parentElement;
        if (!node)
            return;
    }

    const liList = node.children;
    const liArray = [];
    Object.keys(liList).map(k => liArray.push(liList[k]));
    
    liArray.map(li => {
        const liChildrenArray = [];
        Object.keys(li.children).map(k => liChildrenArray.push(li.children[k]));

        liChildrenArray.map(i => {
            if (i.tagName.toLowerCase() === 'ul' || i.tagName.toLowerCase() === 'ol')
                i.style.display = 'none';
        });
    });
}

function setListHeight(selector) {
    console.log('resize');
    const list = document.querySelectorAll(selector);
    if (!list)
        return;
    
    const progArray = [];
    Object.keys(list).map(k => progArray.push(list[k]));
    
    const {clientHeight} = document.documentElement;
    const header = document.querySelector('.menu-categories > li > header');
    const height = parseInt(window.getComputedStyle(header).height);
    progArray.map(l => l.style.height = (clientHeight - progArray.length * height)  + 'px');
}

function setMenuCategoryListHeight() {
    setListHeight('.programming .menu-category-list');
    setListHeight('.microcontrollers .menu-category-list');
}

window.addEventListener('resize', setMenuCategoryListHeight);
window.addEventListener('load', setMenuCategoryListHeight);

animateHeaders();