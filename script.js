// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        mobileBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle icon between bars and times
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when a link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    });
});

// Highlight active section in navbar based on scroll position
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 250)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// EmailJS Configuration
console.log('Script loaded. Waiting for EmailJS library...');

let emailjsReady = false;

// Check if EmailJS is ready (initialized in HTML)
function checkEmailJSReady() {
    if (window.emailjsReady) {
        emailjsReady = true;
        console.log('✅ EmailJS is ready to send emails');
        return true;
    }
    return false;
}

// Try to check immediately
if (!checkEmailJSReady()) {
    console.log('EmailJS not yet loaded, will retry on form submit...');
}

const EMAILJS_SERVICE_ID = 'service_2mzge09';
const EMAILJS_TEMPLATE_ID = 'template_p3i9r9v';
const RECEIVER_EMAIL = 'hardimangukiya070@gmail.com';

// Form Validation Helper
function validateForm(name, email, message) {
    const errors = [];
    
    // Name validation: minimum 2 characters
    if (!name.trim()) {
        errors.push('Name is required');
    } else if (name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    // Email validation: valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        errors.push('Email is required');
    } else if (!emailRegex.test(email.trim())) {
        errors.push('Please enter a valid email address');
    }
    
    // Message validation: minimum 10 characters
    if (!message.trim()) {
        errors.push('Message is required');
    } else if (message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// Form submission handler with EmailJS integration
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const messageInput = contactForm.querySelector('#message');
        
        // Validate form fields with detailed validation
        const validationErrors = validateForm(nameInput.value, emailInput.value, messageInput.value);
        if (validationErrors.length > 0) {
            showFormMessage(validationErrors[0], 'error', btn, originalText);
            return;
        }
        
        // Disable button and show loading state
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Check if EmailJS is ready
            if (!checkEmailJSReady()) {
                console.error('EmailJS not available');
                throw new Error('Email service is still loading. Please try again in a moment.');
            }
            
            console.log('📧 Sending email with EmailJS...');
            
            // Prepare template parameters - using form fields directly
            const templateParams = {
                from_name: nameInput.value.trim(),
                from_email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                date: new Date().toLocaleString()
            };
            
            console.log('📋 Template Parameters:', {
                from_name: templateParams.from_name,
                from_email: templateParams.from_email,
                message: templateParams.message.substring(0, 50) + '...',
                date: templateParams.date,
                SERVICE_ID: EMAILJS_SERVICE_ID,
                TEMPLATE_ID: EMAILJS_TEMPLATE_ID
            });
            
            // Send email via EmailJS using send method (v4)
           const response = await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    {
        publicKey: "oxips-0h4TegbWCob"
    }
);
            
            console.log('✅ Email sent successfully!');
            console.log('Response:', response);
            
            // Show success message
            btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
            btn.style.backgroundColor = '#10b981';
            btn.style.color = '#fff';
            btn.style.borderColor = '#10b981';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after delay
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style = '';
                btn.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('❌ Email Send Failed');
            console.error('Error object:', error);
            console.error('Error message:', error.message);
            console.error('Error text:', error.text);
            console.error('Service ID:', EMAILJS_SERVICE_ID);
            console.error('Template ID:', EMAILJS_TEMPLATE_ID);
            
            // Show specific error message
            let errorMsg = 'Failed to send message. Please try again.';
            if (error.message) errorMsg = error.message;
            if (error.text) errorMsg = error.text;
            
            showFormMessage(errorMsg, 'error', btn, originalText);
            btn.disabled = false;
        }
    });
}

// Helper function to display form messages
function showFormMessage(message, type, btn, originalText) {
    if (type === 'error') {
        btn.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> ' + message;
        btn.style.backgroundColor = '#ef4444';
        btn.style.color = '#fff';
        btn.style.borderColor = '#ef4444';
    }
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style = '';
        btn.disabled = false;
    }, 4000);
}

// Reveal on scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active-reveal');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
});

// Certifications Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const certCards = document.querySelectorAll('.cert-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        certCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hidden');
                // Optional re-trigger animation
                if (card.classList.contains('active-reveal')) {
                    card.classList.remove('active-reveal');
                    setTimeout(() => {
                        card.classList.add('active-reveal');
                    }, 10);
                }
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Certificate Modal functionality
const certModal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-img');
const closeModalBtn = document.getElementById('close-modal');

window.openCertModal = function(imgSrc) {
    if (certModal && modalImg) {
        modalImg.src = imgSrc;
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
};

if (closeModalBtn && certModal) {
    closeModalBtn.addEventListener('click', () => {
        certModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalImg.src = '';
        }, 300);
    });

    // Close on outside click
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                modalImg.src = '';
            }, 300);
        }
    });
}
