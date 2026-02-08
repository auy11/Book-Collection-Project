// utils/UIManager.js - UI Helper Functions

export class UIManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
    }

    // Show loading spinner
    showLoading(containerId = 'booksContainer') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                    <p class="mt-3 text-muted">Yükleniyor...</p>
                </div>
            `;
        }
    }

    // Hide loading spinner
    hideLoading() {
        // This is handled by renderBooks in Main.js
    }

    // Show toast notification (using jQuery)
    showToast(message, type = 'info', duration = 3000) {
        const iconMap = {
            success: 'bi-check-circle',
            error: 'bi-x-circle',
            warning: 'bi-exclamation-triangle',
            info: 'bi-info-circle'
        };

        const toast = $(`
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${iconMap[type]} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `);

        // Create toast container if it doesn't exist
        if ($('#toastContainer').length === 0) {
            $('body').append('<div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3"></div>');
        }

        $('#toastContainer').append(toast);
        
        const bsToast = new bootstrap.Toast(toast[0], { autohide: true, delay: duration });
        bsToast.show();

        // Remove toast element after it's hidden
        toast.on('hidden.bs.toast', function () {
            $(this).remove();
        });
    }

    // Confirm dialog
    confirm(message, title = 'Onay') {
        return window.confirm(`${title}\n\n${message}`);
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('tr-TR', options);
    }

    // Truncate text
    truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Scroll to top
    scrollToTop(smooth = true) {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }

    // Toggle theme (dark/light)
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        document.body.setAttribute('data-theme', this.theme);
        return this.theme;
    }

    // Get current theme
    getCurrentTheme() {
        return this.theme;
    }

    // Initialize theme
    initTheme() {
        document.body.setAttribute('data-theme', this.theme);
    }

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Panoya kopyalandı!', 'success');
            return true;
        } catch (error) {
            console.error('Clipboard error:', error);
            this.showToast('Kopyalama başarısız!', 'error');
            return false;
        }
    }

    // Download as JSON
    downloadJSON(data, filename = 'book-collection.json') {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Dosya indirildi!', 'success');
    }

    // Validate form field
    validateField(value, rules) {
        if (rules.required && !value) {
            return { valid: false, message: 'Bu alan zorunludur' };
        }
        
        if (rules.minLength && value.length < rules.minLength) {
            return { valid: false, message: `En az ${rules.minLength} karakter olmalıdır` };
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            return { valid: false, message: `En fazla ${rules.maxLength} karakter olmalıdır` };
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
            return { valid: false, message: 'Geçersiz format' };
        }
        
        return { valid: true, message: '' };
    }

    // Show/hide element with animation
    toggleElement(elementId, show = null) {
        const element = $(`#${elementId}`);
        
        if (show === null) {
            element.fadeToggle();
        } else if (show) {
            element.fadeIn();
        } else {
            element.fadeOut();
        }
    }

    // Add CSS class with jQuery
    addClass(selector, className) {
        $(selector).addClass(className);
    }

    // Remove CSS class with jQuery
    removeClass(selector, className) {
        $(selector).removeClass(className);
    }

    // Toggle CSS class with jQuery
    toggleClass(selector, className) {
        $(selector).toggleClass(className);
    }
}