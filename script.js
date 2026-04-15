document.addEventListener('DOMContentLoaded', () => {
    // 1. Color Extraction
    const sourceImage = document.getElementById('source-image');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    const rgbToCss = (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

    const extractColors = () => {
        try {
            const colorThief = new ColorThief();
            // Get dominant color & palette
            const dominantColor = colorThief.getColor(sourceImage);
            const palette = colorThief.getPalette(sourceImage, 5);
            
            // Adjust the CSS variables with extracted colors 
            // We use the dominant color as the primary accent block if needed, but since it's elegant architecture,
            // we will gently apply it to the accent variables.
            document.documentElement.style.setProperty('--color-primary', rgbToCss(dominantColor));
            
            if (palette && palette.length > 1) {
                document.documentElement.style.setProperty('--color-accent', rgbToCss(palette[1]));
            }

            // Reveal site
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                loadingOverlay.style.visibility = 'hidden';
            }, 600);

        } catch (error) {
            console.error("Color extraction issue. Falling back to default styling.", error);
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.visibility = 'hidden';
        }
    };

    if (sourceImage.complete) {
        extractColors();
    } else {
        sourceImage.addEventListener('load', extractColors);
        sourceImage.addEventListener('error', () => {
             loadingOverlay.style.opacity = '0';
             loadingOverlay.style.visibility = 'hidden';
        });
    }

    // 2. Navigation
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Nav
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
        });
    });

    // 4. Scroll Intersections for Animations
    const faders = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-intersecting');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 5. Date
    document.getElementById('year').textContent = new Date().getFullYear();
});
