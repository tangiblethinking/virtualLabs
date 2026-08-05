document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        if (htmlElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    });

    // --- Scroll Progress Bar (visual + interactive) ---
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');

    function updateProgressBar() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + "%";
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();

    // Click progress bar to jump to that scroll position
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            window.scrollTo({
                top: percentage * scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // --- Scroll Reveal Animations ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Run once
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // --- Dot Navigation: always visible, blue = active section, grey = inactive ---
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.dot-nav');

    // Click → smooth scroll to section (avoids base-href 404)
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Helper: set only the matching dot to active (CSS handles blue/grey)
    function setActiveDot(targetId) {
        navDots.forEach(dot => {
            if (dot.getAttribute('data-target') === targetId) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Track which section is most visible and update dots
    const navObserverOptions = {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-10% 0px -10% 0px"
    };

    let currentActiveId = null;

    const navObserver = new IntersectionObserver((entries) => {
        // Prefer the entry with the highest intersection ratio that is intersecting
        let best = null;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!best || entry.intersectionRatio > best.intersectionRatio) {
                    best = entry;
                }
            }
        });
        if (best) {
            const targetId = best.target.getAttribute('id');
            if (targetId && targetId !== currentActiveId) {
                currentActiveId = targetId;
                setActiveDot(targetId);
            }
        }
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Also update active dot on scroll end / initial load via scroll position
    // (covers cases where observer alone is ambiguous between sections)
    function updateActiveDotFromScroll() {
        const scrollPos = window.scrollY + window.innerHeight * 0.35;
        let activeSection = null;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                activeSection = section;
            }
        });
        // Fallback: last section if near bottom
        if (!activeSection && sections.length) {
            const last = sections[sections.length - 1];
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
                activeSection = last;
            }
        }
        if (activeSection) {
            const id = activeSection.getAttribute('id');
            if (id && id !== currentActiveId) {
                currentActiveId = id;
                setActiveDot(id);
            }
        }
    }

    window.addEventListener('scroll', updateActiveDotFromScroll, { passive: true });
    updateActiveDotFromScroll();

    // --- Accordion Logic ---
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        const icon = acc.querySelector('.icon');
        
        header.addEventListener('click', () => {
            const isOpen = acc.classList.contains('open');
            
            // Close all others (optional: remove if you want multiple open at once)
            accordions.forEach(otherAcc => {
                otherAcc.classList.remove('open');
                otherAcc.querySelector('.accordion-content').classList.add('hidden');
                otherAcc.querySelector('.icon').classList.remove('rotate-180');
            });

            if (!isOpen) {
                acc.classList.add('open');
                acc.querySelector('.accordion-content').classList.remove('hidden');
                icon.classList.add('rotate-180');
            }
        });
    });

    // --- Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active states
            tabBtns.forEach(b => {
                b.classList.remove('active', 'text-primary', 'border-primary');
                b.classList.add('text-gray-500', 'dark:text-gray-400', 'border-transparent');
            });
            tabContents.forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('active');
            });

            // Add active state to clicked tab
            btn.classList.add('active', 'text-primary', 'border-primary');
            btn.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-transparent');
            
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            targetContent.classList.remove('hidden');
            // Slight delay to re-trigger css animation
            setTimeout(() => {
                targetContent.classList.add('active');
            }, 10);
        });
    });

    // --- Before/After Media Slider ---
    const mediaSlider = document.getElementById('media-slider');
    const beforeImg = document.getElementById('before-img');
    const sliderLine = document.getElementById('slider-line');

    if (mediaSlider && beforeImg && sliderLine) {
        mediaSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            // Adjust clip path for the foreground image
            beforeImg.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
            // Move the white line indicator
            sliderLine.style.left = `${val}%`;
        });
    }

});
