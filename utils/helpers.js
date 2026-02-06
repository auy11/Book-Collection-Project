// Yardımcı fonksiyonlar
class Helpers {
    // DOM'a element ekleme
    static appendTo(parentId, element) {
        const parent = document.getElementById(parentId);
        if (parent) {
            parent.appendChild(element);
        }
    }

    // Element oluşturma
    static createElement(tag, className = '', content = '') {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (content) {
            if (typeof content === 'string') {
                element.textContent = content;
            } else {
                element.appendChild(content);
            }
        }
        return element;
    }

    // Yıldız rating gösterme
    static renderStars(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push('<i class="fas fa-star"></i>');
            } else if (i === fullStars && hasHalfStar) {
                stars.push('<i class="fas fa-star-half-alt"></i>');
            } else {
                stars.push('<i class="far fa-star"></i>');
            }
        }
        
        return stars.join('');
    }

    // Tarih formatlama
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Modal göster/gizle
    static showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    static hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Toast bildirimi
    static showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = this.createElement('div', `toast ${type}`);
        
        const icon = type === 'success' ? 'check-circle' :
                    type === 'error' ? 'exclamation-circle' :
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${this.getToastTitle(type)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        // Otomatik kapanma
        const timeout = setTimeout(() => {
            toast.remove();
        }, duration);

        // Manuel kapatma
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            toast.remove();
        });
    }

    static getToastTitle(type) {
        const titles = {
            'success': 'Başarılı!',
            'error': 'Hata!',
            'warning': 'Uyarı!',
            'info': 'Bilgi'
        };
        return titles[type] || 'Bildirim';
    }

    // Form verilerini toplama
    static getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });

        return data;
    }

    // Input değerini ayarlama
    static setFormValue(formId, fieldName, value) {
        const input = document.querySelector(`#${formId} [name="${fieldName}"]`);
        if (input) {
            input.value = value;
        }
    }

    // Loading spinner
    static showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center p-4">
                    <div class="loading-spinner"></div>
                    <p class="mt-2">Yükleniyor...</p>
                </div>
            `;
        }
    }

    // Sayfa yükleme
    static loadPage(pageContent, containerId = 'page-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = pageContent;
        }
    }

    // Aktif navigasyon item'ını güncelleme
    static setActiveNav(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }

    // URL parametrelerini alma
    static getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        
        for (const [key, value] of params) {
            result[key] = value;
        }
        
        return result;
    }

    // Sayfa başlığını güncelleme
    static setPageTitle(title) {
        document.title = `${title} | Kitap Koleksiyonum`;
    }

    // Rastgele renk üretme
    static getRandomColor() {
        const colors = [
            '#4361ee', '#3a0ca3', '#7209b7', '#f72585',
            '#4cc9f0', '#4895ef', '#560bad', '#b5179e'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // İlk harf büyütme
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Sayıyı formatlama
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
}

export default Helpers;