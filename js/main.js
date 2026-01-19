/**
 * OLSEN NORDBYGG - Main JavaScript
 * Snekker i Tromsø - Bygget for Nordnorske Forhold
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ----------------------------------------
    // Mobile Navigation Toggle
    // ----------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');

    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMobile.classList.toggle('active');

            // Update ARIA attribute
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMobile.contains(event.target)) {
                menuToggle.classList.remove('active');
                navMobile.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking a link
        const mobileLinks = navMobile.querySelectorAll('a');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMobile.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ----------------------------------------
    // Smooth Scroll for Anchor Links
    // ----------------------------------------
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ----------------------------------------
    // Contact Form Handling
    // ----------------------------------------
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Hide any previous messages
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                projectType: document.getElementById('projectType').value,
                description: document.getElementById('description').value.trim(),
                siteVisit: document.getElementById('siteVisit').checked
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.description) {
                showError('Vennligst fyll ut alle påkrevde felter.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showError('Vennligst oppgi en gyldig e-postadresse.');
                return;
            }

            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sender...';

            try {
                // Simulate form submission (replace with actual API call)
                // For production, integrate with Resend API or similar service
                await simulateFormSubmission(formData);

                // Show success message
                if (successMessage) {
                    successMessage.style.display = 'block';
                }

                // Reset form
                contactForm.reset();

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);
                showError('Noe gikk galt. Vennligst prøv igjen eller ring oss direkte.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });

        function showError(message) {
            if (errorMessage) {
                errorMessage.innerHTML = '<strong>Feil:</strong> ' + message;
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // Simulate form submission (replace with actual API integration)
        function simulateFormSubmission(data) {
            return new Promise((resolve, reject) => {
                // Simulate network delay
                setTimeout(() => {
                    // Log form data for debugging
                    console.log('Form submitted with data:', data);

                    // Simulate success (replace with actual API call)
                    resolve({ success: true });

                    // To simulate error, uncomment:
                    // reject(new Error('Simulated error'));
                }, 1500);
            });
        }
    }

    // ----------------------------------------
    // Project Category Filter
    // ----------------------------------------
    const categoryBtns = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (categoryBtns.length > 0 && projectCards.length > 0) {
        categoryBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryBtns.forEach(function(b) {
                    b.classList.remove('active');
                });

                // Add active class to clicked button
                this.classList.add('active');

                // Get selected category
                const category = this.textContent.toLowerCase();

                // Filter projects
                projectCards.forEach(function(card) {
                    if (category === 'alle') {
                        card.style.display = 'block';
                    } else {
                        const cardCategory = card.getAttribute('data-category');
                        if (cardCategory === category) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // ----------------------------------------
    // Header Scroll Effect
    // ----------------------------------------
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add shadow on scroll
            if (scrollTop > 10) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }

            lastScrollTop = scrollTop;
        });
    }

    // ----------------------------------------
    // Lazy Loading Images
    // ----------------------------------------
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ----------------------------------------
    // Click-to-Call Tracking (for analytics)
    // ----------------------------------------
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Track phone clicks (integrate with analytics if needed)
            console.log('Phone click tracked');

            // If using Google Analytics:
            // gtag('event', 'click', {
            //     'event_category': 'Contact',
            //     'event_label': 'Phone Call'
            // });
        });
    });

    // ----------------------------------------
    // Form Input Animations
    // ----------------------------------------
    const formInputs = document.querySelectorAll('.form-control');

    formInputs.forEach(function(input) {
        // Add focus class to parent on focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        // Remove focus class on blur if empty
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // ----------------------------------------
    // Scroll to Top on Page Load (for hash links)
    // ----------------------------------------
    if (window.location.hash) {
        setTimeout(function() {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // ----------------------------------------
    // Service Card Hover Effect Enhancement
    // ----------------------------------------
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ----------------------------------------
    // Console Easter Egg
    // ----------------------------------------
    console.log('%c🔨 Olsen Nordbygg', 'font-size: 24px; font-weight: bold; color: #1B4F72;');
    console.log('%cSnekker i Tromsø - Bygget for Nordnorske Forhold', 'font-size: 14px; color: #17A589;');
    console.log('%cKontakt oss: post@olsennordbygg.no', 'font-size: 12px; color: #666;');

});

// ----------------------------------------
// Resend API Integration (Production)
// ----------------------------------------
// Replace simulateFormSubmission with this function for production use
/*
async function sendFormToResend(formData) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_RESEND_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'noreply@olsennordbygg.no',
            to: 'post@olsennordbygg.no',
            subject: `Ny henvendelse fra ${formData.name}`,
            html: `
                <h2>Ny henvendelse fra nettsiden</h2>
                <p><strong>Navn:</strong> ${formData.name}</p>
                <p><strong>E-post:</strong> ${formData.email}</p>
                <p><strong>Telefon:</strong> ${formData.phone}</p>
                <p><strong>Adresse:</strong> ${formData.address || 'Ikke oppgitt'}</p>
                <p><strong>Type prosjekt:</strong> ${formData.projectType}</p>
                <p><strong>Beskrivelse:</strong></p>
                <p>${formData.description}</p>
                <p><strong>Ønsker befaring:</strong> ${formData.siteVisit ? 'Ja' : 'Nei'}</p>
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return response.json();
}
*/
