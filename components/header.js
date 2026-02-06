import Helpers from '../utils/helpers.js';

class Header {
    constructor() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const headerHTML = `
            <header class="header">
                <div class="header-content">
                    <a href="#" class="header-brand" id="home-link">
                        <div class="brand-icon">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <h1>Kitap Koleksiyonum</h1>
                    </a>
                    
                    <div class="header-actions">
                        <button class="btn btn-outline btn-small" id="export-btn" title="Verileri Dışa Aktar">
                            <i class="fas fa-download"></i>
                            <span class="hide-mobile">Dışa Aktar</span>
                        </button>
                        <button class="btn btn-primary btn-small" id="add-book-btn">
                            <i class="fas fa-plus"></i>
                            <span class="hide-mobile">Yeni Kitap</span>
                        </button>
                        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menüyü Aç">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </header>
            
            <style>
                .hide-mobile {
                    display: inline;
                }
                @media (max-width: 640px) {
                    .hide-mobile {
                        display: none;
                    }
                }
            </style>
        `;

        const container = document.getElementById('header-container');
        if (container) {
            container.innerHTML = headerHTML;
        }
    }

    setupEventListeners() {
        // Home link
        document.getElementById('home-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: 'home' } }));
        });

        // Add book
        document.getElementById('add-book-btn')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: 'add-book' } }));
        });

        // Export
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportData();
        });
    }

    exportData() {
        import('../utils/storage.js').then(({ default: storage }) => {
            const data = storage.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `kitap-koleksiyonu-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            Helpers.showToast('Veriler başarıyla dışa aktarıldı 💾', 'success');
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new Header();
});

export default Header;