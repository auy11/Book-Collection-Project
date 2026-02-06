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
                    <a href="#" class="logo" id="home-link">
                        <div class="logo-icon">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <div class="logo-text">
                            <h1>Kitap Koleksiyonum</h1>
                            <p>Kişisel kitap yöneticiniz</p>
                        </div>
                    </a>
                    
                    <div class="header-actions">
                        <button class="btn btn-outline btn-small" id="export-btn">
                            <i class="fas fa-download"></i> Dışa Aktar
                        </button>
                        <button class="btn btn-primary btn-small" id="add-book-btn">
                            <i class="fas fa-plus"></i> Yeni Kitap
                        </button>
                        <button class="mobile-menu-btn" id="mobile-menu-btn">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </header>
        `;

        Helpers.appendTo('header-container', Helpers.createElement('div', '', headerHTML));
    }

    setupEventListeners() {
        // Home link
        document.getElementById('home-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: 'home' } }));
        });

        // Add book button
        document.getElementById('add-book-btn')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: 'add-book' } }));
        });

        // Export button
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportData();
        });

        // Mobile menu button
        document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar?.classList.toggle('active');
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
            
            Helpers.showToast('Veriler başarıyla dışa aktarıldı', 'success');
        });
    }
}

// Header'ı başlat
new Header();
export default Header;