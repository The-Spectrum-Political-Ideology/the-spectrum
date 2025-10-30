// ui/toast.js

export function showToast(message, type = 'info') {
    const id = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = id;
    toast.className = `toast toast-${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'alert-triangle';

    toast.innerHTML = `
        <i data-feather="${icon}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    if(window.feather) feather.replace();

    // Animate in
    setTimeout(() => toast.classList.add('visible'), 100);

    // Auto-dismiss
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
}