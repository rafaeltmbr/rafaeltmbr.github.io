function animateHeaders() {
    const headers = document.getElementsByTagName('header');
    const k = Object.keys(headers);
    k.map( h => headers[h].addEventListener('click', (event) => {
        hideSameLevelList(event);
        switchListAroundHeader(event);
    }));
}

function hideSameLevelList({target: header}) {
    const sibling = header.parentElement && header.parentElement.children;
    /* Hide same level elements, but still save the current list state */

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

animateHeaders();