// ui/utils.js

export function showPageLoader(mainElement) {
    if (mainElement) {
        mainElement.innerHTML = `
            <div class="page-loader">
                <div class="spinner-lg"></div>
            </div>
        `;
    }
}

export function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<span class="spinner-sm"></span>`;
    } else {
        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    }
}

export function updateActiveNavLinks() {
    let currentHash = window.location.hash;
    if (currentHash === '') currentHash = '#';

    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHash = link.getAttribute('href');
        link.classList.toggle('active', linkHash === currentHash);
    });
}