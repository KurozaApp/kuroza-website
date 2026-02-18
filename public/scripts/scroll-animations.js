/**
 * Scroll-Based Fade Animation
 * Triggers fade-in and upward translate animations when elements enter the viewport
 * Uses Intersection Observer for optimal performance
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            // Add visible class when element enters viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Only trigger once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeInElements = document.querySelectorAll('.fade-in, section');
    fadeInElements.forEach(element => {
        // Skip sections that are already visible (hero section)
        if (!element.classList.contains('visible')) {
            observer.observe(element);
        }
    });
});
