// Optimized script giữ nguyên chức năng gốc nhưng mượt hơn cho 120Hz
(function () {
    'use strict';

    // Cache DOM elements cho performance tốt hơn
    const elements = {
        buttons: null,
        drawers: null,
        hamburgerBtn: null,
        closeSystemBtn: null,
        drawerContainer: null,
        leftSection: null,
        homePage: null,
        video: null
    };

    // Animation state management
    let isAnimating = false;
    let currentDrawer = null;

    // Debounce được tối ưu cho 120Hz
    function fastDebounce(func, wait = 16) { // ~60fps minimum
        let timeout;
        let lastExecTime = 0;
        return function executedFunction(...args) {
            const currentTime = performance.now();
            const timeSinceLastExec = currentTime - lastExecTime;

            const later = () => {
                lastExecTime = performance.now();
                func.apply(this, args);
            };

            clearTimeout(timeout);

            if (timeSinceLastExec > wait) {
                later();
            } else {
                timeout = setTimeout(later, wait - timeSinceLastExec);
            }
        };
    }

    // Throttle tối ưu cho smooth animation
    function smoothThrottle(func, limit = 8) { // 120Hz = ~8ms
        let inThrottle;
        let lastFunc;
        let lastRan;

        return function () {
            const context = this;
            const args = arguments;

            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    // Initialize elements cache - giữ nguyên logic gốc
    function cacheElements() {
        elements.buttons = document.querySelectorAll(".open-drawer-btn");
        elements.drawers = document.querySelectorAll(".offcanvas-custom");
        elements.hamburgerBtn = document.getElementById("hamburgerBtn");
        elements.closeSystemBtn = document.getElementById("closeSystemBtn");
        elements.drawerContainer = document.getElementById("drawerContainer");
        elements.leftSection = document.querySelector(".w-30");
        elements.homePage = document.querySelector(".home-page");
        elements.video = elements.homePage?.querySelector("video");
    }

    // Enhanced smooth transition với easing tốt hơn
    function smoothTransition(element, changes, duration = 250) {
        if (!element || isAnimating) return Promise.resolve();

        return new Promise((resolve) => {
            isAnimating = true;
            const startTime = performance.now();

            // Get initial values - giữ nguyên logic gốc
            const initialStyles = {};
            Object.keys(changes).forEach(prop => {
                const computed = getComputedStyle(element)[prop];
                initialStyles[prop] = parseFloat(computed) || 0;
            });

            // Enhanced easing function cho smooth hơn
            const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easedProgress = easeOutQuart(progress);

                // Apply changes - tối ưu performance
                const updates = {};
                Object.keys(changes).forEach(prop => {
                    const startVal = initialStyles[prop];
                    const endVal = parseFloat(changes[prop]) || 0;
                    const currentVal = startVal + (endVal - startVal) * easedProgress;
                    updates[prop] = currentVal + (prop.includes('width') || prop.includes('height') ? '%' : 'px');
                });

                // Batch update styles
                Object.assign(element.style, updates);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    isAnimating = false;
                    resolve();
                }
            }

            requestAnimationFrame(animate);
        });
    }

    // Video handling được tối ưu
    function handleVideo(action) {
        if (!elements.video) return;

        requestAnimationFrame(() => {
            try {
                if (action === 'play') {
                    elements.video.play().catch(e => console.log('Video play failed:', e));
                } else if (action === 'pause') {
                    elements.video.pause();
                }
            } catch (e) {
                console.log('Video operation failed:', e);
            }
        });
    }

    // Class management được tối ưu nhưng giữ nguyên logic
    function toggleClasses(element, add = [], remove = []) {
        if (!element) return;

        // Use DocumentFragment for better performance
        requestAnimationFrame(() => {
            remove.forEach(cls => element.classList.remove(cls));
            add.forEach(cls => element.classList.add(cls));
        });
    }

    // Batch DOM operations - tối ưu performance
    function batchDOMOperations(operations) {
        requestAnimationFrame(() => {
            operations.forEach(op => {
                try {
                    op();
                } catch (e) {
                    console.log('DOM operation failed:', e);
                }
            });
        });
    }

    // Hamburger button handler - giữ nguyên logic gốc nhưng smooth hơn
    const handleHamburgerClick = fastDebounce(function () {
        if (isAnimating) return;

        const isClosed = elements.drawerContainer.classList.contains("closed");
        const lightningOverlay = document.querySelector('.lightning-overlay');

        batchDOMOperations([
            () => {
                // Tạm dừng animation sét
                if (lightningOverlay) {
                    lightningOverlay.style.animationPlayState = 'paused';
                }

                if (isClosed) {
                    // Mở system
                    toggleClasses(elements.drawerContainer, [], ["closed"]);
                    toggleClasses(elements.leftSection, ["w-30"], ["w-100"]);
                    toggleClasses(elements.homePage, [], ["hidden"]);
                    handleVideo('play');
                } else {
                    // Đóng system
                    toggleClasses(elements.drawerContainer, ["closed"], []);
                    toggleClasses(elements.leftSection, ["w-100"], ["w-30"]);
                    handleVideo('pause');

                    // Đóngក

                    elements.drawers.forEach(drawer => {
                        toggleClasses(drawer, [], ["open"]);
                    });
                }

                // Khôi phục animation sau khi chuyển đổi hoàn tất
                setTimeout(() => {
                    if (lightningOverlay) {
                        lightningOverlay.style.animationPlayState = 'running';
                    }
                }, 500); // Thời gian khớp với thời gian chuyển đổi (0.5s)
            }
        ]);
    }, 50);

    const handleCloseSystem = fastDebounce(function () {
        if (isAnimating) return;

        const lightningOverlay = document.querySelector('.lightning-overlay');

        batchDOMOperations([
            () => {
                // Tạm dừng animation sét
                if (lightningOverlay) {
                    lightningOverlay.style.animationPlayState = 'paused';
                }

                toggleClasses(elements.drawerContainer, ["closed"], []);
                toggleClasses(elements.leftSection, ["w-100"], ["w-30"]);
                toggleClasses(elements.homePage, [], ["hidden"]);
                handleVideo('pause');

                elements.drawers.forEach(drawer => {
                    toggleClasses(drawer, [], ["open"]);
                });

                currentDrawer = null;

                // Khôi phục animation sau khi chuyển đổi hoàn tất
                setTimeout(() => {
                    if (lightningOverlay) {
                        lightningOverlay.style.animationPlayState = 'running';
                    }
                }, 500);
            }
        ]);
    }, 50);

    // Drawer button handler - giữ nguyên logic gốc
    function handleDrawerClick(button) {
        return fastDebounce(function () {
            if (isAnimating) return;

            const targetId = button.getAttribute("data-target");
            const drawer = document.getElementById(targetId);
            if (!drawer) return;

            const isOpen = drawer.classList.contains("open");

            batchDOMOperations([
                () => {
                    // Đóng drawer hiện tại nếu khác
                    if (currentDrawer && currentDrawer !== drawer) {
                        toggleClasses(currentDrawer, [], ["open"]);
                    }

                    // Đặt left section về 30%
                    toggleClasses(elements.leftSection, ["w-30"], ["w-100"]);

                    // Đóng tất cả drawers khác
                    elements.drawers.forEach(d => {
                        if (d !== drawer) {
                            toggleClasses(d, [], ["open"]);
                        }
                    });

                    if (!isOpen) {
                        // Mở drawer
                        toggleClasses(drawer, ["open"], []);
                        toggleClasses(elements.homePage, ["hidden"], []);
                        handleVideo('pause');
                        currentDrawer = drawer;
                    } else {
                        // Đóng drawer
                        toggleClasses(drawer, [], ["open"]);
                        toggleClasses(elements.homePage, [], ["hidden"]);
                        handleVideo('play');
                        currentDrawer = null;
                    }
                }
            ]);
        }, 30);
    }

    // Ripple effect được tối ưu với object pooling
    const ripplePool = [];
    const maxPoolSize = 12;

    function createRipple() {
        if (ripplePool.length > 0) {
            return ripplePool.pop();
        }

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            pointer-events: none;
            border-radius: 50%;
            transform: scale(0) translateZ(0);
            animation: ripple-animation 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            background: radial-gradient(circle, rgba(173, 133, 0, 1) 0%, transparent 100%);
            z-index: 9999;
        `;

        // Add optimized animation keyframes
        if (!document.querySelector('#ripple-style-optimized')) {
            const style = document.createElement('style');
            style.id = 'ripple-style-optimized';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(3.5) translateZ(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return ripple;
    }

    function returnRipple(ripple) {
        if (ripplePool.length < maxPoolSize) {
            ripple.style.transform = 'scale(0) translateZ(0)';
            ripple.style.opacity = '1';
            ripplePool.push(ripple);
        }
    }

    // Optimized ripple effect handler
    const handleClick = smoothThrottle(function (e) {
        // Skip video và media elements
        if (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO') return;

        const ripple = createRipple();
        const size = 50;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - size / 2) + 'px';
        ripple.style.top = (e.clientY - size / 2) + 'px';

        document.body.appendChild(ripple);

        // Cleanup với performance tối ưu
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
                returnRipple(ripple);
            }
        }, 500);
    }, 12);

    // Initialize - giữ nguyên logic gốc nhưng tối ưu performance
    function init() {
        cacheElements();

        // Set initial state - quan trọng để giữ đúng trạng thái ban đầu
        if (elements.leftSection) {
            // Hardware acceleration cho smooth animation
            elements.leftSection.style.transform = 'translateZ(0)';
            toggleClasses(elements.leftSection, ["w-100"], ["w-30"]);
        }

        // Add event listeners với passive optimization
        if (elements.hamburgerBtn) {
            elements.hamburgerBtn.addEventListener("click", handleHamburgerClick, { passive: true });
        }

        if (elements.closeSystemBtn) {
            elements.closeSystemBtn.addEventListener("click", handleCloseSystem, { passive: true });
        }

        // Drawer button listeners
        elements.buttons?.forEach(button => {
            button.addEventListener("click", handleDrawerClick(button), { passive: true });
        });

        // Ripple effect với optimization
        document.addEventListener('click', handleClick, { passive: true });

        // Video optimization
        if (elements.video) {
            elements.video.style.transform = 'translateZ(0)'; // Hardware acceleration
            elements.video.preload = 'metadata';
            elements.video.playsInline = true;

            elements.video.addEventListener('loadeddata', () => {
                elements.video.playbackRate = 1;
            }, { once: true, passive: true });
        }

        console.log('🚀 Website optimized cho 120Hz và ready!');
    }

    // DOM ready check được tối ưu
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true, passive: true });
    } else {
        init();
    }

    // Performance monitoring cho 120Hz
    if (typeof PerformanceObserver !== 'undefined') {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === 'measure' && entry.duration > 16) {
                    console.log(`⚠️ Slow operation: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                }
            });
        });
        observer.observe({ entryTypes: ['measure'] });
    }

})();