document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');

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

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

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

    // --- Dot Navigation Active State Tracking ---
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.dot-nav');

    const navObserverOptions = {
        threshold: 0.5
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                navDots.forEach(dot => {
                    dot.classList.remove('active', 'bg-primary');
                    if(dot.classList.contains('dark:bg-gray-600')) {
                        dot.classList.add('bg-gray-300'); // reset
                    }
                    if (dot.getAttribute('data-target') === targetId) {
                        dot.classList.add('active', 'bg-primary');
                        dot.classList.remove('bg-gray-300', 'dark:bg-gray-600');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

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