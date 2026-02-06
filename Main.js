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
        this.init();
    }

    init() {
        this.renderSidebar();
        this.loadPage('home');
        this.setupGlobalEventListeners();
        this.updateSidebarStats();
    }

    renderSidebar() {
        const settings = storageManager.loadUserSettings();
        
        // Update progress
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
            const stats = storageManager.getStatistics();
            const progress = (stats.read / settings.readingGoal) * 100;
            const clampedProgress = Math.min(progress, 100);
            
            progressFill.style.width = `${clampedProgress}%`;
            progressText.textContent = `${stats.read}/${settings.readingGoal} kitap`;
        }
    }

    loadPage(pageName, params = {}) {
        this.currentPage = pageName;
        
        switch (pageName) {
            case 'home':
                this.renderHomePage();
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
    }

    renderHomePage() {
        const homePage = new HomePage();
        Helpers.loadPage(homePage.render());
        homePage.setupEventListeners();
    }

    renderStatisticsPage() {
        const statsPage = new StatisticsPage();
        Helpers.loadPage(statsPage.render());
        statsPage.setupEventListeners();
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
        
        // Back button
        document.getElementById('back-to-home')?.addEventListener('click', () => {
            this.loadPage('home');
        });
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
        
        // Back button
        document.getElementById('back-to-home-edit')?.addEventListener('click', () => {
            this.loadPage('home');
        });
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
            Helpers.showToast('Kitap başarıyla eklendi!', 'success');
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
            Helpers.showToast('Kitap başarıyla güncellendi!', 'success');
            this.loadPage('home');
        } else {
            Helpers.showToast('Kitap güncellenirken bir hata oluştu', 'error');
        }
    }

    setupGlobalEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('.nav-link').dataset.page;
                this.loadPage(page);
            });
        });

        // Page change event
        window.addEventListener('pageChange', (e) => {
            this.loadPage(e.detail.page, e.detail.params);
        });

        // Edit book event
        window.addEventListener('editBook', (e) => {
            this.loadPage('edit-book', { book: e.detail.book });
        });

        // Import/Export functionality
        this.setupDataManagement();

        // Mobile menu close on click outside
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            const mobileBtn = document.getElementById('mobile-menu-btn');
            
            if (sidebar?.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !mobileBtn?.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    setupDataManagement() {
        // Import button (hidden in UI but accessible)
        const importBtn = document.createElement('input');
        importBtn.type = 'file';
        importBtn.accept = '.json';
        importBtn.style.display = 'none';
        importBtn.id = 'import-file-input';
        
        importBtn.addEventListener('change', (e) => {
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
            e.target.value = ''; // Reset input
        });
        
        document.body.appendChild(importBtn);

        // Add import button to header
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const importButton = document.createElement('button');
            importButton.className = 'btn btn-outline btn-small';
            importButton.innerHTML = '<i class="fas fa-upload"></i> İçe Aktar';
            importButton.addEventListener('click', () => {
                document.getElementById('import-file-input').click();
            });
            headerActions.insertBefore(importButton, headerActions.firstChild);
        }
    }

    updateSidebarStats() {
        const stats = storageManager.getStatistics();
        const totalElement = document.getElementById('total-books');
        
        if (totalElement) {
            totalElement.textContent = `${stats.total} kitap`;
        }
        
        // Update progress
        this.renderSidebar();
    }

    // Utility method to show book details
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookCollectionApp();
    
    // Add CSS for additional components
    const additionalStyles = `
        <style>
            /* Book detail modal styles */
            .book-detail-header {
                display: flex;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .book-detail-info {
                flex: 1;
            }
            
            .book-detail-info h3 {
                margin-bottom: 1rem;
                color: #3a0ca3;
            }
            
            .book-detail-info p {
                margin-bottom: 0.5rem;
            }
            
            .status-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                color: white;
            }
            
            .status-success { background: #4cc9f0; }
            .status-warning { background: #f8961e; }
            .status-secondary { background: #adb5bd; }
            
            .book-description-section {
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #e9ecef;
            }
            
            .book-description-section h4 {
                margin-bottom: 1rem;
                color: #495057;
            }
            
            .book-meta-info {
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 0.9rem;
            }
            
            /* Animation for page transitions */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .main-content > div {
                animation: fadeIn 0.3s ease;
            }
            
            /* Responsive improvements */
            @media (max-width: 768px) {
                .book-detail-header {
                    flex-direction: column;
                    text-align: center;
                }
                
                .book-detail-cover {
                    margin: 0 auto;
                }
            }
        </style>
    `;
    
    if (!document.querySelector('#additional-styles')) {
        document.head.insertAdjacentHTML('beforeend', additionalStyles);
    }
});

// Make app available globally for debugging
window.BookCollectionApp = BookCollectionApp;