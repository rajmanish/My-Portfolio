/*
==========================================================================
PORTFOLIO WEBSITE MAINTENANCE GUIDE - JAVASCRIPT
==========================================================================

This JavaScript file contains all interactive functionality for
Prof. Manish Raj's portfolio website. Below is a guide to help you
understand and modify different sections.

TABLE OF CONTENTS:
1. Animation Initialization (lines ~5-19)
2. Navbar & Scrolling Functionality (lines ~22-82)
3. Navigation Highlighting (lines ~87-117)
4. Mobile Navigation (lines ~120-135)
5. Publication Filters (lines ~138-196)
6. Contact Form Handling (lines ~199-250)
7. Load More Button Functionality (lines ~253-308)
8. Publication Accordions (lines ~311-381)
9. Image Handling (lines ~384-393)
10. Responsive Adjustments (lines ~396-419)

HOW TO MODIFY SPECIFIC FUNCTIONALITY:
-------------------------------------

ANIMATION SETTINGS:
- Adjust WOW.js initialization parameters in the first section
- Change animation timing, delays, and offsets

NAVIGATION BEHAVIOR:
- Modify scroll offsets in the smooth scrolling section
- Adjust sticky navbar behavior in the scroll event listener

PUBLICATION FILTERS:
- Update filter logic in the filter buttons event listener
- Modify scroll behavior after filtering

LOAD MORE FUNCTIONALITY:
- Adjust animation timing in the load more buttons section
- Modify staggered animation behavior for publication cards

ACCORDION BEHAVIOR:
- Change accordion animation in the publications accordion section
- Modify height calculation for smoother transitions

FORM VALIDATION:
- Update validation rules in the contact form submission handler
- Add additional form fields or validation as needed

RESPONSIVE BEHAVIOR:
- Modify breakpoints in the screen size change handler
- Adjust UI elements based on screen size

==========================================================================
*/

// Preload critical resources
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay before initializing animations for smoother experience
    setTimeout(() => {
        // Initialize WOW.js for scroll animations with mobile support
        new WOW({
            mobile: true,
            offset: 100,
            callback: function(box) {
                // Add a small delay to each animation for smoother rendering
                setTimeout(() => {
                    box.classList.add('animated');
                }, 50);
            }
        }).init();

        // Remove preload class from body to enable transitions
        document.body.classList.remove('preload');
    }, 100);

    // Sticky Navbar on Scroll
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Back to Top Button visibility
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
    });

    // Back to Top Button functionality
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for anchor links with better mobile support
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust offset based on screen size
                let offset = navbarHeight;
                if (window.innerWidth < 768) {
                    offset = navbarHeight - 10; // Less offset on mobile
                }

                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active nav item
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Active nav item on scroll with improved accuracy
    const sections = document.querySelectorAll('section');
    const mainBanner = document.querySelector('#top');
    if (sections.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPosition = window.pageYOffset;

            // Check if we're at the top of the page
            if (scrollPosition < 100) {
                current = 'top';
            } else {
                // Check each section
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - navbarHeight - 20;
                    const sectionHeight = section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });
            }

            // Update active nav item
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
                const href = navLink.getAttribute('href');
                if (href === `#${current}`) {
                    navLink.classList.add('active');
                }
            });
        });
    }

    // Mobile navbar collapse on click with improved touch support
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                // Use Bootstrap's collapse API for better reliability
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });

    // Publication Filters with improved mobile support
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');
                const publicationSections = document.querySelectorAll('.publication-section');

                if (filter === 'all') {
                    publicationSections.forEach(section => {
                        section.style.display = 'block';
                    });
                } else {
                    publicationSections.forEach(section => {
                        if (section.classList.contains(filter)) {
                            section.style.display = 'block';
                        } else {
                            section.style.display = 'none';
                        }
                    });
                }

                // Smooth scroll to active section with improved animation
                const publicationsSection = document.querySelector('#publications');
                if (publicationsSection) {
                    // Find the first visible publication section
                    let firstVisibleSection = null;
                    publicationSections.forEach(section => {
                        if (section.style.display !== 'none' && !firstVisibleSection) {
                            firstVisibleSection = section;
                        }
                    });

                    if (firstVisibleSection) {
                        // Calculate offset based on screen size
                        let scrollOffset = navbarHeight + 20;
                        if (window.innerWidth < 768) {
                            scrollOffset = navbarHeight + 10;
                        }

                        // Get the position of the first visible section
                        const sectionTop = firstVisibleSection.getBoundingClientRect().top;
                        const offsetTop = window.pageYOffset + sectionTop - scrollOffset;

                        // Smooth scroll with easing
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Contact Form Submission with improved validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Improved validation
            if (!name) {
                alert('Please enter your name');
                document.getElementById('name').focus();
                return;
            }

            if (!email) {
                alert('Please enter your email');
                document.getElementById('email').focus();
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                document.getElementById('email').focus();
                return;
            }

            if (!subject) {
                alert('Please enter a subject');
                document.getElementById('subject').focus();
                return;
            }

            if (!message) {
                alert('Please enter your message');
                document.getElementById('message').focus();
                return;
            }

            // In a real application, you would send this data to a server
            // For this static site, we'll just show a success message
            alert('Thank you for your message! This is a static website, so your message has not been sent. In a real application, this would be sent to the server.');

            // Reset form
            contactForm.reset();
        });
    }

    // Publications Load More Button with improved animations
    const loadMoreBtns = document.querySelectorAll('.load-more-btn');
    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add loading state to button
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            this.style.opacity = '0.7';

            const btnId = this.getAttribute('id');
            let targetSection;

            if (btnId === 'load-more-journals') {
                targetSection = document.getElementById('more-journals');
            } else if (btnId === 'load-more-conferences') {
                targetSection = document.getElementById('more-conferences');
            }

            if (targetSection) {
                // Delay showing content for smoother transition
                setTimeout(() => {
                    // Prepare the target section
                    targetSection.style.display = 'flex';
                    targetSection.style.opacity = '0';

                    // Stagger the animations of child elements
                    const cards = targetSection.querySelectorAll('.pub-card');
                    cards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';

                        // Staggered animation for each card
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50 * index);
                    });

                    // Fade in the entire section
                    setTimeout(() => {
                        targetSection.style.transition = 'opacity 0.4s ease';
                        targetSection.style.opacity = '1';

                        // Hide the button with a fade out
                        this.style.transition = 'opacity 0.3s ease';
                        this.style.opacity = '0';

                        // Remove the button after fade out
                        setTimeout(() => {
                            this.style.display = 'none';
                        }, 300);
                    }, 100);
                }, 400);
            }
        });
    });

    // Publications Accordion with improved animations
    const pubAccordionHeaders = document.querySelectorAll('.pub-accordion-header');

    // Function to calculate accurate content height
    function getAccurateHeight(element) {
        // Clone the element
        const clone = element.cloneNode(true);

        // Set the clone's position to absolute and visibility to hidden
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.maxHeight = 'none'; // Remove max-height constraint

        // Append the clone to the parent
        element.parentNode.appendChild(clone);

        // Get the height
        const height = clone.offsetHeight;

        // Remove the clone
        element.parentNode.removeChild(clone);

        // Return the height
        return height;
    }

    pubAccordionHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default behavior

            const accordion = this.parentElement;
            const content = this.nextElementSibling;

            // Close all other accordions first for smoother experience
            pubAccordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    const otherAccordion = otherHeader.parentElement;
                    const otherContent = otherHeader.nextElementSibling;

                    if (otherAccordion.classList.contains('active')) {
                        otherAccordion.classList.remove('active');
                        otherContent.style.maxHeight = '0';
                    }
                }
            });

            // Toggle active class with a slight delay for smoother animation
            setTimeout(() => {
                accordion.classList.toggle('active');

                // Set max-height for animation with accurate height calculation
                if (accordion.classList.contains('active')) {
                    const height = getAccurateHeight(content);
                    content.style.maxHeight = height + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            }, 50);
        });
    });

    // Open first accordion by default with a slight delay for smoother initial load
    setTimeout(() => {
        if (pubAccordionHeaders.length > 0) {
            const firstAccordion = pubAccordionHeaders[0].parentElement;
            const firstContent = pubAccordionHeaders[0].nextElementSibling;

            firstAccordion.classList.add('active');
            const height = getAccurateHeight(firstContent);
            firstContent.style.maxHeight = height + 'px';
        }
    }, 300);

    // Responsive image handling
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading="lazy" for better performance
        img.setAttribute('loading', 'lazy');

        // Handle image errors
        img.addEventListener('error', function() {
            this.src = 'img/placeholder.jpg'; // Fallback image
        });
    });

    // Detect screen size changes and adjust UI accordingly
    function handleScreenSizeChange() {
        const width = window.innerWidth;

        // Adjust UI based on screen size
        if (width < 576) {
            // Extra small devices
            document.querySelectorAll('.timeline-responsibilities').forEach(el => {
                el.style.flexDirection = 'column';
                el.style.alignItems = 'flex-start';
            });
        } else {
            // Larger devices
            document.querySelectorAll('.timeline-responsibilities').forEach(el => {
                el.style.flexDirection = 'row';
                el.style.alignItems = 'center';
            });
        }
    }

    // Initial call
    handleScreenSizeChange();

    // Listen for resize events
    window.addEventListener('resize', handleScreenSizeChange);
});
