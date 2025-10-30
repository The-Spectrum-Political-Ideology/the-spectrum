// views/ErrorPages.js

export function NotFoundPage() {
    return `
        <div class="text-center">
            <h1 class="text-6xl font-bold font-display text-indigo-500">404</h1>
            <p class="text-2xl">Page Not Found</p>
            <a href="#" class="btn btn-primary mt-8">Go Home</a>
        </div>
    `;
}

export function ErrorPage(error) {
     return `
        <div class="text-center">
            <h1 class="text-4xl font-bold font-display text-red-500">An Error Occurred</h1>
            <p class="text-xl">Something went wrong. Please try again later.</p>
            <code class="block bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-4 text-left">${error}</code>
            <a href="#" class="btn btn-primary mt-8">Go Home</a>
        </div>
    `;
}