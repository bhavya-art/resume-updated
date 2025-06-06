/* 
==============================================
RESUMIX HOME PAGE FUNCTIONALITY
==============================================
Handles carousel, animations, and interactions
==============================================
*/

// Global variables
let currentSlide = 0;
const totalSlides = 4;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeAnimations();
    initializeSmoothScroll();
});

/* 
==============================================
CAROUSEL FUNCTIONALITY
==============================================
*/

function initializeCarousel() {
    // Auto-play carousel
    setInterval(() => {
        moveCarousel(1);
    }, 5000); // Change slide every 5 seconds
    
    // Update carousel on window resize
    window.addEventListener('resize', updateCarouselPosition);
}

function moveCarousel(direction) {
    const carousel = document.getElementById('templateCarousel');
    const indicators = document.querySelectorAll('.indicator');
    
    // Update current slide
    currentSlide += direction;
    
    // Loop around
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    // Move carousel
    updateCarouselPosition();
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(slideIndex) {
    const carousel = document.getElementById('templateCarousel');
    const indicators = document.querySelectorAll('.indicator');
    
    currentSlide = slideIndex;
    updateCarouselPosition();
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function updateCarouselPosition() {
    const carousel = document.getElementById('templateCarousel');
    const translateX = -currentSlide * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
}

/* 
==============================================
SCROLL ANIMATIONS
==============================================
*/

function initializeAnimations() {
    // Initial check for visible elements
    handleScrollAnimations();
    
    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Observe all animated elements
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }
}

function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

/* 
==============================================
SMOOTH SCROLLING
==============================================
*/

function initializeSmoothScroll() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* 
==============================================
TEMPLATE SELECTION
==============================================
*/

function selectTemplate(templateType) {
    // Store selected template in localStorage
    localStorage.setItem('selectedTemplate', templateType);
    
    // Navigate to builder with template parameter
    window.location.href = `builder.html?template=${templateType}`;
}

/* 
==============================================
INTERACTIVE FEATURES
==============================================
*/

// Add hover effects to feature cards
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Template card interactions
document.addEventListener('DOMContentLoaded', function() {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            const template = this.dataset.template;
            if (template) {
                selectTemplate(template);
            }
        });
    });
});

/* 
==============================================
PERFORMANCE OPTIMIZATIONS
==============================================
*/

// Throttle scroll events for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll handler
window.addEventListener('scroll', throttle(handleScrollAnimations, 100));

/* 
==============================================
ACCESSIBILITY IMPROVEMENTS
==============================================
*/

// Keyboard navigation for carousel
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        moveCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        moveCarousel(1);
    }
});

// Focus management for carousel buttons
document.querySelectorAll('.carousel-btn, .indicator').forEach(button => {
    button.addEventListener('focus', function() {
        this.style.outline = '2px solid #BBA58F';
    });
    
    button.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Pause carousel on hover
document.querySelector('.carousel-container').addEventListener('mouseenter', function() {
    // Clear auto-play interval when hovering
    clearInterval(window.carouselInterval);
});

document.querySelector('.carousel-container').addEventListener('mouseleave', function() {
    // Restart auto-play when not hovering
    window.carouselInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000);
});

/* 
==============================================
LAZY LOADING FOR IMAGES
==============================================
*/

function initializeLazyLoading() {
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

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/* 
==============================================
EASTER EGGS AND FUN INTERACTIONS
==============================================
*/

// Konami code easter egg
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Fun animation when konami code is entered
    document.body.style.animation = 'rainbow 2s infinite';
    
    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
        document.head.removeChild(style);
    }, 5000);
    
    // Show fun message
    showToast('🎉 You found the secret! Enjoy the rainbow!');
}

// Toast notification system
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #223030;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInToast 0.3s ease;
        font-weight: bold;
    `;
    toast.textContent = message;
    
    // Add slide-in animation
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes slideInToast {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutToast {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(toastStyle);
    
    document.body.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.style.animation = 'slideOutToast 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            if (toastStyle.parentNode) {
                toastStyle.parentNode.removeChild(toastStyle);
            }
        }, 300);
    }, duration);
}

/* 
==============================================
ANALYTICS AND TRACKING
==============================================
*/

// Track template selections
function trackTemplateSelection(templateType) {
    // In a real app, you'd send this to your analytics service
    console.log(`Template selected: ${templateType}`);
    
    // Store in localStorage for analytics
    const selections = JSON.parse(localStorage.getItem('templateSelections') || '[]');
    selections.push({
        template: templateType,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('templateSelections', JSON.stringify(selections));
}

// Track page interactions
function trackInteraction(action, element) {
    console.log(`User interaction: ${action} on ${element}`);
}

// Add click tracking to important elements
document.addEventListener('DOMContentLoaded', function() {
    // Track CTA button clicks
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            trackInteraction('click', 'cta-button');
        });
    });
    
    // Track template button clicks
    document.querySelectorAll('.template-btn').forEach(button => {
        button.addEventListener('click', () => {
            trackInteraction('click', 'template-button');
        });
    });
});

/* 
==============================================
MOBILE TOUCH GESTURES
==============================================
*/

function initializeTouchGestures() {
    let startX = 0;
    let startY = 0;
    
    const carousel = document.querySelector('.carousel-container');
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    carousel.addEventListener('touchend', function(e) {
        if (!startX || !startY) {
            return;
        }
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = startX - endX;
        const deltaY = startY - endY;
        
        // Check if horizontal swipe is more significant than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > 50) { // Minimum swipe distance
                if (deltaX > 0) {
                    // Swipe left - next slide
                    moveCarousel(1);
                } else {
                    // Swipe right - previous slide
                    moveCarousel(-1);
                }
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

// Initialize touch gestures when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTouchGestures);

/* 
==============================================
BROWSER COMPATIBILITY CHECKS
==============================================
*/

function checkBrowserCompatibility() {
    // Check for required features
    const features = {
        'CSS Grid': 'grid' in document.createElement('div').style,
        'CSS Flexbox': 'flex' in document.createElement('div').style,
        'IntersectionObserver': 'IntersectionObserver' in window,
        'LocalStorage': 'localStorage' in window
    };
    
    const unsupported = Object.entries(features)
        .filter(([name, supported]) => !supported)
        .map(([name]) => name);
    
    if (unsupported.length > 0) {
        console.warn('Unsupported features:', unsupported);
        // You could show a compatibility warning here
    }
}

// Run compatibility check
document.addEventListener('DOMContentLoaded', checkBrowserCompatibility);

/* 
==============================================
INITIALIZATION
==============================================
*/

// Main initialization function
function init() {
    console.log('🚀 Resumix Home Page Initialized');
    
    // Initialize all components
    initializeCarousel();
    initializeAnimations();
    initializeSmoothScroll();
    initializeLazyLoading();
    
    // Show welcome message for first-time visitors
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            showToast('👋 Welcome to Resumix! Start building your perfect resume.', 4000);
        }, 2000);
        localStorage.setItem('hasVisited', 'true');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}