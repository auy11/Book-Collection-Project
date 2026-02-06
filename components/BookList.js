import Helpers from '../utils/helpers.js';
import Book from '../interfaces/Book.js';

class BookList {
    constructor(books = [], filters = {}) {
        this.books = books;
        this.filters = filters;
    }

    render() {
        if (this.books.length === 0) {
            return this.renderEmptyState();
        }

        return `
            <div class="books-grid">
                ${this.books.map((book, index) => this.renderBookCard(book, index)).join('')}
            </div>
        `;
    }

    renderBookCard(book, index) {
        const statusLabel = Book.getStatusLabel(book.status);
        const statusColor = Book.getStatusColor(book.status);
        const statusIcons = {
            'read': 'check-circle',
            'reading': 'book-reader',
            'toread': 'bookmark'
        };
        
        return `
            <article class="book-card" data-book-id="${book.id}" style="animation-delay: ${index * 0.05}s">
                <div class="book-cover">
                    ${book.coverUrl ? 
                        `<img src="${book.coverUrl}" alt="${book.title}" class="book-cover-img" loading="lazy">` : 
                        `<i class="fas fa-book"></i>`
                    }
                    <span class="book-status-badge status-${statusColor}">
                        <i class="fas fa-${statusIcons[book.status]}"></i> ${statusLabel}
                    </span>
                </div>
                
                <div class="book-content">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    
                    <div class="book-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${book.year}</span>
                        <span><i class="fas fa-tag"></i> ${book.genre}</span>
                    </div>
                    
                    <span class="book-genre">
                        <i class="fas fa-folder"></i> ${book.genre}
                    </span>
                    
                    ${book.description ? `
                        <p class="book-description">${book.description.substring(0, 120)}${book.description.length > 120 ? '...' : ''}</p>
                    ` : '<p class="book-description" style="color: var(--text-tertiary); font-style: italic;">Açıklama yok</p>'}
                    
                    ${book.rating > 0 ? `
                        <div class="book-rating">
                            <div class="star-rating">
                                ${Helpers.renderStars(book.rating)}
                            </div>
                            <small>${book.rating}/5</small>
                        </div>
                    ` : `
                        <div class="book-rating">
                            <div class="star-rating" style="color: var(--gray-300);">
                                <i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>
                            </div>
                            <small style="color: var(--text-tertiary);">Puanlanmadı</small>
                        </div>
                    `}
                    
                    <div class="book-actions">
                        <button class="btn btn-outline btn-small edit-btn" data-id="${book.id}" title="Düzenle">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="btn btn-ghost btn-small status-btn" data-id="${book.id}" data-status="${book.status}" title="Durum Değiştir">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn btn-ghost btn-small delete-btn" data-id="${book.id}" title="Sil" style="color: var(--danger-color);">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    renderEmptyState() {
        const hasFilters = this.filters.status !== 'all' || 
                          this.filters.genre !== 'all' || 
                          this.filters.year !== 'all' || 
                          this.filters.search;
        
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <h3>${hasFilters ? 'Sonuç Bulunamadı' : 'Koleksiyonunuz Boş'}</h3>
                <p>${hasFilters ? 
                    'Aramanıza uygun kitap bulunamadı. Filtrelerinizi değiştirmeyi deneyin.' : 
                    'Henüz hiç kitap eklenmemiş. İlk kitabınızı ekleyerek başlayın!'}</p>
                ${!hasFilters ? `
                    <button class="btn btn-primary btn-large" id="add-first-book" style="margin-top: 1rem;">
                        <i class="fas fa-plus"></i> İlk Kitabı Ekle
                    </button>
                ` : `
                    <button class="btn btn-secondary" id="clear-filters-empty" style="margin-top: 1rem;">
                        <i class="fas fa-undo"></i> Filtreleri Temizle
                    </button>
                `}
            </div>
        `;
    }

    setupEventListeners(onEdit, onDelete, onChangeStatus) {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.currentTarget.dataset.id;
                onEdit(bookId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.currentTarget.dataset.id;
                onDelete(bookId);
            });
        });

        // Status change buttons
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.currentTarget.dataset.id;
                // Add spin animation
                const icon = e.currentTarget.querySelector('i');
                icon.classList.add('fa-spin');
                setTimeout(() => icon.classList.remove('fa-spin'), 500);
                onChangeStatus(bookId);
            });
        });

        // Add first book button
        document.getElementById('add-first-book')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: 'add-book' } }));
        });

        // Clear filters button in empty state
        document.getElementById('clear-filters-empty')?.addEventListener('click', () => {
            document.getElementById('clear-filters-btn')?.click();
        });
    }
}

export default BookList;