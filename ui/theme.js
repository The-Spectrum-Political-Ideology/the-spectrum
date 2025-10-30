// ui/theme.js

export function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

export function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export function loadAdSettings() {
    const adsEnabled = localStorage.getItem('adsEnabled') === 'true';
    document.body.classList.toggle('ads-enabled', adsEnabled);
    // Note: The listener for the toggle is in router.js,
    // as it needs to be attached *after* the settings page is rendered.
}