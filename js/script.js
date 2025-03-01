// Chặn zoom bằng cuộn chuột (trackpad) trên Chrome:
document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

//Mở ra zô của ngăn kéo
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".open-drawer-btn");
    let drawers = document.querySelectorAll(".offcanvas-custom");
    let hamburgerBtn = document.getElementById("hamburgerBtn");
    let closeSystemBtn = document.getElementById("closeSystemBtn");
    let drawerContainer = document.getElementById("drawerContainer");
    let leftSection = document.querySelector(".w-30"); // Selecting the left section

    // Mặc định khi tải trang, bên trái sẽ chiếm 100% màn hình
    leftSection.classList.remove("w-30");
    leftSection.classList.add("w-100");

    // Xử lý sự kiện cho nút hamburger
    hamburgerBtn.addEventListener("click", function () {
        drawerContainer.classList.toggle("closed");

        // Toggle the width class of the left section
        if (drawerContainer.classList.contains("closed")) {
            // Nếu ngăn kéo đóng, bên trái chiếm 100%
            leftSection.classList.remove("w-30");
            leftSection.classList.add("w-100");
        } else {
            // Nếu ngăn kéo mở, bên trái chiếm 30%
            leftSection.classList.remove("w-100");
            leftSection.classList.add("w-30");
        }

        // Đóng tất cả các ngăn kéo khi mở hệ thống để hiển thị trang chính
        drawers.forEach((d) => d.classList.remove("open"));
    });

    // Xử lý sự kiện cho nút đóng hệ thống
    closeSystemBtn.addEventListener("click", function () {
        drawerContainer.classList.add("closed");

        // Expand the left section when the drawer is closed
        leftSection.classList.remove("w-30");
        leftSection.classList.add("w-100");

        // Đóng tất cả các ngăn kéo khi đóng hệ thống
        drawers.forEach((d) => d.classList.remove("open"));
    });

    // Xử lý sự kiện cho các nút mở ngăn kéo
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            let targetId = this.getAttribute("data-target");
            let drawer = document.getElementById(targetId);
            let isOpen = drawer.classList.contains("open");

            // Set the left section back to 30% width when opening drawer
            leftSection.classList.remove("w-100");
            leftSection.classList.add("w-30");

            // Đóng tất cả các ngăn trước khi mở
            drawers.forEach((d) => d.classList.remove("open"));

            // Nếu chưa mở, mở nó
            if (!isOpen) {
                drawer.classList.add("open");
            }
        });
    });
});