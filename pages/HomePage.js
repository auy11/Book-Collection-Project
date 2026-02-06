import Helpers from '../utils/helpers.js';
import BookList from '../components/BookList.js';
import storageManager from '../utils/storage.js';
import Book from '../interfaces/Book.js';

class HomePage {
    constructor(params = {}) {
        this.currentFilters = {
            status: params.filter || 'all',
            genre: 'all',
            year: 'all',
            search: '',
            sort: 'date'
        };
        this.books = [];
    }

    render() {
        this.books = storageManager.filterBooks(this.currentFilters);
        const stats = storageManager.getStatistics();
        
        return `
            <div class="page-header animate-slide-up">
                <h1>Kitap Koleksiyonum</h1>
                <div class="page-actions">
                    <button class="btn btn-secondary" id="show-filters-btn">
                        <i class="fas fa-filter"></i> Filtreler
                    </button>
                    <button class="btn btn-primary" id="add-book-home-btn">
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
                            <option value="toread" ${this.currentFilters.status === 'toread' ? 'selected' : ''}>Okunacak</option>
                            <option value="reading" ${this.currentFilters.status === 'reading' ? 'selected' : ''}>Okunuyor</option>
                            <option value="read" ${this.currentFilters.status === 'read' ? 'selected' : ''}>Okundu</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">Tür</label>
                        <select class="filter-select" id="filter-genre">
                            <option value="all">Tüm Türler</option>
                            ${Book.getGenres().map(genre => 
                                `<option value="${genre}" ${this.currentFilters.genre === genre ? 'selected' : ''}>${genre}</option>`
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
                    
                    <div class="filter-group">
                        <label class="filter-label">Sırala</label>
                        <select class="filter-select" id="filter-sort">
                            <option value="date">Eklenme Tarihi</option>
                            <option value="title">Alfabetik</option>
                            <option value="year">Yayın Yılı</option>
                            <option value="rating">Puan</option>
                        </select>
                    </div>
                </div>
                
                <div class="filter-row">
                    <div class="filter-group" style="grid-column: 1 / -1;">
                        <label class="filter-label">Ara</label>
                        <div style="position: relative;">
                            <i class="fas fa-search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-tertiary);"></i>
                            <input type="text" class="filter-input" id="filter-search" 
                                   placeholder="Kitap adı veya yazar ara..." 
                                   value="${this.currentFilters.search}"
                                   style="padding-left: 2.5rem;">
                            <kbd style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); 
                                        background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; 
                                        font-size: 0.75rem; color: var(--text-tertiary);">Ctrl K</kbd>
                        </div>
                    </div>
                </div>
                
                <div class="filter-actions">
                    <button class="btn btn-ghost" id="clear-filters-btn">
                        <i class="fas fa-undo"></i> Sıfırla
                    </button>
                    <button class="btn btn-primary" id="apply-filters-btn">
                        <i class="fas fa-check"></i> Uygula
                    </button>
                </div>
            </div>

            <div class="stats-summary animate-slide-up" style="animation-delay: 0.1s">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-value">${stats.total}</div>
                        <div class="stat-label">Toplam Kitap</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: var(--success-light); color: var(--success-color);">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-value" style="background: linear-gradient(135deg, var(--success-color), #059669); -webkit-background-clip: text;">${stats.read}</div>
                        <div class="stat-label">Okunan</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: var(--warning-light); color: var(--warning-color);">
                            <i class="fas fa-book-reader"></i>
                        </div>
                        <div class="stat-value" style="background: linear-gradient(135deg, var(--warning-color), #d97706); -webkit-background-clip: text;">${stats.reading}</div>
                        <div class="stat-label">Okunuyor</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: var(--info-light); color: var(--info-color);">
                            <i class="fas fa-bookmark"></i>
                        </div>
                        <div class="stat-value" style="background: linear-gradient(135deg, var(--info-color), #2563eb); -webkit-background-clip: text;">${stats.toread}</div>
                        <div class="stat-label">Okunacak</div>
                    </div>
                </div>
            </div>

            <div id="books-list-container" class="animate-slide-up" style="animation-delay: 0.2s">
                ${new BookList(this.books, this.currentFilters).render()}
            </div>
        `;
    }

    setupEventListeners() {
        // Toggle filters
        const filtersContainer = document.getElementById('filters-container');
        document.getElementById('show-filters-btn')?.addEventListener('click', () => {
            const isHidden = filtersContainer.style.display === 'none';
            filtersContainer.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                filtersContainer.classList.add('animate-slide-up');
            }
        });

        // Apply filters
        document.getElementById('apply-filters-btn')?.addEventListener('click', () => {
            this.applyFilters();
        });

        // Clear filters
        document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
            this.clearFilters();
        });

        // Add book
        document.getElementById('add-book-home-btn')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: 'add-book' } }));
        });

        // Filter inputs - auto apply on change
        ['status', 'genre', 'year', 'sort'].forEach(filter => {
            const element = document.getElementById(`filter-${filter}`);
            if (element) {
                element.addEventListener('change', () => {
                    this.currentFilters[filter] = element.value;
                    this.applyFilters();
                });
            }
        });

        // Search with debounce
        const searchInput = document.getElementById('filter-search');
        let searchTimeout;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentFilters.search = e.target.value;
                    this.applyFilters();
                }, 300);
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
        // Update filters from inputs
        ['status', 'genre', 'year', 'sort'].forEach(filter => {
            const element = document.getElementById(`filter-${filter}`);
            if (element) {
                this.currentFilters[filter] = element.value;
            }
        });
        
        const searchInput = document.getElementById('filter-search');
        if (searchInput) {
            this.currentFilters.search = searchInput.value;
        }
        
        this.books = storageManager.filterBooks(this.currentFilters);
        this.updateBooksList();
        
        // Update stats display
        const stats = storageManager.getStatistics();
        this.updateStatsDisplay(stats);
        
        if (this.currentFilters.search || this.currentFilters.status !== 'all' || 
            this.currentFilters.genre !== 'all' || this.currentFilters.year !== 'all') {
            Helpers.showToast(`${this.books.length} kitap bulundu`, 'info');
        }
    }

    clearFilters() {
        this.currentFilters = {
            status: 'all',
            genre: 'all',
            year: 'all',
            search: '',
            sort: 'date'
        };
        
        // Reset inputs
        ['status', 'genre', 'year'].forEach(filter => {
            const element = document.getElementById(`filter-${filter}`);
            if (element) element.value = 'all';
        });
        
        document.getElementById('filter-sort').value = 'date';
        document.getElementById('filter-search').value = '';
        
        this.applyFilters();
        Helpers.showToast('Filtreler sıfırlandı', 'info');
    }

    updateBooksList() {
        const container = document.getElementById('books-list-container');
        if (container) {
            const bookList = new BookList(this.books, this.currentFilters);
            container.innerHTML = bookList.render();
            this.setupBookListEventListeners();
        }
    }

    updateStatsDisplay(stats) {
        const updateValue = (id, value) => {
            const el = document.getElementById(id);
            if (el) {
                // Animate number change
                const start = parseInt(el.textContent) || 0;
                const end = value;
                const duration = 500;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(start + (end - start) * easeProgress);
                    el.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                
                requestAnimationFrame(animate);
            }
        };
        
        updateValue('total-books-count', stats.total);
        updateValue('read-books-count', stats.read);
        updateValue('reading-books-count', stats.reading);
        updateValue('toread-books-count', stats.toread);
    }

    editBook(bookId) {
        const books = storageManager.loadBooks();
        const book = books.find(b => b.id === bookId);
        if (book) {
            window.dispatchEvent(new CustomEvent('editBook', { detail: { book } }));
        }
    }

    deleteBook(bookId) {
        // Custom confirm modal
        const modalHTML = `
            <div class="modal-overlay active" id="delete-confirm-modal">
                <div class="modal" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2 class="modal-title">Kitap Sil</h2>
                        <button class="modal-close" data-modal="delete-confirm-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="text-align: center;">
                        <div style="font-size: 3rem; color: var(--danger-color); margin-bottom: 1rem;">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <p>Bu kitabı silmek istediğinize emin misiniz?</p>
                        <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-top: 0.5rem;">
                            Bu işlem geri alınamaz.
                        </p>
                    </div>
                    <div class="modal-footer" style="justify-content: center;">
                        <button class="btn btn-secondary" data-modal="delete-confirm-modal">İptal</button>
                        <button class="btn btn-danger" id="confirm-delete-btn">
                            <i class="fas fa-trash"></i> Sil
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Close handlers
        document.querySelectorAll('[data-modal="delete-confirm-modal"]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('delete-confirm-modal')?.remove();
            });
        });
        
        // Confirm delete
        document.getElementById('confirm-delete-btn')?.addEventListener('click', () => {
            const success = storageManager.deleteBook(bookId);
            if (success) {
                Helpers.showToast('Kitap başarıyla silindi', 'success');
                this.applyFilters();
                window.app?.updateSidebarStats();
            } else {
                Helpers.showToast('Kitap silinemedi', 'error');
            }
            document.getElementById('delete-confirm-modal')?.remove();
        });
    }

    changeBookStatus(bookId) {
        const books = storageManager.loadBooks();
        const bookIndex = books.findIndex(b => b.id === bookId);
        
        if (bookIndex >= 0) {
            const book = books[bookIndex];
            const statuses = ['toread', 'reading', 'read'];
            const statusLabels = {
                'toread': 'Okunacak',
                'reading': 'Okunuyor',
                'read': 'Okundu'
            };
            const statusIcons = {
                'toread': 'bookmark',
                'reading': 'book-reader',
                'read': 'check-circle'
            };
            const currentIndex = statuses.indexOf(book.status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            const newStatus = statuses[nextIndex];
            
            book.status = newStatus;
            book.updatedAt = new Date().toISOString();
            
            storageManager.saveBooks(books);
            this.applyFilters();
            window.app?.updateSidebarStats();
            
            Helpers.showToast(
                `<i class="fas fa-${statusIcons[newStatus]}"></i> "${book.title}" - ${statusLabels[newStatus]} olarak işaretlendi`,
                'success'
            );
        }
    }

    getYearOptions() {
        const currentYear = new Date().getFullYear();
        const years = [];
        
        for (let year = currentYear; year >= 1900; year--) {
            const selected = this.currentFilters.year == year ? 'selected' : '';
            years.push(`<option value="${year}" ${selected}>${year}</option>`);
        }
        
        return years.join('');
    }
}

export default HomePage;