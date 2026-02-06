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
                ${this.books.map(book => this.renderBookCard(book)).join('')}
            </div>
        `;
    }

    renderBookCard(book) {
        const statusLabel = Book.getStatusLabel(book.status);
        const statusColor = Book.getStatusColor(book.status);
        
        return `
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-cover">
                    ${book.coverUrl ? 
                        `<img src="${book.coverUrl}" alt="${book.title}" class="book-cover-img">` : 
                        `<i class="fas fa-book"></i>`
                    }
                    <span class="book-status-badge status-${statusColor}">
                        ${statusLabel}
                    </span>
                </div>
                
                <div class="book-content">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    
                    <div class="book-meta">
                        <span><i class="fas fa-calendar"></i> ${book.year}</span>
                        <span><i class="fas fa-tag"></i> ${book.genre}</span>
                    </div>
                    
                    <div class="book-genre">${book.genre}</div>
                    
                    ${book.description ? `
                        <p class="book-description">${book.description.substring(0, 100)}${book.description.length > 100 ? '...' : ''}</p>
                    ` : ''}
                    
                    ${book.rating > 0 ? `
                        <div class="book-rating">
                            <div class="star-rating">
                                ${Helpers.renderStars(book.rating)}
                            </div>
                            <small>${book.rating}/5</small>
                        </div>
                    ` : ''}
                    
                    <div class="book-actions">
                        <button class="btn btn-outline btn-small edit-btn" data-id="${book.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-small delete-btn" data-id="${book.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-primary btn-small status-btn" data-id="${book.id}" data-status="${book.status}">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        const filterText = Object.keys(this.filters).length > 0 ? 
            'Aramanıza uygun kitap bulunamadı.' : 
            'Henüz hiç kitap eklenmemiş. İlk kitabınızı ekleyin!';
        
        return `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>${filterText}</h3>
                ${Object.keys(this.filters).length > 0 ? 
                    '<p>Filtrelerinizi değiştirmeyi deneyin veya yeni bir kitap ekleyin.</p>' : 
                    '<button class="btn btn-primary mt-2" id="add-first-book">İlk Kitabı Ekle</button>'
                }
            </div>
        `;
    }

    setupEventListeners(onEdit, onDelete, onChangeStatus) {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.target.closest('.edit-btn').dataset.id;
                onEdit(bookId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.target.closest('.delete-btn').dataset.id;
                onDelete(bookId);
            });
        });

        // Status change buttons
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.target.closest('.status-btn').dataset.id;
                onChangeStatus(bookId);
            });
        });

        // Add first book button
        const addFirstBtn = document.getElementById('add-first-book');
        if (addFirstBtn) {
            addFirstBtn.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: 'add-book' } }));
            });
        }
    }
}

export default BookList;