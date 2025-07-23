// Enhanced Navigation with Smooth Scrolling and Active States
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav a, .top-drop-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.tagName === 'SELECT') return; // Skip for select element

            e.preventDefault();

            let targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                targetId = targetId.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Calculate offset for fixed navbar
                    const offset = 100;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active state
                    updateActiveNav(targetId);
                }
            }
        });
    });

    // Handle dropdown menu change
    const dropdown = document.querySelector('.top-drop-menu');
    if (dropdown) {
        dropdown.addEventListener('change', function () {
            const targetId = this.value.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offset = 100;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                updateActiveNav(targetId);
            }
        });
    }

    // Update active navigation item
    function updateActiveNav(activeId) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav li').forEach(li => {
            li.classList.remove('active');
        });

        // Add active class to current item
        document.querySelectorAll('.nav a').forEach(a => {
            if (a.getAttribute('href') === '#' + activeId) {
                a.parentElement.classList.add('active');
            }
        });

        // Update dropdown selection
        if (dropdown) {
            dropdown.value = '#' + activeId;
        }
    }

    // Scroll spy - highlight nav item based on scroll position
    function scrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNav(sectionId);
            }
        });
    }

    // Throttle scroll events for better performance
    let ticking = false;
    function updateScrollSpy() {
        if (!ticking) {
            requestAnimationFrame(function () {
                scrollSpy();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateScrollSpy);

    // Navbar scroll effect and back to top button
    let lastScrollTop = 0;
    const navbar = document.querySelector('.nav-menu');
    const backToTop = document.querySelector('.goto-top');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar background change
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }

        // Back to top button visibility
        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        lastScrollTop = scrollTop;
    });

    // Back to top functionality
    if (backToTop) {
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize active state based on current hash or default to home
    const initialHash = window.location.hash || '#home';
    const initialId = initialHash.substring(1);
    updateActiveNav(initialId);
});

// Add parallax effect to header background
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallaxElement = document.querySelector('.head-image');
    if (parallaxElement) {
        const speed = scrolled * 0.5;
        parallaxElement.style.transform = `translateY(${speed}px)`;
    }
});

// Add loading animation for better UX
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }

    // Trigger entrance animations
    const animatedElements = document.querySelectorAll('.sticky-paper-head, .sticky-paper-body');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Enhanced hover effects for portfolio items
document.addEventListener('DOMContentLoaded', function () {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05) translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Add typing effect to main title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function () {
    const mainTitle = document.querySelector('.big-name h1');
    if (mainTitle) {
        const titleText = mainTitle.textContent;
        setTimeout(() => {
            typeWriter(mainTitle, titleText, 150);
        }, 1000);
    }
});
