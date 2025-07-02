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

    // Initialize
    function init() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
        setupEventListeners();
    }

    // Validate BMS ID (6 or 7 digits only)
    function validateBMSId(bmsId) {
        return /^\d{6,7}$/.test(bmsId);
    }

    // Generate referral link
    function generateReferralLink() {
        const bmsId = elements.bmsId.value.trim();
        
        if (!validateBMSId(bmsId)) {
            elements.bmsId.classList.add('is-invalid');
            return false;
        }
        
        elements.bmsId.classList.remove('is-invalid');
        
        // Generate the link
        currentReferralLink = `https://tpmyandtpth.github.io/RAF/${bmsId}`;
        elements.referralLink.value = currentReferralLink;
        
        // Generate QR code
        generateQRCode(currentReferralLink);
        
        return true;
    }

    // Generate QR code
    function generateQRCode(url) {
        elements.qrCode.innerHTML = '';
        new QRCode(elements.qrCode, {
            text: url,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Copy link to clipboard
    function copyToClipboard() {
        elements.referralLink.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = elements.copyBtn.innerHTML;
        elements.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            elements.copyBtn.innerHTML = originalText;
        }, 2000);
    }

    // Share functions
    function shareWhatsApp() {
        const message = `Check out this job opportunity at TP: ${currentReferralLink}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    function shareLine() {
        const message = `Check out this job opportunity at TP: ${currentReferralLink}`;
        const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    function shareFacebook() {
        alert('For Facebook, please copy the link and share it manually on your Facebook.');
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentReferralLink)}`, '_blank');
    }

    // Reset form
    function resetForm() {
        elements.bmsId.value = '';
        elements.step2.style.display = 'none';
        elements.step1.style.display = 'block';
        elements.bmsId.focus();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Generate button
        elements.generateBtn.addEventListener('click', function() {
            if (generateReferralLink()) {
                elements.step1.style.display = 'none';
                elements.step2.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        // BMS ID input validation
        elements.bmsId.addEventListener('input', function() {
            // Only allow digits
            this.value = this.value.replace(/\D/g, '');
        });
        
        // Allow Enter key to submit
        elements.bmsId.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                elements.generateBtn.click();
            }
        });
    }

    // Initialize the app
    init();
});
