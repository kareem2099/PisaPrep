document.addEventListener('DOMContentLoaded', function() {
    // Load navbar if not present
    if (!document.querySelector('.premium-navbar')) {
        fetch('/includes/navbar.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('navbar-container').innerHTML = html;
                initNavbar();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                loadFallbackNavbar();
            });
    } else {
        initNavbar();
    }

    function loadFallbackNavbar() {
        document.getElementById('navbar-container').innerHTML = `
            <nav class="fallback-navbar">
                <a href="/" class="logo">اختبارات الرياضيات</a>
                <button class="simple-toggle">☰</button>
                <div class="simple-menu">
                    <a href="index.html">الرئيسية</a>
                    <a href="tests.html">الاختبارات</a>
                </div>
            </nav>
        `;
    }

    function initNavbar() {
        // Mobile menu toggle with animation
        const navbarToggle = document.querySelector('.navbar-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuOverlay = document.querySelector('.menu-overlay');
        
        if (navbarToggle && mobileMenu) {
            navbarToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                menuOverlay.style.display = 'block';
                setTimeout(() => {
                    menuOverlay.style.opacity = mobileMenu.classList.contains('active') ? '1' : '0';
                    menuOverlay.style.visibility = mobileMenu.classList.contains('active') ? 'visible' : 'hidden';
                }, 10);
                
                // Animate toggle bars
                this.querySelectorAll('.toggle-bar').forEach((bar, index) => {
                    if (this.classList.contains('active')) {
                        bar.style.transform = index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                                          index === 1 ? 'scaleX(0)' : 
                                          'rotate(-45deg) translate(5px, -5px)';
                    } else {
                        bar.style.transform = '';
                    }
                });
            });
            
            // Close menu when clicking overlay
            menuOverlay.addEventListener('click', () => {
                navbarToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                menuOverlay.style.opacity = '0';
                menuOverlay.style.visibility = 'hidden';
            });
        }

        // Enhanced dropdown menus
        const dropdowns = document.querySelectorAll('.navbar-item.dropdown');
        dropdowns.forEach(item => {
            const link = item.querySelector('.navbar-link');
            const menu = item.querySelector('.dropdown-menu');
            
            // Desktop hover
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth > 992) {
                    showDropdown(menu);
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth > 992) {
                    hideDropdown(menu);
                }
            });
            
            // Mobile click
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                        if (otherMenu !== menu) hideDropdown(otherMenu);
                    });
                    menu.classList.contains('show') ? hideDropdown(menu) : showDropdown(menu);
                }
            });
        });

        function showDropdown(menu) {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
            menu.classList.add('show');
        }

        function hideDropdown(menu) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(10px)';
            menu.classList.remove('show');
        }

        // Highlight current page
        const currentPage = location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.navbar-link, .mobile-menu-item');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
                // Highlight parent dropdown if exists
                const parentDropdown = link.closest('.dropdown-menu');
                if (parentDropdown) {
                    parentDropdown.previousElementSibling.classList.add('active');
                }
            }
        });

        // Login button effect
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('mouseenter', () => {
                loginBtn.querySelector('.btn-glow').style.opacity = '0.3';
            });
            
            loginBtn.addEventListener('mouseleave', () => {
                loginBtn.querySelector('.btn-glow').style.opacity = '0';
            });
        }

        // Responsive adjustments
        function handleResize() {
            if (window.innerWidth > 992) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    navbarToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    menuOverlay.style.opacity = '0';
                    menuOverlay.style.visibility = 'hidden';
                }
                
                // Reset toggle bars
                if (navbarToggle) {
                    navbarToggle.querySelectorAll('.toggle-bar').forEach(bar => {
                        bar.style.transform = '';
                    });
                }
            }
        }
        
        window.addEventListener('resize', handleResize);
        
        // Initialize mobile menu items animation
        if (window.innerWidth <= 992) {
            document.querySelectorAll('.mobile-menu-item').forEach((item, index) => {
                item.style.animationDelay = `${0.1 + index * 0.05}s`;
            });
        }
    }
});