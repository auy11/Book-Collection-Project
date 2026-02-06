import Helpers from './utils/helpers.js';
import storageManager from './utils/storage.js';
import Book from './interfaces/Book.js';
import BookForm from './components/BookForm.js';
import HomePage from './pages/HomePage.js';
import StatisticsPage from './pages/StatisticsPage.js';

class BookCollectionApp {
    constructor() {
        this.currentPage = 'home';
        this.currentBook = null;
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.applyTheme(this.theme);
        
        // Initialize demo data if empty
        this.initializeDemoData();
        
        // Render initial UI
        this.renderSidebar();
        this.loadPage('home');
        this.setupGlobalEventListeners();
        this.updateSidebarStats();
        
        // Show welcome toast for first visit
        if (!localStorage.getItem('visited')) {
            setTimeout(() => {
                Helpers.showToast('Kitap Koleksiyonuna Hoş Geldiniz! 📚', 'success', 5000);
                localStorage.setItem('visited', 'true');
            }, 1000);
        }
    }

    initializeDemoData() {
        // Check if books exist in localStorage
        const existingBooks = localStorage.getItem('bookCollection');
        
        if (!existingBooks || JSON.parse(existingBooks).length === 0) {
            // Add demo books
            const demoBooks = [
                {
                    id: 'book_' + Date.now() + '_1',
                    title: 'Suç ve Ceza',
                    author: 'Fyodor Dostoyevski',
                    year: 1866,
                    genre: 'Roman',
                    status: 'read',
                    rating: 5,
                    coverUrl: '',
                    description: 'Raskolnikov\'un psikolojik çöküşünü anlatan başyapıt. Edebiyat tarihinin en önemli eserlerinden biri.',
                    createdAt: new Date('2024-01-15').toISOString(),
                    updatedAt: new Date('2024-01-20').toISOString()
                },
                {
                    id: 'book_' + Date.now() + '_2',
                    title: '1984',
                    author: 'George Orwell',
                    year: 1949,
                    genre: 'Bilim Kurgu',
                    status: 'read',
                    rating: 4,
                    coverUrl: '',
                    description: 'Distopik bir gelecek tasviri. Büyük Birader her şeyi görüyor.',
                    createdAt: new Date('2024-02-10').toISOString(),
                    updatedAt: new Date('2024-02-15').toISOString()
                },
                {
                    id: 'book_' + Date.now() + '_3',
                    title: 'Sefiller',
                    author: 'Victor Hugo',
                    year: 1862,
                    genre: 'Roman',
                    status: 'reading',
                    rating: 0,
                    coverUrl: '',
                    description: 'Jean Valjean\'ın hikayesi. Adalet, merhamet ve kurtuluş üzerine epik bir roman.',
                    createdAt: new Date('2024-03-01').toISOString(),
                    updatedAt: new Date('2024-03-01').toISOString()
                },
                {
                    id: 'book_' + Date.now() + '_4',
                    title: 'Küçük Prens',
                    author: 'Antoine de Saint-Exupéry',
                    year: 1943,
                    genre: 'Çocuk',
                    status: 'toread',
                    rating: 0,
                    coverUrl: '',
                    description: 'Felsefi bir çocuk kitabı. Yetişkinler için masal, çocuklar için gerçek.',
                    createdAt: new Date('2024-03-05').toISOString(),
                    updatedAt: new Date('2024-03-05').toISOString()
                },
                {
                    id: 'book_' + Date.now() + '_5',
                    title: 'Yüzyıllık Yalnızlık',
                    author: 'Gabriel García Márquez',
                    year: 1967,
                    genre: 'Roman',
                    status: 'read',
                    rating: 5,
                    coverUrl: '',
                    description: 'Buendía ailesinin yedi kuşağını anlatan büyülü gerçekçilik başyapıtı.',
                    createdAt: new Date('2024-01-20').toISOString(),
                    updatedAt: new Date('2024-02-01').toISOString()
                },
                {
                    id: 'book_' + Date.now() + '_6',
                    title: 'Dune',
                    author: 'Frank Herbert',
                    year: 1965,
                    genre: 'Bilim Kurgu',
                    status: 'toread',
                    rating: 0,
                    coverUrl: '',
                    description: 'Çöl gezegeni Arrakis\'te geçen destansı bilim kurgu serisi.',
                    createdAt: new Date('2024-03-10').toISOString(),
                    updatedAt: new Date('2024-03-10').toISOString()
                }
            ];
            
            localStorage.setItem('bookCollection', JSON.stringify(demoBooks));
            console.log('Demo kitaplar yüklendi:', demoBooks.length);
        }
    }

    applyTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        Helpers.showToast(`${newTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} mod aktif`, 'info');
    }

    renderSidebar() {
        const settings = storageManager.loadUserSettings();
        const stats = storageManager.getStatistics();
        
        // Update progress circle
        const progressCircle = document.getElementById('progress-circle');
        const progressText = document.getElementById('progress-text');
        const goalPercentage = document.getElementById('goal-percentage');
        
        if (progressCircle && progressText && goalPercentage) {
            const progress = Math.min((stats.read / settings.readingGoal) * 100, 100);
            const circumference = 2 * Math.PI * 15.9155;
            const offset = circumference - (progress / 100) * circumference;
            
            progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            progressCircle.style.strokeDashoffset = offset;
            
            progressText.textContent = `${stats.read}/${settings.readingGoal} kitap`;
            goalPercentage.textContent = `${Math.round(progress)}%`;
        }
        
        // Update badges
        this.updateBadges(stats);
    }

    updateBadges(stats) {
        const badges = {
            'home-badge': stats.total,
            'read-badge': stats.read,
            'reading-badge': stats.reading,
            'toread-badge': stats.toread
        };
        
        Object.entries(badges).forEach(([id, value]) => {
            const badge = document.getElementById(id);
            if (badge) {
                badge.textContent = value;
                badge.style.display = value > 0 ? 'flex' : 'none';
            }
        });
    }

    updateSidebarStats() {
        const stats = storageManager.getStatistics();
        
        const sidebarTotal = document.getElementById('total-books-sidebar');
        if (sidebarTotal) {
            sidebarTotal.textContent = `${stats.total} kitap koleksiyonda`;
        }
        
        this.renderSidebar();
    }

    loadPage(pageName, params = {}) {
        this.showLoading();
        
        setTimeout(() => {
            this.currentPage = pageName;
            
            switch (pageName) {
                case 'home':
                    this.renderHomePage(params);
                    break;
                case 'statistics':
                    this.renderStatisticsPage();
                    break;
                case 'add-book':
                    this.renderAddBookPage();
                    break;
                case 'edit-book':
                    this.renderEditBookPage(params.book);
                    break;
                default:
                    this.renderHomePage();
            }
            
            Helpers.setActiveNav(pageName);
            this.hideLoading();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 150);
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    renderHomePage(params = {}) {
        const homePage = new HomePage(params);
        const content = homePage.render();
        Helpers.loadPage(content);
        homePage.setupEventListeners();
        Helpers.setPageTitle('Ana Sayfa');
    }

    renderStatisticsPage() {
        const statsPage = new StatisticsPage();
        const content = statsPage.render();
        Helpers.loadPage(content);
        statsPage.setupEventListeners();
        Helpers.setPageTitle('İstatistikler');
    }

    renderAddBookPage() {
        const bookForm = new BookForm();
        const formHTML = bookForm.render();
        
        const pageHTML = `
            <div class="page-header">
                <h1>Yeni Kitap Ekle</h1>
                <div class="page-actions">
                    <button class="btn btn-secondary" id="back-to-home">
                        <i class="fas fa-arrow-left"></i> Geri Dön
                    </button>
                </div>
            </div>
            ${formHTML}
        `;
        
        Helpers.loadPage(pageHTML);
        bookForm.setupEventListeners(
            (formData) => this.saveBook(formData),
            () => this.loadPage('home')
        );
        
        document.getElementById('back-to-home')?.addEventListener('click', () => {
            this.loadPage('home');
        });
        
        Helpers.setPageTitle('Yeni Kitap Ekle');
    }

    renderEditBookPage(book) {
        const bookForm = new BookForm(book, true);
        const formHTML = bookForm.render();
        
        const pageHTML = `
            <div class="page-header">
                <h1>Kitap Düzenle</h1>
                <div class="page-actions">
                    <button class="btn btn-secondary" id="back-to-home-edit">
                        <i class="fas fa-arrow-left"></i> Geri Dön
                    </button>
                </div>
            </div>
            ${formHTML}
        `;
        
        Helpers.loadPage(pageHTML);
        bookForm.setupEventListeners(
            (formData) => this.updateBook(formData),
            () => this.loadPage('home')
        );
        
        document.getElementById('back-to-home-edit')?.addEventListener('click', () => {
            this.loadPage('home');
        });
        
        Helpers.setPageTitle('Kitap Düzenle');
    }

    saveBook(formData) {
        const book = new Book(formData);
        const validation = book.validate();
        
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                Helpers.showToast(error, 'error');
            });
            return;
        }
        
        const success = storageManager.saveBook(book.toJSON());
        
        if (success) {
            Helpers.showToast('Kitap başarıyla eklendi! 🎉', 'success');
            this.loadPage('home');
            this.updateSidebarStats();
        } else {
            Helpers.showToast('Kitap eklenirken bir hata oluştu', 'error');
        }
    }

    updateBook(formData) {
        const book = new Book(formData);
        const validation = book.validate();
        
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                Helpers.showToast(error, 'error');
            });
            return;
        }
        
        const success = storageManager.saveBook(book.toJSON());
        
        if (success) {
            Helpers.showToast('Kitap başarıyla güncellendi! ✨', 'success');
            this.loadPage('home');
            this.updateSidebarStats();
        } else {
            Helpers.showToast('Kitap güncellenirken bir hata oluştu', 'error');
        }
    }

    setupGlobalEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.loadPage(page);
                
                document.getElementById('sidebar')?.classList.remove('active');
                document.getElementById('sidebar-overlay')?.classList.remove('active');
            });
        });

        // Filter links
        document.querySelectorAll('.filter-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = e.currentTarget.dataset.filter;
                this.loadPage('home', { filter });
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Mobile menu
        document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.add('active');
            document.getElementById('sidebar-overlay')?.classList.add('active');
        });

        document.getElementById('sidebar-close')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.remove('active');
            document.getElementById('sidebar-overlay')?.classList.remove('active');
        });

        document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.remove('active');
            document.getElementById('sidebar-overlay')?.classList.remove('active');
        });

        // Page change event
        window.addEventListener('pageChange', (e) => {
            this.loadPage(e.detail.page, e.detail.params);
        });

        // Edit book event
        window.addEventListener('editBook', (e) => {
            this.loadPage('edit-book', { book: e.detail.book });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('filter-search')?.focus();
            }
            
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay.active');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
        });

        // Import/Export
        this.setupDataManagement();
    }

    setupDataManagement() {
        const importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.accept = '.json';
        importInput.style.display = 'none';
        importInput.id = 'import-file-input';
        
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = storageManager.importData(event.target.result);
                    if (result.success) {
                        Helpers.showToast(result.message, 'success');
                        this.loadPage('home');
                        this.updateSidebarStats();
                    } else {
                        Helpers.showToast(result.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
            e.target.value = '';
        });
        
        document.body.appendChild(importInput);
    }

    showBookDetails(bookId) {
        const books = storageManager.loadBooks();
        const book = books.find(b => b.id === bookId);
        
        if (book) {
            import('./components/BookItem.js').then(({ default: BookItem }) => {
                const bookItem = new BookItem(book);
                document.body.insertAdjacentHTML('beforeend', bookItem.renderDetailModal());
                bookItem.setupEventListeners((id) => {
                    window.dispatchEvent(new CustomEvent('editBook', { detail: { book } }));
                });
            });
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BookCollectionApp();
});

export default BookCollectionApp;