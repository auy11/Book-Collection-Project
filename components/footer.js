import Helpers from '../utils/helpers.js';

class Footer {
    constructor() {
        this.render();
    }

    render() {
        const footerHTML = `
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-links">
                        <a href="#" class="footer-link" id="about-link">Hakkında</a>
                        <a href="#" class="footer-link" id="privacy-link">Gizlilik</a>
                        <a href="#" class="footer-link" id="contact-link">İletişim</a>
                        <a href="#" class="footer-link" id="github-link">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    </div>
                    
                    <div class="copyright">
                        <p>&copy; ${new Date().getFullYear()} Kitap Koleksiyonu Yöneticisi. Tüm hakları saklıdır.</p>
                        <p class="mt-1">Vanilla JavaScript ile geliştirilmiştir.</p>
                    </div>
                </div>
            </footer>
        `;

        Helpers.appendTo('footer-container', Helpers.createElement('div', '', footerHTML));
        this.setupEventListeners();
    }

    setupEventListeners() {
        // GitHub link
        document.getElementById('github-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://github.com', '_blank');
        });

        // Other links
        ['about', 'privacy', 'contact'].forEach(type => {
            const link = document.getElementById(`${type}-link`);
            link?.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal(type);
            });
        });
    }

    showModal(type) {
        const titles = {
            'about': 'Hakkında',
            'privacy': 'Gizlilik Politikası',
            'contact': 'İletişim'
        };

        const contents = {
            'about': `
                <h3>Kitap Koleksiyonu Yöneticisi</h3>
                <p>Bu uygulama, kişisel kitap koleksiyonunuzu yönetmeniz için geliştirilmiştir.</p>
                <p>Vanilla JavaScript, HTML5 ve CSS3 kullanılarak modern web teknolojileri ile oluşturulmuştur.</p>
                <p><strong>Özellikler:</strong></p>
                <ul>
                    <li>Kitap ekleme/düzenleme/silme</li>
                    <li>Detaylı filtreleme ve arama</li>
                    <li>İstatistikler ve raporlar</li>
                    <li>LocalStorage ile veri saklama</li>
                    <li>Responsive tasarım</li>
                </ul>
            `,
            'privacy': `
                <h3>Gizlilik Politikası</h3>
                <p>Bu uygulama tamamen istemci tarafında çalışmaktadır.</p>
                <p><strong>Veri Saklama:</strong></p>
                <ul>
                    <li>Tüm veriler tarayıcınızın localStorage'ında saklanır</li>
                    <li>Hiçbir veri sunucuya gönderilmez</li>
                    <li>Veriler sadece sizin tarayıcınızda kalır</li>
                </ul>
                <p><strong>Veri Güvenliği:</strong></p>
                <p>Verilerinizi yedeklemek için "Dışa Aktar" özelliğini kullanabilirsiniz.</p>
            `,
            'contact': `
                <h3>İletişim</h3>
                <p>Proje ile ilgili görüş ve önerileriniz için:</p>
                <p><i class="fas fa-envelope"></i> Email: ornek@email.com</p>
                <p><i class="fab fa-github"></i> GitHub: github.com/kullaniciadi</p>
                <p class="mt-2">Hata bildirimleri ve özellik isteklerinizi iletebilirsiniz.</p>
            `
        };

        const modalHTML = `
            <div class="modal-overlay active" id="${type}-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">${titles[type]}</h2>
                        <button class="modal-close" data-modal="${type}-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${contents[type]}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-modal="${type}-modal">Kapat</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Close buttons
        document.querySelectorAll(`[data-modal="${type}-modal"]`).forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById(`${type}-modal`)?.remove();
            });
        });
    }
}

// Footer'ı başlat
new Footer();
export default Footer;