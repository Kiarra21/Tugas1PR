let isLoading = true;
let currentPage = '';

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setTimeout(() => {
        hideLoadingScreen();
    }, 1000);

    if (document.getElementById('sidebar')) {
        loadSidebar();
    }

    initializeContactForm();
    
    initializeResponsiveHandlers();
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    isLoading = false;
}

function enterPortfolio() {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 500);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuBtn');
    
    if (!sidebar || !overlay || !menuBtn) return;
    
    const isActive = sidebar.classList.contains('active');
    
    if (isActive) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuBtn');
    
    if (!sidebar || !overlay || !menuBtn) return;
    
    sidebar.classList.add('active');
    overlay.classList.add('active');
    menuBtn.classList.add('active');
    
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuBtn');
    
    if (!sidebar || !overlay || !menuBtn) return;
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    menuBtn.classList.remove('active');
    
    document.body.style.overflow = 'auto';
}

function loadSidebar() {
    fetch('sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load sidebar');
            }
            return response.text();
        })
        .then(html => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.innerHTML = html;
                highlightActiveNavItem();
            }
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.innerHTML = `
                    <div class="sidebar-content">
                        <div class="sidebar-header">
                            <h3>Navigation</h3>
                        </div>
                        <nav class="sidebar-nav">
                            <a href="#" class="nav-item" onclick="loadContent('biodata.html')" data-page="biodata">
                                <span class="nav-icon">👤</span>
                                <span class="nav-text">About Me</span>
                            </a>
                            <a href="#" class="nav-item" onclick="loadContent('pengalaman.html')" data-page="experience">
                                <span class="nav-icon">💼</span>
                                <span class="nav-text">Experience</span>
                            </a>
                            <a href="#" class="nav-item" onclick="loadContent('contact.html')" data-page="contact">
                                <span class="nav-icon">📧</span>
                                <span class="nav-text">Contact Me</span>
                            </a>
                        </nav>
                        <div class="sidebar-footer">
                            <p>&copy; 2024 Kiarra Portfolio</p>
                        </div>
                    </div>
                `;
            }
        });
}

function loadContent(page) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    mainContent.style.opacity = '0.5';
    mainContent.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading content...</p>
        </div>
    `;
    
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${page}`);
            }
            return response.text();
        })
        .then(html => {
            setTimeout(() => {
                mainContent.innerHTML = html;
                mainContent.style.opacity = '1';
                
                currentPage = page.replace('.html', '');
                highlightActiveNavItem();
                
                initializePageSpecifics(page);
                
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 200);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            mainContent.innerHTML = `
                <div class="error-content">
                    <h2>❌ Error Loading Content</h2>
                    <p>Sorry, we couldn't load the requested page.</p>
                    <button onclick="location.reload()" class="cover-btn">
                        <span>Refresh Page</span>
                    </button>
                </div>
            `;
            mainContent.style.opacity = '1';
        });
}

// === PAGE-SPECIFIC INITIALIZATION ===
function initializePageSpecifics(page) {
    switch(page) {
        case 'contact.html':
            initializeContactForm();
            break;
        case 'biodata.html':
            initializeBiodataAnimations();
            break;
        case 'pengalaman.html':
            initializeExperienceAnimations();
            break;
    }
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });
    
    const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

function handleFormSubmission(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <span class="loading-spinner" style="width: 20px; height: 20px;"></span>
        <span>Sending...</span>
    `;
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
        
        form.reset();
        
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        
        const focusedGroups = form.querySelectorAll('.form-group.focused');
        focusedGroups.forEach(group => group.classList.remove('focused'));
        
    }, 2000);
}

function initializeBiodataAnimations() {
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.style.opacity = '0';
        profileImage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            profileImage.style.transition = 'all 0.8s ease';
            profileImage.style.opacity = '1';
            profileImage.style.transform = 'scale(1)';
        }, 300);
    }
    
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            tag.style.transition = 'all 0.5s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });
}

function initializeExperienceAnimations() {
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

function highlightActiveNavItem() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === currentPage) {
            item.classList.add('active');
        }
    });
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function initializeResponsiveHandlers() {
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 60px 20px;
        color: var(--text-light);
    }
    
    .loading-content .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .error-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 60px 20px;
        text-align: center;
        color: var(--text-light);
    }
    
    .nav-item.active {
        background: rgba(255, 255, 255, 0.2);
        transform: translateX(10px);
    }
    
    .nav-item.active::before {
        width: 100%;
    }
`;

document.head.appendChild(notificationStyles);
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeLazyLoading);