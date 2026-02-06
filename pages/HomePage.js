import Helpers from '../utils/helpers.js';
import BookList from '../components/BookList.js';
import storageManager from '../utils/storage.js';
import Book from '../interfaces/Book.js';

class HomePage {
    constructor() {
        this.currentFilters = {
            status: 'all',
            genre: 'all',
            year: 'all',
            search: '',
            sort: 'date'
        };
        this.books = [];
    }

    render() {
        Helpers.setPageTitle('Ana Sayfa');
        Helpers.setActiveNav('home');
        
        this.books = storageManager.filterBooks(this.currentFilters);
        
        return `
            <div class="page-header">
                <h1>Kitap Koleksiyonum</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="show-filters-btn">
                        <i class="fas fa-filter"></i> Filtreler
                    </button>
                    <button class="btn btn-success" id="add-book-home-btn">
                        <i class="fas fa-plus"></i> Yeni Kitap
                    </button>
                </div>
            </div>

            <div class="filters-container" id="filters-container" style="display: none;">
                <div class="filter-row">
                    <div class="filter-group">
                        <label class="filter-label">Durum</label>
                        <select class="filter-select" id="filter-status">
                            <option value="all">Tümü</option>
                            <option value="toread">Okunacak</option>
                            <option value="reading">Okunuyor</option>
                            <option value="read">Okundu</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">Tür</label>
                        <select class="filter-select" id="filter-genre">
                            <option value="all">Tüm Türler</option>
                            ${Book.getGenres().map(genre => 
                                `<option value="${genre}">${genre}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">Yıl</label>
                        <select class="filter-select" id="filter-year">
                            <option value="all">Tüm Yıllar</option>
                            ${this.getYearOptions()}
                        </select>
                    </div>
                </div>
                
                <div class="filter-row">
                    <div class="filter-group">
                        <label class="filter-label">Ara</label>
                        <input type="text" class="filter-input" id="filter-search" 
                               placeholder="Kitap adı veya yazar ara...">
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">Sırala</label>
                        <select class="filter-select" id="filter-sort">
                            <option value="date">Eklenme Tarihi (Yeni)</option>
                            <option value="title">Alfabetik (A-Z)</option>
                            <option value="year">Yayın Yılı (Yeni)</option>
                            <option value="rating">Puan (Yüksek)</option>
                        </select>
                    </div>
                </div>
                
                <div class="filter-actions">
                    <button class="btn btn-secondary" id="clear-filters-btn">
                        <i class="fas fa-times"></i> Temizle
                    </button>
                    <button class="btn btn-primary" id="apply-filters-btn">
                        <i class="fas fa-check"></i> Uygula
                    </button>
                </div>
            </div>

            <div class="stats-summary">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-value" id="total-books-count">${this.books.length}</div>
                        <div class="stat-label">Toplam Kitap</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle" style="color: #4cc9f0;"></i>
                        </div>
                        <div class="stat-value" id="read-books-count">
                            ${this.books.filter(b => b.status === 'read').length}
                        </div>
                        <div class="stat-label">Okunan</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-spinner" style="color: #f8961e;"></i>
                        </div>
                        <div class="stat-value" id="reading-books-count">
                            ${this.books.filter(b => b.status === 'reading').length}
                        </div>
                        <div class="stat-label">Okunuyor</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-clock" style="color: #adb5bd;"></i>
                        </div>
                        <div class="stat-value" id="toread-books-count">
                            ${this.books.filter(b => b.status === 'toread').length}
                        </div>
                        <div class="stat-label">Okunacak</div>
                    </div>
                </div>
            </div>

            <div id="books-list-container">
                ${new BookList(this.books, this.currentFilters).render()}
            </div>
        `;
    }

    setupEventListeners() {
        // Apply filters
        document.getElementById('apply-filters-btn')?.addEventListener('click', () => {
            this.applyFilters();
        });

        // Clear filters
        document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
            this.clearFilters();
        });

        // Show/hide filters
        document.getElementById('show-filters-btn')?.addEventListener('click', () => {
            const container = document.getElementById('filters-container');
            if (container) {
                container.style.display = container.style.display === 'none' ? 'block' : 'none';
            }
        });

        // Add book button
        document.getElementById('add-book-home-btn')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: 'add-book' } }));
        });

        // Filter inputs
        ['status', 'genre', 'year', 'sort'].forEach(filter => {
            const element = document.getElementById(`filter-${filter}`);
            if (element) {
                element.value = this.currentFilters[filter];
                element.addEventListener('change', () => {
                    this.currentFilters[filter] = element.value;
                });
            }
        });

        // Search input
        const searchInput = document.getElementById('filter-search');
        if (searchInput) {
            searchInput.value = this.currentFilters.search;
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
            });
            
            // Debounce search
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.applyFilters();
                }, 500);
            });
        }

        // Book list events
        this.setupBookListEventListeners();
    }

    setupBookListEventListeners() {
        const bookList = new BookList(this.books, this.currentFilters);
        bookList.setupEventListeners(
            (bookId) => this.editBook(bookId),
            (bookId) => this.deleteBook(bookId),
            (bookId) => this.changeBookStatus(bookId)
        );
    }

    applyFilters() {
        this.books = storageManager.filterBooks(this.currentFilters);
        this.updateBooksList();
        this.updateStats();
        Helpers.showToast('Filtreler uygulandı', 'success');
    }

    clearFilters() {
        this.currentFilters = {
            status: 'all',
            genre: 'all',
            year: 'all',
            search: '',
            sort: 'date'
        };
        
        // Reset filter inputs
        ['status', 'genre', 'year', 'sort'].forEach(filter => {
            const element = document.getElementById(`filter-${filter}`);
            if (element) element.value = 'all';
        });
        
        document.getElementById('filter-search').value = '';
        
        this.applyFilters();
        Helpers.showToast('Filtreler temizlendi', 'info');
    }

    updateBooksList() {
        const container = document.getElementById('books-list-container');
        if (container) {
            const bookList = new BookList(this.books, this.currentFilters);
            container.innerHTML = bookList.render();
            this.setupBookListEventListeners();
        }
    }

    updateStats() {
        const stats = storageManager.getStatistics();
        
        ['total', 'read', 'reading', 'toread'].forEach(stat => {
            const element = document.getElementById(`${stat}-books-count`);
            if (element) {
                element.textContent = stats[stat];
            }
        });
        
        // Update sidebar total
        const sidebarTotal = document.getElementById('total-books');
        if (sidebarTotal) {
            sidebarTotal.textContent = `${stats.total} kitap`;
        }
    }

    editBook(bookId) {
        const books = storageManager.loadBooks();
        const book = books.find(b => b.id === bookId);
        if (book) {
            window.dispatchEvent(new CustomEvent('editBook', { detail: { book } }));
        }
    }

    deleteBook(bookId) {
        if (confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
            const success = storageManager.deleteBook(bookId);
            if (success) {
                this.applyFilters(); // Refresh list
                Helpers.showToast('Kitap başarıyla silindi', 'success');
            } else {
                Helpers.showToast('Kitap silinemedi', 'error');
            }
        }
    }

    changeBookStatus(bookId) {
        const books = storageManager.loadBooks();
        const bookIndex = books.findIndex(b => b.id === bookId);
        
        if (bookIndex >= 0) {
            const book = books[bookIndex];
            const statuses = ['toread', 'reading', 'read'];
            const currentIndex = statuses.indexOf(book.status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            book.status = statuses[nextIndex];
            book.updatedAt = new Date().toISOString();
            
            storageManager.saveBooks(books);
            this.applyFilters(); // Refresh list
            
            const statusLabels = {
                'toread': 'Okunacak',
                'reading': 'Okunuyor',
                'read': 'Okundu'
            };
            
            Helpers.showToast(`Durum "${statusLabels[book.status]}" olarak güncellendi`, 'success');
        }
    }

    getYearOptions() {
        const currentYear = new Date().getFullYear();
        const years = [];
        
        for (let year = currentYear; year >= 1900; year--) {
            years.push(`<option value="${year}">${year}</option>`);
        }
        
        return years.join('');
    }
}

export default HomePage;