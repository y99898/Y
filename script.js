// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// تهيئة الموقع
function initializeWebsite() {
    initSmoothScrolling();
    initMobileMenu();
    initGradeFilter();
    initSemesterTabs();
    initNewsTickerAnimation();
    initScrollEffects();
    initActiveNavigation();
}

// التمرير السلس
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// القائمة المحمولة
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            // تغيير الأيقونة
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// فلترة الصفوف
function initGradeFilter() {
    const gradeButtons = document.querySelectorAll('.grade-btn');
    const resultItems = document.querySelectorAll('.result-item');
    
    gradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الأزرار
            gradeButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الفئة النشطة للزر المحدد
            this.classList.add('active');
            
            const selectedGrade = this.getAttribute('data-grade');
            
            resultItems.forEach(item => {
                if (selectedGrade === 'all' || item.getAttribute('data-grade') === selectedGrade) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// تبديل الفصول الدراسية
function initSemesterTabs() {
    const semesterTabs = document.querySelectorAll('.semester-tab');
    const semesterContents = document.querySelectorAll('.semester-content');
    
    semesterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع التبويبات
            semesterTabs.forEach(t => t.classList.remove('active'));
            semesterContents.forEach(content => content.classList.remove('active'));
            
            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            
            const selectedSemester = this.getAttribute('data-semester');
            const targetContent = document.querySelector(`[data-semester="${selectedSemester}"].semester-content`);
            
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.animation = 'fadeIn 0.5s ease';
            }
        });
    });
}

// حركة شريط الأخبار
function initNewsTickerAnimation() {
    const tickerText = document.querySelector('.ticker-text');
    
    if (tickerText) {
        // إيقاف الحركة عند التمرير فوق الشريط
        tickerText.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        // استئناف الحركة عند مغادرة الشريط
        tickerText.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }
}

// تأثيرات التمرير
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر للحركة
    const animatedElements = document.querySelectorAll('.result-card, .news-card, .stat, .about-text, .director-info, .mission, .vision');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // تأثير الهيدر عند التمرير
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// التنقل النشط
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (window.scrollY >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// تأثيرات إضافية للبطاقات
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.result-card, .news-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// تحميل البيانات الديناميكية (محاكاة)
function loadDynamicContent() {
    // محاكاة تحميل الأخبار
    const newsContainer = document.querySelector('.news-grid');
    if (newsContainer) {
        // يمكن إضافة كود لتحميل الأخبار من API هنا
    }
    
    // محاكاة تحميل النتائج
    const resultsContainer = document.querySelector('.results-grid');
    if (resultsContainer) {
        // يمكن إضافة كود لتحميل النتائج من API هنا
    }
}

// إضافة CSS للحركات
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .header.scrolled {
            background: rgba(27, 41, 81, 0.95);
            backdrop-filter: blur(10px);
        }
        
        @media (max-width: 768px) {
            .nav {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--navy-blue);
                flex-direction: column;
                padding: 1rem;
                border-radius: 0 0 15px 15px;
                box-shadow: var(--shadow-medium);
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .nav.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .nav ul {
                flex-direction: column;
                gap: 0;
            }
            
            .nav li {
                width: 100%;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .nav li:last-child {
                border-bottom: none;
            }
            
            .nav a {
                display: block;
                padding: 1rem;
                border-radius: 0;
            }
            
            .dropdown-menu {
                position: static;
                opacity: 1;
                visibility: visible;
                transform: none;
                box-shadow: none;
                background: rgba(255,255,255,0.1);
                margin-top: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// تشغيل الحركات عند تحميل الصفحة
window.addEventListener('load', function() {
    addAnimationStyles();
    addCardHoverEffects();
    loadDynamicContent();
    
    // إضافة تأثير التحميل
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// معالجة الأخطاء
window.addEventListener('error', function(e) {
    console.log('خطأ في الموقع:', e.error);
});

// تحسين الأداء
function optimizePerformance() {
    // تأخير تحميل الصور
    const images = document.querySelectorAll('img[data-src]');
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
}

// تشغيل تحسين الأداء
document.addEventListener('DOMContentLoaded', optimizePerformance);

// إضافة وظائف إضافية للنتائج
function enhanceResultsPages() {
    // البحث في النتائج
    const searchInput = document.querySelector('#results-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const resultItems = document.querySelectorAll('.result-item');
            
            resultItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // طباعة النتائج
    const printButtons = document.querySelectorAll('.print-results');
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.print();
        });
    });
}

// تشغيل التحسينات الإضافية
document.addEventListener('DOMContentLoaded', enhanceResultsPages);

// إضافة إشعارات للمستخدم
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-gold);
        color: var(--navy-blue);
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// مثال على استخدام الإشعارات
document.addEventListener('DOMContentLoaded', function() {
    // إشعار ترحيب
    setTimeout(() => {
        showNotification("مرحباً بكم في موقع اعدادية صاحب البراق للبنين");
    }, 1000);
});

