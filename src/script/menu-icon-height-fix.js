function resizeMenuBar() {
    const height = window.innerHeight;
    let menu = document.querySelector('.menu-icons');
    menu.style.height = height + 'px';
    console.log('height:', height);
}

window.addEventListener('load', resizeMenuBar);
window.addEventListener('resize', resizeMenuBar);