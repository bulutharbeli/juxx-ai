import { Application } from '@splinetool/runtime';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Robo Labs AI Agency Site Initialized');

    // UI Elements
    const heroMainTitle = document.querySelector('.hero-main-title');
    const heroBgText = document.querySelector('.hero-bg-text');
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const progressBar = document.querySelector('.scroll-progress');
    const canvas = document.getElementById('canvas3d');
    const loader = document.getElementById('loader-3d');

    // Initialize Spline
    let splineApp = null;
    if (canvas) {
        splineApp = new Application(canvas);
        splineApp.load('https://prod.spline.design/H25fbR-s-k6IA02N/scene.splinecode')
            .then(() => {
                console.log('3D Robot Scene Loaded');
                // Fade out loader and show canvas
                if (loader) loader.classList.add('fade-out');
                canvas.classList.add('loaded');

                // Initialize internal states if needed
                initSplineInteractions();
            })
            .catch(err => {
                console.error('Failed to load Spline scene:', err);
                if (loader) loader.style.display = 'none';
            });
    }

    function initSplineInteractions() {
        const allObjects = splineApp.getAllObjects();

        const head = splineApp.findObjectByName('Head') ||
            splineApp.findObjectByName('head') ||
            allObjects.find(o => o.name.toLowerCase().includes('head'));

        const body = splineApp.findObjectByName('Robot') ||
            splineApp.findObjectByName('robot') ||
            splineApp.findObjectByName('Group');

        if (head || body) {
            let targetX = 0;
            let targetY = 0;
            let currentX = 0;
            let currentY = 0;
            const lerpSpeed = 0.15; // Increased for higher responsiveness

            window.addEventListener('mousemove', (e) => {
                targetX = (e.clientX / window.innerWidth) * 2 - 1;
                targetY = (e.clientY / window.innerHeight) * 2 - 1;
            });

            function update() {
                // Smoothing the movement (lerp) per refresh frame
                currentX += (targetX - currentX) * lerpSpeed;
                currentY += (targetY - currentY) * lerpSpeed;

                if (head) {
                    head.rotation.y = currentX * 1.5;
                    head.rotation.x = currentY * 0.8;
                }

                if (body) {
                    body.rotation.y = currentX * 0.4;
                    body.rotation.x = currentY * 0.2;
                }

                requestAnimationFrame(update);
            }
            update();

            window.addEventListener('scroll', () => {
                const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                const mainTarget = body || head;
                if (mainTarget) {
                    mainTarget.position.y = -scrollPercent * 400;
                }
            });
        }
    }

    // Global Mouse Move (Cursor + UI Parallax)
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Custom Cursor
        if (cursor && follower) {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            follower.style.transform = `translate3d(${mouseX - 16}px, ${mouseY - 16}px, 0)`;
        }

        // Parallax for Text
        const relX = mouseX / window.innerWidth - 0.5;
        const relY = mouseY / window.innerHeight - 0.5;

        if (heroMainTitle) {
            heroMainTitle.style.transform = `translate(${relX * 20}px, ${relY * 20}px)`;
        }

        if (heroBgText) {
            heroBgText.style.transform = `translate(calc(-50% + ${relX * 50}px), calc(-50% + ${relY * 50}px))`;
        }
    });

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });

    // Cursor Hover Effects
    const links = document.querySelectorAll('a, button, .service-card, .solution-item');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            follower.style.transform += ' scale(2)';
            follower.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        link.addEventListener('mouseleave', () => {
            follower.style.transform = follower.style.transform.replace(' scale(2)', '');
            follower.style.background = 'transparent';
        });
    });

    // Scroll Reveal Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));
});
