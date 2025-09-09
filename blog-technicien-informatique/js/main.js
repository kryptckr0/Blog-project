// Configuration et variables globales
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    activeClass: 'active',
    mobileBreakpoint: 768
};

// État de l'application
const state = {
    isMobile: false,
    currentSection: 'accueil'
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Fonction principale d'initialisation
function initializeApp() {
    initMobileMenu();
    initSmoothScrolling();
    initScrollSpy();
    initAnimations();
    initTypingEffect();
    checkMobileView();
    
    // Écouter les redimensionnements de fenêtre
    window.addEventListener('resize', debounce(checkMobileView, 250));
    window.addEventListener('scroll', debounce(updateScrollSpy, 100));
}

// Navigation mobile
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle(CONFIG.activeClass);
        navMenu.classList.toggle(CONFIG.activeClass);
    });
    
    // Fermer le menu mobile lors du clic sur un lien
    navMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            hamburger.classList.remove(CONFIG.activeClass);
            navMenu.classList.remove(CONFIG.activeClass);
        }
    });
    
    // Fermer le menu mobile lors du clic à l'extérieur
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove(CONFIG.activeClass);
            navMenu.classList.remove(CONFIG.activeClass);
        }
    });
}

// Défilement fluide
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                scrollToSection(targetSection);
            }
        });
    });
    
    // Boutons CTA du hero
    const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                scrollToSection(targetSection);
            }
        });
    });
}

// Fonction de défilement vers une section
function scrollToSection(targetSection) {
    const offsetTop = targetSection.offsetTop - CONFIG.scrollOffset;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// Spy de défilement pour mettre en évidence la section active
function initScrollSpy() {
    updateScrollSpy();
}

function updateScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + CONFIG.scrollOffset + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Mettre à jour les liens de navigation
    navLinks.forEach(link => {
        link.classList.remove(CONFIG.activeClass);
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add(CONFIG.activeClass);
        }
    });
    
    state.currentSection = currentSection;
}

// Animations au défilement
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.card, .blog-card, .pipeline-step, .skill-category');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Effet de frappe pour le code dans le hero
function initTypingEffect() {
    const codeElement = document.querySelector('.code-content code');
    if (!codeElement) return;
    
    const originalContent = codeElement.innerHTML;
    codeElement.innerHTML = '';
    
    // Délai avant de commencer l'effet
    setTimeout(() => {
        typeText(codeElement, originalContent, 0);
    }, 1000);
}

function typeText(element, text, index) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        setTimeout(() => {
            typeText(element, text, index + 1);
        }, 50);
    }
}

// Vérifier si on est en vue mobile
function checkMobileView() {
    state.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;
    
    // Adapter le comportement selon la vue
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (!state.isMobile && navMenu && hamburger) {
        navMenu.classList.remove(CONFIG.activeClass);
        hamburger.classList.remove(CONFIG.activeClass);
    }
}

// Utilitaire de debounce pour optimiser les performances
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

// Fonctionnalité de filtrage pour les articles de blog (extensible)
function initBlogFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Mettre à jour les boutons actifs
            filterButtons.forEach(btn => btn.classList.remove(CONFIG.activeClass));
            this.classList.add(CONFIG.activeClass);
            
            // Filtrer les articles
            blogCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    });
}

// Amélioration progressive - fonctionnalités avancées
function initAdvancedFeatures() {
    // Animation du compteur pour les statistiques (si présentes)
    initCounterAnimation();
    
    // Lazy loading des images
    initLazyLoading();
    
    // Thème sombre/clair (si implémenté)
    initThemeToggle();
}

// Animation des compteurs
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 16);
}

// Lazy loading des images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Toggle thème sombre/clair
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Sauvegarder la préférence
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark-theme' : '';
        localStorage.setItem('theme', currentTheme);
    });
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// Fonction utilitaire pour faire des requêtes AJAX (pour futures fonctionnalités)
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Erreur réseau'));
        };
        
        xhr.send(data ? JSON.stringify(data) : null);
    });
}

// Initialisation des fonctionnalités avancées une fois que la page est complètement chargée
window.addEventListener('load', function() {
    initAdvancedFeatures();
});

// Export des fonctions principales pour utilisation externe si nécessaire
window.BlogApp = {
    scrollToSection,
    updateScrollSpy,
    state,
    CONFIG
};
