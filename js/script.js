// Mở ra zô của ngăn kéo
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".open-drawer-btn");
    let drawers = document.querySelectorAll(".offcanvas-custom");
    let hamburgerBtn = document.getElementById("hamburgerBtn");
    let closeSystemBtn = document.getElementById("closeSystemBtn");
    let drawerContainer = document.getElementById("drawerContainer");
    let leftSection = document.querySelector(".w-30");
    let homePage = document.querySelector(".home-page");
    let video = homePage.querySelector("video"); // Select the video element

    // Mặc định khi tải trang, bên trái sẽ chiếm 100% màn hình
    leftSection.classList.remove("w-30");
    leftSection.classList.add("w-100");

    // Xử lý sự kiện cho nút hamburger
    hamburgerBtn.addEventListener("click", function () {
        drawerContainer.classList.toggle("closed");

        if (drawerContainer.classList.contains("closed")) {
            leftSection.classList.remove("w-30");
            leftSection.classList.add("w-100");
            homePage.classList.remove("hidden");
            if (video) video.play(); // Resume video when home page is shown
        } else {
            leftSection.classList.remove("w-100");
            leftSection.classList.add("w-30");
        }

        // Đóng tất cả các ngăn kéo khi mở hệ thống
        drawers.forEach((d) => d.classList.remove("open"));
        homePage.classList.remove("hidden");
        if (video) video.play(); // Ensure video plays when drawer system opens
    });

    // Xử lý sự kiện cho nút đóng hệ thống
    closeSystemBtn.addEventListener("click", function () {
        drawerContainer.classList.add("closed");
        leftSection.classList.remove("w-30");
        leftSection.classList.add("w-100");
        homePage.classList.remove("hidden");
        if (video) video.pause();
        drawers.forEach((d) => d.classList.remove("open"));
    });

    // Xử lý sự kiện cho các nút mở ngăn kéo
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            let targetId = this.getAttribute("data-target");
            let drawer = document.getElementById(targetId);
            let isOpen = drawer.classList.contains("open");

            leftSection.classList.remove("w-100");
            leftSection.classList.add("w-30");

            drawers.forEach((d) => d.classList.remove("open"));

            if (!isOpen) {
                drawer.classList.add("open");
                homePage.classList.add("hidden");
                if (video) video.pause(); // Pause video when a drawer is opened
            } else {
                homePage.classList.remove("hidden");
                if (video) video.play(); // Resume video if drawer is closed
            }
        });
    });
});

// Ripple Effect on Click
document.addEventListener('click', function (e) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = '100px';
    ripple.style.left = `${e.clientX - 50}px`; // Center ripple at click
    ripple.style.top = `${e.clientY - 50}px`;
    document.body.appendChild(ripple);

    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 700); // Match animation duration
});