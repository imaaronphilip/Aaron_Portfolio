/* ============================================================
   AARON PHILIP — PORTFOLIO JS
   Senior-developer grade — animations, interactions, polish
   ============================================================ */

/* ==================== STARFIELD CANVAS ==================== */
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(canvas.parentElement);
        this.resize();
        this.createStars();
        this.mouseX = 0;
        this.mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.w = rect.width;
        this.h = rect.height;
        this.createStars();
    }

    createStars() {
        const area = this.w * this.h;
        const count = Math.floor(area / 2000);
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                radius: Math.random() * 1.5 + 0.2,
                alpha: Math.random() * 0.8 + 0.1,
                alphaSpeed: (Math.random() - 0.5) * 0.015,
                alphaMin: Math.random() * 0.15 + 0.05,
                alphaMax: Math.random() * 0.6 + 0.3,
                drift: (Math.random() - 0.5) * 0.15,
                parallax: Math.random() * 0.4 + 0.05,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        for (const star of this.stars) {
            // Twinkle
            star.alpha += star.alphaSpeed;
            if (star.alpha >= star.alphaMax || star.alpha <= star.alphaMin) {
                star.alphaSpeed *= -1;
            }
            star.alpha = Math.max(star.alphaMin, Math.min(star.alphaMax, star.alpha));

            // Parallax drift
            star.x += star.drift - this.mouseX * star.parallax * 0.6;
            star.y += star.drift * 0.5 - this.mouseY * star.parallax * 0.4;

            // Wrap
            if (star.x > this.w + 5) star.x = -5;
            if (star.x < -5) star.x = this.w + 5;
            if (star.y > this.h + 5) star.y = -5;
            if (star.y < -5) star.y = this.h + 5;

            // Draw with soft glow for bigger stars
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            const color = `rgba(200, 200, 255, ${star.alpha})`;
            this.ctx.fillStyle = color;
            this.ctx.fill();

            if (star.radius > 1.1) {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(180, 180, 255, ${star.alpha * 0.08})`;
                this.ctx.fill();
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

/* ==================== CUSTOM CURSOR ==================== */
class Cursor {
    constructor() {
        this.dot = document.getElementById('cursor-dot');
        this.outline = document.getElementById('cursor-outline');
        if (!this.dot || !this.outline) return;

        this.dotX = 0;
        this.dotY = 0;
        this.outlineX = 0;
        this.outlineY = 0;
        this.mouseX = 0;
        this.mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        this.hoverTargets = 'a, button, .skill-card, .newsletter-gallery-item, .stat, .project-visual, input, textarea';
        this.initHoverTracking();
        this.animate();
    }

    initHoverTracking() {
        document.querySelectorAll(this.hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    animate() {
        // Dot: tight follow
        this.dotX += (this.mouseX - this.dotX) * 0.45;
        this.dotY += (this.mouseY - this.dotY) * 0.45;

        // Outline: laggy follow
        this.outlineX += (this.mouseX - this.outlineX) * 0.12;
        this.outlineY += (this.mouseY - this.outlineY) * 0.12;

        this.dot.style.transform = `translate(${this.dotX - 3}px, ${this.dotY - 3}px)`;
        this.outline.style.transform = `translate(${this.outlineX - 18}px, ${this.outlineY - 18}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

/* ==================== NAVIGATION ==================== */
class Navigation {
    constructor() {
        this.nav = document.getElementById('nav');
        this.toggle = document.getElementById('nav-toggle');
        this.menu = document.getElementById('mobile-menu');
        this.links = document.querySelectorAll('.nav-link, .mobile-link');
        this.lastScroll = 0;
        this.ticking = false;

        this.init();
    }

    init() {
        // Scroll behavior
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });

        // Mobile toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close mobile menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Active link on scroll
        this.initActiveLink();
    }

    onScroll() {
        this.lastScroll = window.scrollY;

        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateNav();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateNav() {
        const y = this.lastScroll;

        // Background on scroll
        if (y > 60) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        // Hide/show on direction
        if (y > 400 && y > this.prevY + 10) {
            this.nav.classList.add('hidden');
        } else if (y < this.prevY - 10) {
            this.nav.classList.remove('hidden');
        }
        this.prevY = y;

        // Active link
        this.updateActiveLink();
    }

    initActiveLink() {
        this.prevY = window.scrollY;
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 150;

        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop) {
                current = section.id;
            }
        });

        this.links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==================== COUNTER ANIMATION ==================== */
class Counter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-target]');
        this.observed = new Set();
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    this.animate(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(c => observer.observe(c));
    }

    animate(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2400;
        const start = performance.now();
        const startVal = 0;

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startVal + (target - startVal) * eased);
            el.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(step);
    }
}

/* ==================== SCROLL ANIMATIONS ==================== */
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.timelineItems = document.querySelectorAll('.timeline-content');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    // Stagger timeline items
                    if (entry.target.classList.contains('experience') || entry.target.id === 'experience') {
                        const items = entry.target.querySelectorAll('.timeline-content');
                        items.forEach((item, i) => {
                            setTimeout(() => {
                                item.classList.add('visible');
                            }, i * 180);
                        });
                    }
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px'
        });

        this.sections.forEach(s => observer.observe(s));
    }
}

/* ==================== SKILL CARD MOUSE GLOW ==================== */
class SkillCardGlow {
    constructor() {
        this.cards = document.querySelectorAll('.skill-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            });
        });
    }
}

/* ==================== PROJECT TILT EFFECT ==================== */
class ProjectTilt {
    constructor() {
        this.cards = document.querySelectorAll('.project-visual');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const tiltX = (y - 0.5) * -6;
                const tiltY = (x - 0.5) * 6;
                card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
                card.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }
}

/* ==================== CONTACT FORM ==================== */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const btn = this.form.querySelector('.btn-submit');
        const originalText = btn.querySelector('.btn-text').textContent;

        btn.querySelector('.btn-text').textContent = 'Message Sent!';
        btn.querySelector('.btn-icon').textContent = '✓';
        btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = originalText;
            btn.querySelector('.btn-icon').textContent = '→';
            btn.style.background = '';
            btn.style.pointerEvents = '';
            this.form.reset();
        }, 3000);
    }
}

/* ==================== LOADER ==================== */
class Loader {
    constructor() {
        this.loader = document.getElementById('loader');
        if (!this.loader) return;
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loader.classList.add('hidden');
            }, 2600);
        });
    }
}

/* ==================== SMOOTH SCROLL ==================== */
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

/* ==================== MAGNETIC HOVER (buttons) ==================== */
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translateY(-3px) translate(${x * 0.18}px, ${y * 0.18}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                setTimeout(() => { btn.style.transition = ''; }, 600);
            });
        });
    }
}

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
    // Loader
    new Loader();

    // Starfield
    const starfield = new Starfield(document.getElementById('starfield'));
    starfield.animate();

    // Cursor
    new Cursor();

    // Navigation
    new Navigation();

    // Counter
    new Counter();

    // Scroll animations
    new ScrollAnimations();

    // Skill card glow
    new SkillCardGlow();

    // Project tilt
    new ProjectTilt();

    // Contact form
    new ContactForm();

    // Smooth scroll
    new SmoothScroll();

    // Magnetic buttons
    new MagneticButtons();
});
