// Function để load nội dung từ file HTML
async function loadComponent(componentPath, targetId) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;

        // Tự động chạy các script trong component nếu có
        const scripts = document.getElementById(targetId).querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.head.appendChild(newScript);
        });
    } catch (error) {
        console.error(`Không thể load component ${componentPath}:`, error);
        document.getElementById(targetId).innerHTML = `<p>Lỗi: Không thể tải nội dung</p>`;
    }
}

// Load tất cả components khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    loadComponent('./components/drawer1.html', 'drawer1-content');
    loadComponent('./components/drawer2.html', 'drawer2-content');
    loadComponent('./components/drawer3.html', 'drawer3-content');
    loadComponent('./components/drawer4.html', 'drawer4-content');
});