// ============================================================
// Layer 3: SaaS Data Network Canvas Animation
// Elegant, slow-moving nodes with cursor interaction
// ============================================================
const canvas = document.getElementById('data-network');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: -9999, y: -9999 }; // Start off-screen

// --- Configuration ---
const CONFIG = {
    particleCount: 60,
    connectionDistance: 180,
    speed: 0.18,
    minRadius: 1.5,
    maxRadius: 4,
    repelRadius: 120,
    repelStrength: 0.8,
    nodeColor1: '37, 99, 235', // Electric Blue
    nodeColor2: '6, 182, 212',  // Neon Cyan
    accentColor: '139, 92, 246', // Soft Purple
};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        const angle = Math.random() * Math.PI * 2;
        const speed = CONFIG.speed * (Math.random() * 0.5 + 0.5);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius;
        this.isHub = Math.random() < 0.15;
        if (this.isHub) {
            this.radius = CONFIG.maxRadius * 1.5;
            this.colorRgb = CONFIG.accentColor;
        } else {
            this.colorRgb = Math.random() > 0.5 ? CONFIG.nodeColor1 : CONFIG.nodeColor2;
        }
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.repelRadius && dist > 0) {
            const force = (CONFIG.repelRadius - dist) / CONFIG.repelRadius;
            this.vx += (dx / dist) * force * CONFIG.repelStrength * 0.05;
            this.vy += (dy / dist) * force * CONFIG.repelStrength * 0.05;
        }

        this.vx *= 0.99;
        this.vy *= 0.99;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
    }

    draw() {
        if (this.isHub) {
            const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
            glow.addColorStop(0, `rgba(${this.colorRgb}, 0.4)`);
            glow.addColorStop(1, `rgba(${this.colorRgb}, 0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colorRgb}, ${this.opacity})`;
        ctx.fill();
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.connectionDistance) {
                const opacity = (1 - distance / CONFIG.connectionDistance) * 0.25;
                const gradient = ctx.createLinearGradient(
                    particles[i].x, particles[i].y,
                    particles[j].x, particles[j].y
                );
                gradient.addColorStop(0, `rgba(${particles[i].colorRgb}, ${opacity})`);
                gradient.addColorStop(1, `rgba(${particles[j].colorRgb}, ${opacity})`);

                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = particles[i].isHub || particles[j].isHub ? 1.5 : 0.8;
                ctx.stroke();
            }
        }
    }
}

function initCanvas() {
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new Particle());
    }

    animateCanvas();
}

function animateCanvas() {
    requestAnimationFrame(animateCanvas);
    ctx.clearRect(0, 0, width, height);
    drawConnections();
    particles.forEach(p => {
        p.update();
        p.draw();
    });
}

// ============================================================
// NEXT-GEN INTERACTION SYSTEM (CURSOR, ORB, MAGNETIC BUTTONS)
// ============================================================

function initNextGenInteractions() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const glowOrb = document.querySelector('.bg-glow-orb');
    
    // Check if elements exist (in case of mobile hide/removal)
    if (!cursorDot || !cursorOutline || !glowOrb) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant update for dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Update glow orb position with slight offset
        glowOrb.style.left = `${mouseX}px`;
        glowOrb.style.top = `${mouseY}px`;
    });
    
    // Animate outline with slight delay for smooth trailing effect
    const animateCursor = () => {
        const dx = mouseX - outlineX;
        const dy = mouseY - outlineY;
        
        outlineX += dx * 0.15; // easing factor
        outlineY += dy * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover states for actionable elements
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .project-card, .dashboard-tile, .filter-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover-active');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover-active');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Magnetic Button Physics
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate distance from center of element
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move item based on mouse pos inside it (limited pull)
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            // Reset position when mouse leaves
            btn.style.transform = 'translate(0px, 0px)';
            // Smooth transition handled by CSS
        });
    });
}

// ============================================================
// UI INTERACTION SYSTEM
// ============================================================

// --- 1. Scroll Progress Bar ---
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
}

// --- 2. Active Nav Section Highlighting ---
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksEl = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');

    if (!navLinksEl) return;

    // Inject the sliding ink bar once (only for desktop nav)
    const ink = document.createElement('span');
    ink.id = 'nav-ink';
    // nav-links needs position:relative for the ink's absolute positioning
    navLinksEl.style.position = 'relative';
    navLinksEl.appendChild(ink);

    // Move the ink bar to the given link element
    function moveInk(linkEl) {
        // On mobile the nav is a slide-in panel — hide the ink bar there
        if (window.innerWidth <= 1024) {
            ink.classList.remove('visible');
            return;
        }
        const navRect = navLinksEl.getBoundingClientRect();
        const linkRect = linkEl.getBoundingClientRect();
        ink.style.left = (linkRect.left - navRect.left) + 'px';
        ink.style.width = linkRect.width + 'px';
        ink.classList.add('visible');
    }

    function setActiveLink(id) {
        let activeLink = null;
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('data-section') === id) {
                link.classList.add('active-link');
                activeLink = link;
            }
        });
        if (activeLink) moveInk(activeLink);
    }

    // Scroll spy via IntersectionObserver
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.getAttribute('id'));
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -40% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    // Reposition ink on window resize (e.g. font scaling, zoom)
    window.addEventListener('resize', () => {
        const activeLink = navLinksEl.querySelector('.active-link');
        if (activeLink) moveInk(activeLink);
    });
}

// --- 3. Hamburger Menu ---
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const overlay = document.getElementById('mobile-nav-overlay');

    if (!hamburger || !navLinks) return;

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('mobile-open');
        if (isOpen) {
            closeMenu();
        } else {
            hamburger.classList.add('active');
            navLinks.classList.add('mobile-open');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// --- 4. Scroll Reveal (Fade In Up + Stagger) ---
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If it's a stat card, trigger the counter
                if (entry.target.classList.contains('stat-card')) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter && !counter.classList.contains('counted')) {
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                }
            }
        });
    }, observerOptions);

    // Observe fade-in-up elements
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // Observe stagger elements (hero)
    document.querySelectorAll('.stagger').forEach(el => observer.observe(el));

    // Observe timeline items for dot pulse
    document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            el.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            el.innerText = target;
        }
    };
    updateCounter();
}



// --- 8. GitHub Mock Heatmap ---
function initGitHubHeatmap() {
    const heatmapGrid = document.getElementById('github-heatmap');
    if (!heatmapGrid) return;

    // Generate 364 days (52 weeks * 7 days)
    const totalDays = 364;
    
    // Simulate a realistic commit pattern (more empty days, sporadic high activity)
    for (let i = 0; i < totalDays; i++) {
        const square = document.createElement('div');
        
        // Randomly assign a contribution level (0 to 4)
        // Weighted random: mostly 0s, fewer 1s and 2s, rare 3s and 4s
        let level = 0;
        const rand = Math.random();
        
        if (rand > 0.95) {
            level = 4; // Top 5% of days are super active
        } else if (rand > 0.85) {
            level = 3; 
        } else if (rand > 0.70) {
            level = 2;
        } else if (rand > 0.50) {
            level = 1;
        }
        
        square.className = `contribution-sq level-${level}`;
        
        // Optional tooltip data
        // square.setAttribute('data-tooltip', `${Math.floor(Math.random() * 10)} contributions on this day`);
        // square.classList.add('tooltip-container');
        
        heatmapGrid.appendChild(square);
    }
}

// --- 9. Featured Insight Chart Animation ---
function initChartAnimation() {

    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                insightVisual.classList.add('chart-animated');
                chartObserver.unobserve(insightVisual);
            }
        });
    }, { threshold: 0.3 });

    chartObserver.observe(insightVisual);
}

// --- 9. Project Filtering ---
function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    if (card.classList.contains(filterValue)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// --- 10. Keyboard Shortcuts (Escape to close modals) ---
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open project detail
            document.querySelectorAll('.project-detail.active').forEach(d => {
                d.classList.remove('active');
            });
            // Close lightbox
            const lightbox = document.getElementById('dashboard-lightbox');
            if (lightbox) lightbox.classList.remove('active');
            // Restore scrolling
            document.body.style.overflow = '';
        }
    });
}


// --- 11. EmailJS Contact Form ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const formStatus = document.getElementById('form-status');

    if (!form || !submitBtn || !formStatus) return;

    // ============================================================
    // IMPORTANT: Replace these with your real EmailJS credentials
    //   1. Sign up at https://www.emailjs.com/ (free tier: 200 emails/month)
    //   2. Add an Email Service (Gmail) → copy the Service ID
    //   3. Create an Email Template with variables: {{from_name}}, {{reply_to}}, {{message}}
    //   4. Copy your Public Key from Account > API Keys
    // ============================================================
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';     // ← Replace
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';     // ← Replace
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';   // ← Replace

    // Initialise EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Spam throttle: minimum 30 seconds between submissions
    let lastSubmitTime = 0;

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status visible ' + type;
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Spam throttle check
        const now = Date.now();
        if (now - lastSubmitTime < 30000) {
            showStatus('Please wait before sending another message.', 'error');
            return;
        }

        // Disable button while sending
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Send via EmailJS
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
            .then(() => {
                showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                lastSubmitTime = Date.now();
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                showStatus('Something went wrong. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    });
}

// ============================================================
// 12. THEME TOGGLE (DARK/LIGHT MODE)
// ============================================================

function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    
    const icon = themeBtn.querySelector('i');
    
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.setAttribute('data-theme', 'light');
        icon.classList.replace('fa-moon', 'fa-sun');
        updateCanvasTheme('light');
    } else {
        document.body.removeAttribute('data-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
        updateCanvasTheme('dark');
    }

    // Toggle event listener with animation handling
    themeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add quick rotation animation class
        icon.style.transform = 'rotate(360deg) scale(0)';
        
        setTimeout(() => {
            const isLightMode = document.body.getAttribute('data-theme') === 'light';
            
            if (isLightMode) {
                // Switch to Dark
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                icon.classList.replace('fa-sun', 'fa-moon');
                updateCanvasTheme('dark');
            } else {
                // Switch to Light
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                icon.classList.replace('fa-moon', 'fa-sun');
                updateCanvasTheme('light');
            }
            
            // Pop back in
            icon.style.transform = 'rotate(0deg) scale(1)';
        }, 150); // Mid-point of animation
    });
}

function updateCanvasTheme(theme) {
    if (theme === 'light') {
        CONFIG.nodeColor1 = '37, 99, 235'; // Primary Blue
        CONFIG.nodeColor2 = '8, 145, 178';   // Cyan
    } else {
        CONFIG.nodeColor1 = '6, 182, 212';   // Neon Cyan
        CONFIG.nodeColor2 = '139, 92, 246';  // Purple
    }
    // Re-initialize particles to grab new colors immediately
    if (typeof particles !== 'undefined' && particles.length > 0) {
        particles.forEach(p => {
            p.colorRgb = Math.random() > 0.5 ? CONFIG.nodeColor1 : CONFIG.nodeColor2;
        });
    }
}

// ============================================================
// INITIALISE EVERYTHING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initNextGenInteractions();
    initCanvas();
    initScrollProgress();
    initActiveNav();
    initHamburgerMenu();
    initScrollReveal();
    initGitHubHeatmap();
    initChartAnimation();
    initKeyboardShortcuts();
    initContactForm();
    initThemeToggle();
});

// ============================================================
// ============================================================
// 13. PROJECT FILTER & MODAL SYSTEM
// ============================================================

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            projectCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.classList.remove('hide');
                    // Add a small delay for animation if needed, but display:none/block is instant
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal?.querySelector('.close-modal');
    const tabs = modal?.querySelectorAll('.modal-tab');
    const panes = modal?.querySelectorAll('.modal-pane');
    const projectCards = document.querySelectorAll('.project-card');

    if (!modal || !closeBtn) return;

    // --- Tab Switching Logic ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${target}`) pane.classList.add('active');
            });
        });
    });

    // --- Modal Control ---
    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Trigger modal on project card click
    projectCards.forEach(card => {
        card.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

// Initialise systems
initProjectFilters();
initProjectModal();
