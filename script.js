// متغيرات عامة
let notifications = [];
let notificationCount = 0;

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    setupScrollAnimations();
    setupNotificationSystem();
    loadInitialNotifications();
});

// تهيئة الموقع
function initializeWebsite() {
    // إضافة تأثير التحميل
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // تفعيل التنقل السلس
    setupSmoothScrolling();
    
    // تفعيل القائمة المتجاوبة
    setupResponsiveMenu();
    
    // تفعيل معرض الصور
    setupGallery();
    
    // تفعيل النماذج
    setupForms();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر الجرس
    const notificationBell = document.getElementById('notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', toggleNotificationModal);
    }

    // إغلاق شريط الإشعارات
    const closeNotification = document.getElementById('close-notification');
    if (closeNotification) {
        closeNotification.addEventListener('click', hideNotificationBar);
    }

    // إغلاق نافذة الإشعارات
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', closeNotificationModal);
    }

    // إغلاق النافذة عند النقر خارجها
    const notificationModal = document.getElementById('notification-modal');
    if (notificationModal) {
        notificationModal.addEventListener('click', function(e) {
            if (e.target === notificationModal) {
                closeNotificationModal();
            }
        });
    }

    // تفعيل روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            setActiveNavLink(this);
        });
    });

    // تفعيل أزرار الصفحة الرئيسية
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                scrollToSection(targetId);
            }
        });
    });
}

// التنقل السلس
function setupSmoothScrolling() {
    // تفعيل التنقل السلس لجميع الروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                scrollToSection(targetId);
            }
        });
    });
}

// التمرير إلى قسم معين
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const offsetTop = targetSection.offsetTop - headerHeight - navbarHeight;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// تحديد الرابط النشط في القائمة
function setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// إعداد القائمة المتجاوبة
function setupResponsiveMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// إعداد تأثيرات التمرير
function setupScrollAnimations() {
    // تفعيل تأثير الظهور عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // إضافة العناصر للمراقبة
    document.querySelectorAll('.info-card, .news-card, .event-card, .gallery-item, .contact-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // تحديث الرابط النشط أثناء التمرير
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

// تحديث الرابط النشط أثناء التمرير
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// إعداد معرض الصور
function setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openImageModal(img.src, img.alt);
            }
        });
    });
}

// فتح نافذة عرض الصورة
function openImageModal(imageSrc, imageAlt) {
    // إنشاء نافذة عرض الصورة
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="close-image-modal">&times;</span>
            <img src="${imageSrc}" alt="${imageAlt}">
            <div class="image-caption">${imageAlt}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إضافة الأنماط
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.image-modal-content');
    modalContent.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    `;
    
    const img = modal.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    const closeBtn = modal.querySelector('.close-image-modal');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
        transition: transform 0.3s ease;
    `;
    
    const caption = modal.querySelector('.image-caption');
    caption.style.cssText = `
        color: white;
        margin-top: 20px;
        font-size: 1.2rem;
    `;
    
    // تفعيل النافذة
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // إغلاق النافذة
    function closeImageModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeImageModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // إغلاق بمفتاح Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

// إعداد النماذج
function setupForms() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmit(this);
        });
    }
}

// معالجة إرسال نموذج التواصل
function handleContactFormSubmit(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };
    
    // إضافة تأثير التحميل
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled = true;
    
    // محاكاة إرسال البيانات
    setTimeout(() => {
        // إضافة إشعار نجح الإرسال
        addNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
        
        // إعادة تعيين النموذج
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // عرض رسالة نجاح
        showSuccessMessage('تم إرسال رسالتك بنجاح!');
    }, 2000);
}

// عرض رسالة نجاح
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// إعداد نظام الإشعارات
function setupNotificationSystem() {
    // تحديث عداد الإشعارات
    updateNotificationCount();
    
    // إضافة إشعارات تلقائية كل فترة
    setInterval(() => {
        const randomNotifications = [
            'مرحباً بزائر جديد في الموقع',
            'تم تحديث قسم الأخبار',
            'مناسبة جديدة تمت إضافتها',
            'شكراً لزيارتكم موقعنا'
        ];
        
        const randomIndex = Math.floor(Math.random() * randomNotifications.length);
        addNotification(randomNotifications[randomIndex], 'info');
    }, 30000); // كل 30 ثانية
}

// تحميل الإشعارات الأولية
function loadInitialNotifications() {
    const initialNotifications = [
        {
            message: 'مرحباً بكم في موقع الشيخ ناجي صالح الحمداني',
            type: 'welcome',
            time: new Date().toLocaleString('ar-EG')
        },
        {
            message: 'تم تحديث قسم المناسبات بأحدث الفعاليات',
            type: 'update',
            time: new Date(Date.now() - 3600000).toLocaleString('ar-EG')
        },
        {
            message: 'إضافة أخبار جديدة في قسم الأخبار',
            type: 'news',
            time: new Date(Date.now() - 7200000).toLocaleString('ar-EG')
        }
    ];
    
    initialNotifications.forEach(notification => {
        notifications.unshift(notification);
    });
    
    notificationCount = notifications.length;
    updateNotificationCount();
}

// إضافة إشعار جديد
function addNotification(message, type = 'info') {
    const notification = {
        message: message,
        type: type,
        time: new Date().toLocaleString('ar-EG'),
        id: Date.now()
    };
    
    notifications.unshift(notification);
    notificationCount++;
    updateNotificationCount();
    
    // تشغيل صوت الإشعار (اختياري)
    playNotificationSound();
    
    // إضافة تأثير بصري للجرس
    animateNotificationBell();
}

// تحديث عداد الإشعارات
function updateNotificationCount() {
    const countElement = document.getElementById('notification-count');
    if (countElement) {
        countElement.textContent = notificationCount;
        countElement.style.display = notificationCount > 0 ? 'flex' : 'none';
    }
}

// تحريك جرس الإشعارات
function animateNotificationBell() {
    const bell = document.getElementById('notification-bell');
    if (bell) {
        bell.classList.add('pulse');
        setTimeout(() => {
            bell.classList.remove('pulse');
        }, 1000);
    }
}

// تشغيل صوت الإشعار
function playNotificationSound() {
    // إنشاء صوت بسيط باستخدام Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.log('تعذر تشغيل صوت الإشعار');
    }
}

// فتح/إغلاق نافذة الإشعارات
function toggleNotificationModal() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
        if (modal.style.display === 'block') {
            closeNotificationModal();
        } else {
            openNotificationModal();
        }
    }
}

// فتح نافذة الإشعارات
function openNotificationModal() {
    const modal = document.getElementById('notification-modal');
    const notificationList = document.getElementById('notification-list');
    
    if (modal && notificationList) {
        // تحديث قائمة الإشعارات
        updateNotificationList();
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // إعادة تعيين العداد
        notificationCount = 0;
        updateNotificationCount();
    }
}

// إغلاق نافذة الإشعارات
function closeNotificationModal() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// تحديث قائمة الإشعارات
function updateNotificationList() {
    const notificationList = document.getElementById('notification-list');
    if (notificationList) {
        if (notifications.length === 0) {
            notificationList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">لا توجد إشعارات جديدة</p>';
        } else {
            notificationList.innerHTML = notifications.map(notification => `
                <div class="notification-item" style="
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#f9f9f9'" onmouseout="this.style.background='white'">
                    <div style="display: flex; justify-content: space-between; align-items: start; gap: 10px;">
                        <div style="flex-grow: 1;">
                            <p style="margin: 0 0 5px 0; font-weight: 500; color: #333;">${notification.message}</p>
                            <small style="color: #666; font-size: 0.85rem;">${notification.time}</small>
                        </div>
                        <span class="notification-type" style="
                            background: ${getNotificationTypeColor(notification.type)};
                            color: white;
                            padding: 2px 8px;
                            border-radius: 12px;
                            font-size: 0.75rem;
                            white-space: nowrap;
                        ">${getNotificationTypeLabel(notification.type)}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

// الحصول على لون نوع الإشعار
function getNotificationTypeColor(type) {
    const colors = {
        'welcome': '#4CAF50',
        'update': '#2196F3',
        'news': '#FF9800',
        'info': '#9C27B0',
        'success': '#4CAF50',
        'warning': '#FF5722'
    };
    return colors[type] || '#666';
}

// الحصول على تسمية نوع الإشعار
function getNotificationTypeLabel(type) {
    const labels = {
        'welcome': 'ترحيب',
        'update': 'تحديث',
        'news': 'خبر',
        'info': 'معلومة',
        'success': 'نجاح',
        'warning': 'تنبيه'
    };
    return labels[type] || 'عام';
}

// إخفاء شريط الإشعارات
function hideNotificationBar() {
    const notificationBar = document.getElementById('notification-bar');
    if (notificationBar) {
        notificationBar.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            notificationBar.style.display = 'none';
        }, 300);
    }
}

// وظائف إضافية للتحسين

// تحسين الأداء - تأخير تحميل الصور
function setupLazyLoading() {
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

// إضافة تأثيرات الماوس للعناصر التفاعلية
function setupHoverEffects() {
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .info-card, .news-card, .contact-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// تحسين تجربة المستخدم على الأجهزة اللوحية
function setupTouchSupport() {
    // إضافة دعم اللمس للعناصر التفاعلية
    const touchElements = document.querySelectorAll('.gallery-item, .info-card, .news-card');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// تفعيل الوضع الليلي (اختياري)
function setupDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

// تهيئة إضافية عند تحميل الصفحة
window.addEventListener('load', function() {
    setupLazyLoading();
    setupHoverEffects();
    setupTouchSupport();
    setupDarkMode();
    
    // إضافة إشعار ترحيبي
    setTimeout(() => {
        addNotification('أهلاً وسهلاً بكم في موقع الشيخ ناجي صالح الحمداني', 'welcome');
    }, 2000);
});

// معالجة الأخطاء
window.addEventListener('error', function(e) {
    console.error('خطأ في الموقع:', e.error);
});

// تحسين الأداء - تقليل استخدام الذاكرة
window.addEventListener('beforeunload', function() {
    // تنظيف المتغيرات والمستمعين
    notifications = [];
    notificationCount = 0;
});

