document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.page-section');
    const navbar = document.querySelector('.navbar');

    // === HAMBURGER MENU ===
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    function openDrawer() {
        hamburgerBtn.classList.add('open');
        mobileDrawer.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        hamburgerBtn.classList.remove('open');
        mobileDrawer.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeDrawer);
    }

    // Mobile nav link clicks
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            switchSection(targetId);
            history.pushState(null, null, `#${targetId}`);
            closeDrawer();
        });
    });

    function switchSection(targetId) {
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        mobileNavLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // Add active class to target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to matching nav links (desktop + mobile)
        const targetLink = document.querySelector(`.nav-links a[data-target="${targetId}"]`);
        if (targetLink) targetLink.classList.add('active');

        const targetMobileLink = document.querySelector(`.mobile-nav-links a[data-target="${targetId}"]`);
        if (targetMobileLink) targetMobileLink.classList.add('active');

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            switchSection(targetId);
            
            // update URL hash without jump
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // Make navigateTo function globally available for buttons
    window.navigateTo = switchSection;

    // Handle back/forward browser buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1) || 'beranda';
        switchSection(hash);
    });

    // Initial load check
    const initialHash = window.location.hash.substring(1);
    if(initialHash && document.getElementById(initialHash)) {
        switchSection(initialHash);
    }

    // Navbar Scroll Class Toggle
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- INTERACTIVE & ANIMATIONS ---

    // 1. Scroll Reveal using Intersection Observer
    const revealElements = document.querySelectorAll('.glass-card, .creative-card, .org-node, .modern-field-card, .image-text-card, .masonry-item');
    revealElements.forEach(el => el.classList.add('reveal')); // dynamically add base class

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Smooth 3D Tilt Effect on Hover (Vanilla JS)
    const tiltElements = document.querySelectorAll('.glass-card, .creative-card, .modern-field-card, .image-text-card .img-wrapper');
    
    tiltElements.forEach(card => {
        card.classList.add('interactive');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 8 degrees for smoother effect)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. Member Search Feature
    const searchInput = document.getElementById('member-search');
    const memberPills = document.querySelectorAll('.member-pill');
    
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            memberPills.forEach(pill => {
                const text = pill.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    pill.style.display = 'block';
                } else {
                    pill.style.display = 'none';
                }
            });
        });
    }

    // 4. Social Feed Tabs Switcher
    const socialTabBtns = document.querySelectorAll('.social-tab-btn');
    const socialFeedCards = document.querySelectorAll('.social-feed-card');
    
    socialTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feedType = btn.getAttribute('data-feed');
            
            // Toggle active class on buttons
            socialTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle visibility on feed cards
            socialFeedCards.forEach(card => {
                if (card.id === `feed-${feedType}`) {
                    card.style.display = 'block';
                    // Trigger dynamic reveal/entry animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }); // <-- properly closed forEach

    // 5. Lightbox Modal for Ogoh-Ogoh Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const masonryItems = document.querySelectorAll('.masonry-item');

    masonryItems.forEach(item => {
        item.style.cursor = 'pointer'; // Show pointer cursor on hover
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4');
            const desc = item.querySelector('p');
            
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                
                if (lightboxCaption && title) {
                    lightboxCaption.textContent = title.textContent;
                }
                
                // Show modal then trigger animation on next frame
                lightbox.style.display = 'flex';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        lightbox.classList.add('active');
                    });
                });
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 400);
            document.body.style.overflow = '';
        }
    }

    if (lightbox) {
        // Close on click close button
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        // Close on click outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
});

// 6. Ogoh-Ogoh Auto Slideshow on Kebudayaan page
(function() {
    const slides = [
        { src: 'assets/images/O2026.jpeg', year: '2026' },
        { src: 'assets/images/O2025.webp',    year: '2025' },
        { src: 'assets/images/O2024.webp',    year: '2024' },
        { src: 'assets/images/O2023.webp',    year: '2023' },
        { src: 'assets/images/O2020-2022.webp', year: '2020–2022' },
        { src: 'assets/images/O2019.webp',    year: '2019' },
        { src: 'assets/images/O2018.webp',    year: '2018' },
        { src: 'assets/images/O2017.webp',    year: '2017' },
        { src: 'assets/images/O2016.webp',    year: '2016' },
        { src: 'assets/images/O2015.webp',    year: '2015' },
        { src: 'assets/images/O2013.webp',    year: '2013' },
        { src: 'assets/images/O2012.webp',    year: '2012' },
        { src: 'assets/images/O2011.webp',    year: '2011' },
        { src: 'assets/images/O2010.webp',    year: '2010' },
        { src: 'assets/images/O2009.webp',    year: '2009' },
        { src: 'assets/images/O2008.webp',    year: '2008' },
        { src: 'assets/images/O2001.webp',    year: '2001' },
    ];

    let currentSlide = 0;

    function nextSlide() {
        const imgEl = document.getElementById('ogoh-slideshow-img');
        const yearEl = document.getElementById('ogoh-slideshow-year');
        if (!imgEl || !yearEl) return;

        // Fade out
        imgEl.style.opacity = '0';

        setTimeout(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            imgEl.src = slides[currentSlide].src;
            imgEl.alt = 'Ogoh-ogoh ' + slides[currentSlide].year;
            yearEl.textContent = slides[currentSlide].year;

            // Fade in after image loads
            imgEl.onload = () => { imgEl.style.opacity = '1'; };
            // Fallback in case image already cached
            if (imgEl.complete) imgEl.style.opacity = '1';
        }, 700); // match CSS transition duration
    }

    setInterval(nextSlide, 3500);
})();
