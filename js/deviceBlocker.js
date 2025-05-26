// deviceBlocker.js - Chặn thiết bị nhỏ hơn tablet
(function () {
    'use strict';

    // Kích thước tối thiểu (768px - kích thước tablet tiêu chuẩn)
    const MIN_WIDTH = 768;
    const MIN_HEIGHT = 600;

    // Cache các elements
    let overlay = null;
    const body = document.body;

    // Tạo HTML cho popup chặn thiết bị
    function createBlockOverlay() {
        const overlayHTML = `
            <div class="device-block-overlay" id="deviceBlockOverlay">
                <div class="device-block-content">
                    <div class="device-block-icon">📱❌</div>
                    <h2 class="device-block-title">Thiết bị không được hỗ trợ</h2>
                    <p class="device-block-message">
                        Xin lỗi! Trang web này chỉ hỗ trợ trên các thiết bị có màn hình lớn hơn để có trải nghiệm tốt nhất.
                        <br><br>
                        Vui lòng truy cập bằng:
                    </p>
                    <div class="device-list">
                        <div class="device-item">
                            <div>💻</div>
                            <div>Máy tính</div>
                        </div>
                        <div class="device-item">
                            <div>📱</div>
                            <div>Tablet</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        body.insertAdjacentHTML('beforeend', overlayHTML);
        overlay = document.getElementById('deviceBlockOverlay');
    }

    // Kiểm tra kích thước thiết bị
    function checkDeviceSize() {
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const screenHeight = window.innerHeight || document.documentElement.clientHeight;

        // Kiểm tra nếu thiết bị nhỏ hơn yêu cầu
        if (screenWidth < MIN_WIDTH || screenHeight < MIN_HEIGHT) {
            showBlockMessage();
            return false;
        } else {
            hideBlockMessage();
            return true;
        }
    }

    // Hiển thị thông báo chặn
    function showBlockMessage() {
        if (!overlay) createBlockOverlay();

        if (overlay) {
            overlay.style.display = 'flex';
            body.classList.add('device-blocked');
        }
    }

    // Ẩn thông báo chặn
    function hideBlockMessage() {
        if (overlay) {
            overlay.style.display = 'none';
            body.classList.remove('device-blocked');
        }
    }

    // Throttle function để tối ưu hiệu suất
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Kiểm tra khi trang load và khi thay đổi kích thước
    function init() {
        // Kiểm tra ngay khi load
        checkDeviceSize();

        // Kiểm tra khi thay đổi kích thước màn hình (với throttle)
        const throttledCheck = throttle(checkDeviceSize, 250);
        window.addEventListener('resize', throttledCheck, { passive: true });

        // Kiểm tra khi thay đổi orientation trên mobile
        window.addEventListener('orientationchange', function () {
            setTimeout(checkDeviceSize, 500); // Delay để đảm bảo kích thước đã thay đổi
        }, { passive: true });

        console.log('Device blocker initialized - Min size: ' + MIN_WIDTH + 'x' + MIN_HEIGHT);
    }

    // Khởi tạo khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

})();