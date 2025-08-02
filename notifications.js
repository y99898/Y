// نظام الإشعارات المتقدم للشيخ ناجي صالح الحمداني

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.subscribers = [];
        this.settings = {
            maxNotifications: 50,
            autoDeleteAfter: 24 * 60 * 60 * 1000, // 24 ساعة
            soundEnabled: true,
            animationEnabled: true,
            realTimeUpdates: true
        };
        this.init();
    }

    init() {
        this.loadStoredNotifications();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.setupServiceWorker();
    }

    // تحميل الإشعارات المحفوظة
    loadStoredNotifications() {
        try {
            const stored = localStorage.getItem('sheikh_notifications');
            if (stored) {
                this.notifications = JSON.parse(stored);
                this.cleanOldNotifications();
            }
        } catch (error) {
            console.warn('تعذر تحميل الإشعارات المحفوظة:', error);
        }
    }

    // حفظ الإشعارات
    saveNotifications() {
        try {
            localStorage.setItem('sheikh_notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.warn('تعذر حفظ الإشعارات:', error);
        }
    }

    // تنظيف الإشعارات القديمة
    cleanOldNotifications() {
        const now = Date.now();
        this.notifications = this.notifications.filter(notification => {
            return (now - notification.timestamp) < this.settings.autoDeleteAfter;
        });
    }

    // إضافة إشعار جديد
    addNotification(message, type = 'info', options = {}) {
        const notification = {
            id: this.generateId(),
            message: message,
            type: type,
            timestamp: Date.now(),
            read: false,
            priority: options.priority || 'normal',
            category: options.category || 'general',
            actionUrl: options.actionUrl || null,
            persistent: options.persistent || false,
            ...options
        };

        this.notifications.unshift(notification);
        
        // تحديد الحد الأقصى للإشعارات
        if (this.notifications.length > this.settings.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.settings.maxNotifications);
        }

        this.saveNotifications();
        this.notifySubscribers('new', notification);
        this.showToast(notification);
        
        if (this.settings.soundEnabled) {
            this.playNotificationSound(type);
        }

        return notification.id;
    }

    // إنشاء معرف فريد
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // عرض إشعار منبثق
    showToast(notification) {
        if (!this.settings.animationEnabled) return;

        const toast = document.createElement('div');
        toast.className = `notification-toast notification-${notification.type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="toast-message">
                    <div class="toast-title">${this.getNotificationTitle(notification.type)}</div>
                    <div class="toast-text">${notification.message}</div>
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">×</button>
            </div>
            ${notification.actionUrl ? `<div class="toast-action">
                <a href="${notification.actionUrl}" class="toast-button">عرض التفاصيل</a>
            </div>` : ''}
        `;

        this.styleToast(toast, notification.type);
        document.body.appendChild(toast);

        // تحريك الإشعار
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 10);

        // إزالة الإشعار تلقائياً
        const autoRemoveTime = notification.persistent ? 10000 : 5000;
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.transform = 'translateX(100%)';
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 300);
            }
        }, autoRemoveTime);
    }

    // تطبيق أنماط الإشعار المنبثق
    styleToast(toast, type) {
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3',
            news: '#9C27B0',
            event: '#E91E63',
            welcome: '#00BCD4'
        };

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            border-left: 4px solid ${colors[type] || '#666'};
            min-width: 300px;
            max-width: 400px;
            z-index: 10001;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            margin-bottom: 10px;
        `;

        const content = toast.querySelector('.toast-content');
        content.style.cssText = `
            display: flex;
            align-items: flex-start;
            padding: 16px;
            gap: 12px;
        `;

        const icon = toast.querySelector('.toast-icon');
        icon.style.cssText = `
            color: ${colors[type] || '#666'};
            font-size: 20px;
            margin-top: 2px;
        `;

        const message = toast.querySelector('.toast-message');
        message.style.cssText = `
            flex: 1;
            min-width: 0;
        `;

        const title = toast.querySelector('.toast-title');
        title.style.cssText = `
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
            font-size: 14px;
        `;

        const text = toast.querySelector('.toast-text');
        text.style.cssText = `
            color: #666;
            font-size: 13px;
            line-height: 1.4;
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #999;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#f5f5f5';
            closeBtn.style.color = '#333';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
            closeBtn.style.color = '#999';
        });

        const actionDiv = toast.querySelector('.toast-action');
        if (actionDiv) {
            actionDiv.style.cssText = `
                padding: 0 16px 16px;
                border-top: 1px solid #f0f0f0;
                margin-top: 8px;
                padding-top: 12px;
            `;

            const actionBtn = toast.querySelector('.toast-button');
            actionBtn.style.cssText = `
                background: ${colors[type] || '#666'};
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                text-decoration: none;
                font-size: 12px;
                font-weight: 500;
                display: inline-block;
                transition: all 0.2s ease;
            `;
        }
    }

    // الحصول على أيقونة الإشعار
    getNotificationIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            news: '<i class="fas fa-newspaper"></i>',
            event: '<i class="fas fa-calendar-alt"></i>',
            welcome: '<i class="fas fa-hand-peace"></i>'
        };
        return icons[type] || '<i class="fas fa-bell"></i>';
    }

    // الحصول على عنوان الإشعار
    getNotificationTitle(type) {
        const titles = {
            success: 'تم بنجاح',
            error: 'خطأ',
            warning: 'تنبيه',
            info: 'معلومة',
            news: 'خبر جديد',
            event: 'مناسبة',
            welcome: 'مرحباً'
        };
        return titles[type] || 'إشعار';
    }

    // تشغيل صوت الإشعار
    playNotificationSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // أصوات مختلفة لأنواع مختلفة من الإشعارات
            const frequencies = {
                success: [523, 659, 784], // C-E-G
                error: [220, 185], // A-F#
                warning: [440, 370], // A-F#
                info: [523, 622], // C-D#
                news: [659, 784, 988], // E-G-B
                event: [392, 494, 622], // G-B-D#
                welcome: [523, 659, 784, 988] // C-E-G-B
            };
            
            const freq = frequencies[type] || [440];
            let time = audioContext.currentTime;
            
            freq.forEach((f, index) => {
                oscillator.frequency.setValueAtTime(f, time);
                time += 0.1;
            });
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('تعذر تشغيل صوت الإشعار:', error);
        }
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // مراقبة تغييرات الصفحة
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.settings.realTimeUpdates) {
                this.checkForUpdates();
            }
        });

        // مراقبة الاتصال بالإنترنت
        window.addEventListener('online', () => {
            this.addNotification('تم استعادة الاتصال بالإنترنت', 'success');
            this.syncNotifications();
        });

        window.addEventListener('offline', () => {
            this.addNotification('انقطع الاتصال بالإنترنت', 'warning');
        });
    }

    // بدء التحديثات في الوقت الفعلي
    startRealTimeUpdates() {
        if (!this.settings.realTimeUpdates) return;

        // محاكاة التحديثات التلقائية
        setInterval(() => {
            this.simulateRealTimeUpdates();
        }, 60000); // كل دقيقة

        // تحديثات عشوائية
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% احتمال
                this.generateRandomNotification();
            }
        }, 120000); // كل دقيقتين
    }

    // محاكاة التحديثات في الوقت الفعلي
    simulateRealTimeUpdates() {
        const updates = [
            { message: 'تم تحديث المحتوى', type: 'info' },
            { message: 'زائر جديد في الموقع', type: 'info' },
            { message: 'تحديث في قسم الأخبار', type: 'news' }
        ];

        if (Math.random() < 0.4) { // 40% احتمال
            const update = updates[Math.floor(Math.random() * updates.length)];
            this.addNotification(update.message, update.type);
        }
    }

    // إنشاء إشعار عشوائي
    generateRandomNotification() {
        const randomNotifications = [
            { message: 'شكراً لزيارتكم موقعنا', type: 'welcome' },
            { message: 'لا تفوتوا آخر الأخبار', type: 'info' },
            { message: 'تابعوا المناسبات القادمة', type: 'event' },
            { message: 'تم إضافة محتوى جديد', type: 'news' }
        ];

        const notification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        this.addNotification(notification.message, notification.type);
    }

    // فحص التحديثات
    checkForUpdates() {
        // محاكاة فحص التحديثات من الخادم
        console.log('فحص التحديثات...');
    }

    // مزامنة الإشعارات
    syncNotifications() {
        // محاكاة مزامنة الإشعارات مع الخادم
        console.log('مزامنة الإشعارات...');
    }

    // إعداد Service Worker للإشعارات
    setupServiceWorker() {
        if ('serviceWorker' in navigator && 'Notification' in window) {
            this.requestNotificationPermission();
        }
    }

    // طلب إذن الإشعارات
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('تم منح إذن الإشعارات');
            }
        } catch (error) {
            console.log('تعذر طلب إذن الإشعارات:', error);
        }
    }

    // إرسال إشعار نظام
    sendSystemNotification(title, message, options = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'sheikh-website',
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    }

    // اشتراك في الإشعارات
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    // إلغاء الاشتراك
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    // إشعار المشتركين
    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('خطأ في إشعار المشترك:', error);
            }
        });
    }

    // الحصول على الإشعارات غير المقروءة
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }

    // الحصول على عدد الإشعارات غير المقروءة
    getUnreadCount() {
        return this.getUnreadNotifications().length;
    }

    // تحديد إشعار كمقروء
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.notifySubscribers('read', notification);
        }
    }

    // تحديد جميع الإشعارات كمقروءة
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.notifySubscribers('readAll', this.notifications);
    }

    // حذف إشعار
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.notifySubscribers('delete', notificationId);
    }

    // حذف جميع الإشعارات
    clearAllNotifications() {
        this.notifications = [];
        this.saveNotifications();
        this.notifySubscribers('clearAll', null);
    }

    // الحصول على الإشعارات حسب النوع
    getNotificationsByType(type) {
        return this.notifications.filter(n => n.type === type);
    }

    // الحصول على الإشعارات حسب الفئة
    getNotificationsByCategory(category) {
        return this.notifications.filter(n => n.category === category);
    }

    // تحديث إعدادات النظام
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('sheikh_notification_settings', JSON.stringify(this.settings));
    }

    // تحميل الإعدادات
    loadSettings() {
        try {
            const stored = localStorage.getItem('sheikh_notification_settings');
            if (stored) {
                this.settings = { ...this.settings, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.warn('تعذر تحميل إعدادات الإشعارات:', error);
        }
    }
}

// إنشاء مثيل النظام العام
window.notificationSystem = new NotificationSystem();

// إضافة إشعارات خاصة بالموقع
document.addEventListener('DOMContentLoaded', function() {
    const system = window.notificationSystem;
    
    // إشعار ترحيبي
    setTimeout(() => {
        system.addNotification(
            'أهلاً وسهلاً بكم في موقع الشيخ ناجي صالح الحمداني',
            'welcome',
            { category: 'greeting', persistent: true }
        );
    }, 2000);

    // إشعارات دورية
    setTimeout(() => {
        system.addNotification(
            'لا تفوتوا آخر الأخبار والمناسبات',
            'info',
            { category: 'reminder' }
        );
    }, 30000);

    // ربط النظام بواجهة المستخدم
    system.subscribe((event, data) => {
        if (event === 'new' || event === 'readAll') {
            updateNotificationUI();
        }
    });
});

// تحديث واجهة المستخدم للإشعارات
function updateNotificationUI() {
    const system = window.notificationSystem;
    const countElement = document.getElementById('notification-count');
    const unreadCount = system.getUnreadCount();
    
    if (countElement) {
        countElement.textContent = unreadCount;
        countElement.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    // تحديث قائمة الإشعارات إذا كانت مفتوحة
    const notificationList = document.getElementById('notification-list');
    if (notificationList && notificationList.style.display !== 'none') {
        updateNotificationListUI();
    }
}

// تحديث قائمة الإشعارات في الواجهة
function updateNotificationListUI() {
    const system = window.notificationSystem;
    const notificationList = document.getElementById('notification-list');
    
    if (!notificationList) return;

    const notifications = system.notifications.slice(0, 20); // أحدث 20 إشعار
    
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-bell-slash" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>لا توجد إشعارات</p>
            </div>
        `;
        return;
    }

    notificationList.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
             data-id="${notification.id}"
             style="
                padding: 16px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: all 0.3s ease;
                background: ${notification.read ? 'white' : '#f8f9ff'};
                border-right: ${notification.read ? 'none' : '3px solid #2196F3'};
             "
             onclick="handleNotificationClick('${notification.id}')">
            <div style="display: flex; align-items: start; gap: 12px;">
                <div style="color: ${getNotificationTypeColor(notification.type)}; font-size: 18px; margin-top: 2px;">
                    ${getNotificationIcon(notification.type)}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                        <span style="
                            background: ${getNotificationTypeColor(notification.type)};
                            color: white;
                            padding: 2px 8px;
                            border-radius: 12px;
                            font-size: 11px;
                            font-weight: 500;
                        ">${getNotificationTypeLabel(notification.type)}</span>
                        <small style="color: #999; font-size: 11px;">
                            ${formatNotificationTime(notification.timestamp)}
                        </small>
                    </div>
                    <p style="
                        margin: 0;
                        color: #333;
                        font-size: 14px;
                        line-height: 1.4;
                        font-weight: ${notification.read ? '400' : '500'};
                    ">${notification.message}</p>
                    ${notification.actionUrl ? `
                        <a href="${notification.actionUrl}" 
                           style="
                               color: ${getNotificationTypeColor(notification.type)};
                               font-size: 12px;
                               text-decoration: none;
                               margin-top: 8px;
                               display: inline-block;
                           ">عرض التفاصيل →</a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// معالجة النقر على الإشعار
function handleNotificationClick(notificationId) {
    const system = window.notificationSystem;
    system.markAsRead(notificationId);
    updateNotificationUI();
}

// تنسيق وقت الإشعار
function formatNotificationTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} د`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} س`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} ي`;
    
    return new Date(timestamp).toLocaleDateString('ar-EG');
}

// تصدير النظام للاستخدام العام
window.addNotification = (message, type, options) => {
    return window.notificationSystem.addNotification(message, type, options);
};

window.markAllNotificationsAsRead = () => {
    window.notificationSystem.markAllAsRead();
    updateNotificationUI();
};

window.clearAllNotifications = () => {
    window.notificationSystem.clearAllNotifications();
    updateNotificationUI();
};

