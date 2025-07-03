document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        bmsId: document.getElementById('bms-id'),
        generateBtn: document.getElementById('generate-btn'),
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        referralLink: document.getElementById('referral-link'),
        copyBtn: document.getElementById('copy-btn'),
        qrCode: document.getElementById('qr-code'),
        shareWhatsapp: document.getElementById('share-whatsapp'),
        shareLine: document.getElementById('share-line'),
        shareFacebook: document.getElementById('share-facebook'),
        newLinkBtn: document.getElementById('new-link-btn')
    };

    let currentReferralLink = '';
    let qrCodeInstance = null;

    // Initialize
    function init() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
        setupEventListeners();
        addAnimations();
        elements.bmsId.focus();
    }

    // Add entrance animations
    function addAnimations() {
        // Stagger animation for elements
        const animatedElements = document.querySelectorAll('.main-card, .social-media-section');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        });
    }

    // Enhanced BMS ID validation (6 or 7 digits only)
    function validateBMSId(bmsId) {
        const trimmedId = bmsId.trim();
        // Check if it's exactly 6 or 7 digits
        return /^\d{6,7}$/.test(trimmedId) && trimmedId.length >= 6 && trimmedId.length <= 7;
    }

    // Format BMS ID for display
    function formatBMSId(bmsId) {
        return bmsId.trim();
    }

    // Generate referral link with loading animation
    async function generateReferralLink() {
        const bmsId = formatBMSId(elements.bmsId.value);
        
        if (!validateBMSId(bmsId)) {
            showValidationError();
            return false;
        }
        
        clearValidationError();
        showLoadingState(true);
        
        try {
            // Simulate API call delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate the link with # symbol as requested
            currentReferralLink = `https://tpmyandtpth.github.io/RAF/#${bmsId}`;
            elements.referralLink.value = currentReferralLink;
            
            // Generate QR code
            await generateQRCode(currentReferralLink);
            
            // Show success animation
            showSuccessState();
            
            return true;
        } catch (error) {
            console.error('Error generating referral link:', error);
            showErrorState();
            return false;
        } finally {
            showLoadingState(false);
        }
    }

    // Show validation error
    function showValidationError() {
        elements.bmsId.classList.add('is-invalid');
        elements.bmsId.focus();
        
        // Add shake animation
        elements.bmsId.addEventListener('animationend', function onAnimationEnd() {
            elements.bmsId.removeEventListener('animationend', onAnimationEnd);
        });
    }

    // Clear validation error
    function clearValidationError() {
        elements.bmsId.classList.remove('is-invalid');
    }

    // Show loading state
    function showLoadingState(show) {
        if (show) {
            elements.generateBtn.classList.add('loading');
            elements.generateBtn.disabled = true;
            elements.bmsId.disabled = true;
        } else {
            elements.generateBtn.classList.remove('loading');
            elements.generateBtn.disabled = false;
            elements.bmsId.disabled = false;
        }
    }

    // Show success state
    function showSuccessState() {
        // Hide step 1 and show step 2
        elements.step1.style.display = 'none';
        elements.step2.style.display = 'block';
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add success animation to the entire step2
        elements.step2.style.animation = 'fadeIn 0.5s ease-out';
        
        // Auto-focus on copy button for accessibility
        setTimeout(() => {
            elements.copyBtn.focus();
        }, 500);
    }

    // Show error state
    function showErrorState() {
        alert('An error occurred while generating your referral link. Please try again.');
    }

    // Enhanced QR code generation
    async function generateQRCode(url) {
        return new Promise((resolve) => {
            // Clear previous QR code
            elements.qrCode.innerHTML = '';
            
            try {
                qrCodeInstance = new QRCode(elements.qrCode, {
                    text: url,
                    width: 200,
                    height: 200,
                    colorDark: "#1e293b",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H,
                    drawer: 'canvas'
                });
                
                // Add loading animation to QR code
                const qrCanvas = elements.qrCode.querySelector('canvas');
                if (qrCanvas) {
                    qrCanvas.style.opacity = '0';
                    qrCanvas.style.transform = 'scale(0.8)';
                    qrCanvas.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        qrCanvas.style.opacity = '1';
                        qrCanvas.style.transform = 'scale(1)';
                        resolve();
                    }, 100);
                } else {
                    resolve();
                }
            } catch (error) {
                console.error('Error generating QR code:', error);
                elements.qrCode.innerHTML = '<p class="text-muted">QR code could not be generated</p>';
                resolve();
            }
        });
    }

    // Enhanced copy to clipboard with better feedback
    async function copyToClipboard() {
        try {
            // Modern clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(currentReferralLink);
            } else {
                // Fallback for older browsers
                elements.referralLink.select();
                elements.referralLink.setSelectionRange(0, 99999); // For mobile devices
                document.execCommand('copy');
            }
            
            showCopySuccess();
            
            // Track copy event (analytics)
            trackEvent('copy_referral_link', { bms_id: elements.bmsId.value });
            
        } catch (err) {
            console.error('Failed to copy: ', err);
            showCopyError();
        }
    }

    // Show copy success feedback
    function showCopySuccess() {
        const originalHTML = elements.copyBtn.innerHTML;
        const copyText = elements.copyBtn.querySelector('.copy-text');
        
        elements.copyBtn.classList.add('copied');
        elements.copyBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
        
        setTimeout(() => {
            elements.copyBtn.classList.remove('copied');
            elements.copyBtn.innerHTML = originalHTML;
        }, 2000);
    }

    // Show copy error feedback
    function showCopyError() {
        const originalHTML = elements.copyBtn.innerHTML;
        
        elements.copyBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Error</span>';
        elements.copyBtn.style.background = 'var(--danger-color)';
        
        setTimeout(() => {
            elements.copyBtn.innerHTML = originalHTML;
            elements.copyBtn.style.background = '';
        }, 2000);
    }

    // Enhanced share functions
    function shareWhatsApp() {
        const message = `🚀 Exciting job opportunity at Teleperformance! Join our amazing team and grow your career with us. Apply now: ${currentReferralLink}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        
        openShareWindow(url, 'WhatsApp Share');
        trackEvent('share_whatsapp', { bms_id: elements.bmsId.value });
    }

    function shareLine() {
        const message = `🚀 Exciting job opportunity at Teleperformance! Join our amazing team and grow your career with us. Apply now: ${currentReferralLink}`;
        const url = `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(message)}`;
        
        openShareWindow(url, 'LINE Share');
        trackEvent('share_line', { bms_id: elements.bmsId.value });
    }

    function shareFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentReferralLink)}&quote=${encodeURIComponent('Join Teleperformance - Amazing career opportunities await!')}`;
        
        openShareWindow(url, 'Facebook Share');
        trackEvent('share_facebook', { bms_id: elements.bmsId.value });
    }

    // Open share window with consistent sizing
    function openShareWindow(url, title) {
        const width = 600;
        const height = 400;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);
        
        window.open(
            url, 
            title,
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
    }

    // Enhanced reset form with animation
    function resetForm() {
        // Clear form
        elements.bmsId.value = '';
        clearValidationError();
        
        // Animate transition
        elements.step2.style.animation = 'fadeOut 0.3s ease-out';
        
        setTimeout(() => {
            elements.step2.style.display = 'none';
            elements.step1.style.display = 'block';
            elements.step1.style.animation = 'fadeIn 0.3s ease-out';
            
            // Focus on input
            elements.bmsId.focus();
            
            // Clear QR code
            if (qrCodeInstance) {
                elements.qrCode.innerHTML = '';
                qrCodeInstance = null;
            }
            
            // Reset link
            currentReferralLink = '';
        }, 300);
        
        trackEvent('create_new_link');
    }

    // Real-time input validation and formatting
    function handleInputChange() {
        let value = elements.bmsId.value;
        
        // Remove any non-digit characters
        value = value.replace(/\D/g, '');
        
        // Limit to 7 characters
        if (value.length > 7) {
            value = value.substring(0, 7);
        }
        
        elements.bmsId.value = value;
        
        // Clear validation error if user starts typing correctly
        if (value.length > 0 && elements.bmsId.classList.contains('is-invalid')) {
            if (validateBMSId(value) || value.length < 6) {
                clearValidationError();
            }
        }
        
        // Enable/disable generate button based on input
        elements.generateBtn.disabled = value.length < 6;
    }

    // Keyboard shortcuts
    function handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to generate link
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && elements.step1.style.display !== 'none') {
            elements.generateBtn.click();
        }
        
        // Escape to reset form
        if (e.key === 'Escape' && elements.step2.style.display !== 'none') {
            resetForm();
        }
        
        // Ctrl/Cmd + C to copy when link is visible
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && elements.step2.style.display !== 'none') {
            e.preventDefault();
            copyToClipboard();
        }
    }

    // Analytics tracking (placeholder)
    function trackEvent(eventName, properties = {}) {
        // Placeholder for analytics implementation
        console.log('Event tracked:', eventName, properties);
        
        // Example: Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', eventName, properties);
        // }
        
        // Example: Facebook Pixel
        // if (typeof fbq !== 'undefined') {
        //     fbq('track', eventName, properties);
        // }
    }

    // Add CSS animations
    function addFadeOutAnimation() {
        if (!document.getElementById('fadeOutKeyframes')) {
            const style = document.createElement('style');
            style.id = 'fadeOutKeyframes';
            style.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Generate button
        elements.generateBtn.addEventListener('click', async function() {
            if (await generateReferralLink()) {
                // Success handled in generateReferralLink
            }
        });
        
        // Copy button
        elements.copyBtn.addEventListener('click', copyToClipboard);
        
        // Share buttons
        elements.shareWhatsapp.addEventListener('click', shareWhatsApp);
        elements.shareLine.addEventListener('click', shareLine);
        elements.shareFacebook.addEventListener('click', shareFacebook);
        
        // New link button
        elements.newLinkBtn.addEventListener('click', resetForm);
        
        // BMS ID input events
        elements.bmsId.addEventListener('input', handleInputChange);
        elements.bmsId.addEventListener('paste', function(e) {
            // Handle paste event
            setTimeout(handleInputChange, 0);
        });
        
        // Enter key to submit
        elements.bmsId.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !elements.generateBtn.disabled) {
                elements.generateBtn.click();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Prevent form submission on Enter
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
            }
        });
        
        // Add tooltips for better UX
        addTooltips();
        
        // Initialize fade out animation
        addFadeOutAnimation();
    }

    // Add tooltips for better user experience
    function addTooltips() {
        // Add title attributes for better accessibility
        elements.bmsId.title = 'Enter your 6 or 7 digit BMS ID number';
        elements.copyBtn.title = 'Copy referral link to clipboard';
        elements.shareWhatsapp.title = 'Share via WhatsApp';
        elements.shareLine.title = 'Share via LINE';
        elements.shareFacebook.title = 'Share via Facebook';
        
        // Add aria-labels for screen readers
        elements.bmsId.setAttribute('aria-label', 'BMS ID input field');
        elements.copyBtn.setAttribute('aria-label', 'Copy referral link');
        elements.generateBtn.setAttribute('aria-label', 'Generate referral link');
    }

    // Handle window focus events for better UX
    window.addEventListener('focus', function() {
        // Re-focus on appropriate element when window regains focus
        if (elements.step1.style.display !== 'none') {
            elements.bmsId.focus();
        }
    });

    // Handle visibility change for better performance
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause any animations or timers if needed
        } else {
            // Page is visible again
        }
    });

    // Initialize the application
    init();
    
    // Track page load
    trackEvent('page_load', { 
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
    });
});
