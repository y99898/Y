// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Add scroll animation class to elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.about-card, .news-card, .achievement-card, .service-card, .gallery-item, .timeline-item, .contact-item');
    
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Gallery lightbox effect
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Close lightbox
        lightbox.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
            }
        });
    });
});

// Add lightbox styles
const lightboxStyles = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox img {
        width: 100%;
        height: auto;
        border-radius: 10px;
    }
    
    .lightbox .close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .lightbox .close:hover {
        color: #d4af37;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);

// Back to top button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%);
    color: white;
    font-size: 18px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(45, 90, 39, 0.3);
`;

document.body.appendChild(backToTopButton);

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

// Back to top functionality
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'translateY(-3px)';
    backToTopButton.style.boxShadow = '0 8px 25px rgba(45, 90, 39, 0.4)';
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'translateY(0)';
    backToTopButton.style.boxShadow = '0 4px 15px rgba(45, 90, 39, 0.3)';
});

// Preloader
document.addEventListener('DOMContentLoaded', () => {
    // Create preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="spinner"></div>
            <h3>الحقوقي بركات الشيخ علي مضعن الحمداني</h3>
            <p>جاري التحميل...</p>
        </div>
    `;
    
    // Add preloader styles
    const preloaderStyles = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
            color: white;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid #d4af37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .preloader h3 {
            font-family: 'Amiri', serif;
            margin-bottom: 10px;
            font-size: 1.5rem;
        }
        
        .preloader p {
            opacity: 0.8;
        }
    `;
    
    const preloaderStyleSheet = document.createElement('style');
    preloaderStyleSheet.textContent = preloaderStyles;
    document.head.appendChild(preloaderStyleSheet);
    
    document.body.appendChild(preloader);
    
    // Hide preloader when page is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 1000);
    });
});

// Initialize all animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Add stagger animation to cards
    const cards = document.querySelectorAll('.news-card, .achievement-card, .service-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add floating animation to hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Add touch-specific styles
    const touchStyles = `
        .touch-device .btn:hover {
            transform: none;
        }
        
        .touch-device .nav-link:hover {
            transform: none;
        }
        
        .touch-device .achievement-card:hover,
        .touch-device .service-card:hover,
        .touch-device .news-card:hover {
            transform: none;
        }
    `;
    
    const touchStyleSheet = document.createElement('style');
    touchStyleSheet.textContent = touchStyles;
    document.head.appendChild(touchStyleSheet);
}

