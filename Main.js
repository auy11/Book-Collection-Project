// Main.js - Book Collection Manager with jQuery

import { BookManager } from './utils/BookManager.js';
import { UIManager } from './utils/UIManager.js';
import { FilterManager } from './utils/FilterManager.js';

class App {
    constructor() {
        this.bookManager = new BookManager();
        this.uiManager = new UIManager();
        this.filterManager = new FilterManager();
        this.currentEditId = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready using jQuery
        $(document).ready(async () => {
            this.setupEventListeners();
            
            // Load books (will auto-load samples if empty)
            await this.initializeBooks();
            
            this.updateStats();
            
            console.log('📚 Kitap Koleksiyonu Yöneticisi başlatıldı!');
            console.log('✅ jQuery versiyon:', $.fn.jquery);
            console.log('✅ Bootstrap yüklendi');
        });
    }

    async initializeBooks() {
        // Wait for BookManager to finish loading
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Reload books from storage after sample books are loaded
        this.bookManager.books = this.bookManager.loadFromStorage();
        
        // Render books
        this.loadBooks();
        
        console.log('📚 Toplam kitap sayısı:', this.bookManager.getAllBooks().length);
    }

    setupEventListeners() {
        // Using jQuery for event handling
        
        // Save book button
        $('#saveBookBtn').on('click', () => this.handleSaveBook());
        
        // Add new book button
        $('#addNewBookBtn').on('click', () => this.resetForm());
        
        // Load sample books button
        $('#loadSampleBooksBtn').on('click', async () => {
            if (confirm('100 örnek kitap yüklensin mi? (Mevcut veriler silinecek)')) {
                await this.loadSampleBooksManually();
            }
        });
        
        // Search input with jQuery
        $('#searchInput').on('input', (e) => {
            this.filterManager.setSearchTerm(e.target.value);
            this.filterBooks();
        });
        
        // Category filter
        $('#categoryFilter').on('change', (e) => {
            this.filterManager.setCategory(e.target.value);
            this.filterBooks();
        });
        
        // Status filter
        $('#statusFilter').on('change', (e) => {
            this.filterManager.setStatus(e.target.value);
            this.filterBooks();
        });
        
        // Modal events using Bootstrap + jQuery
        $('#bookModal').on('show.bs.modal', () => {
            if (!this.currentEditId) {
                this.resetForm();
            }
        });
        
        $('#bookModal').on('hidden.bs.modal', () => {
            this.resetForm();
        });
        
        // Form validation using jQuery
        $('#bookForm').on('submit', (e) => {
            e.preventDefault();
            this.handleSaveBook();
        });
    }

    async loadSampleBooksManually() {
        try {
            // Show loading
            this.uiManager.showLoading();
            
            // Try to load from JSON file first
            const loaded = await this.bookManager.loadSampleBooks();
            
            if (loaded) {
                // Reload UI
                await this.initializeBooks();
                this.updateStats();
                this.showAlert('100 kitap başarıyla yüklendi!', 'success');
            } else {
                this.showAlert('Örnek kitaplar yüklenemedi!', 'error');
            }
        } catch (error) {
            console.error('Error loading sample books:', error);
            this.showAlert('Bir hata oluştu: ' + error.message, 'danger');
        }
    }

    handleSaveBook() {
        // Get form values using jQuery
        const bookData = {
            title: $('#bookTitle').val().trim(),
            author: $('#bookAuthor').val().trim(),
            category: $('#bookCategory').val(),
            pages: parseInt($('#bookPages').val()) || 0,
            year: parseInt($('#bookYear').val()) || new Date().getFullYear(),
            status: $('#bookStatus').val(),
            rating: parseFloat($('#bookRating').val()) || 0,
            notes: $('#bookNotes').val().trim()
        };

        // Validation
        if (!bookData.title || !bookData.author || !bookData.category) {
            // Using Bootstrap alerts with jQuery
            this.showAlert('Lütfen zorunlu alanları doldurun!', 'warning');
            return;
        }

        try {
            if (this.currentEditId) {
                // Update existing book
                this.bookManager.updateBook(this.currentEditId, bookData);
                this.showAlert('Kitap başarıyla güncellendi!', 'success');
            } else {
                // Add new book
                this.bookManager.addBook(bookData);
                this.showAlert('Kitap başarıyla eklendi!', 'success');
            }

            // Close modal using jQuery and Bootstrap
            const modal = bootstrap.Modal.getInstance($('#bookModal')[0]);
            modal.hide();
            
            this.loadBooks();
            this.updateStats();
            this.resetForm();
            
        } catch (error) {
            this.showAlert('Bir hata oluştu: ' + error.message, 'danger');
        }
    }

    loadBooks() {
        const books = this.bookManager.getAllBooks();
        this.renderBooks(books);
    }

    filterBooks() {
        const allBooks = this.bookManager.getAllBooks();
        const filteredBooks = this.filterManager.filter(allBooks);
        this.renderBooks(filteredBooks);
    }

    renderBooks(books) {
        const container = $('#booksContainer');
        const emptyState = $('#emptyState');

        if (books.length === 0) {
            container.hide();
            emptyState.show();
            return;
        }

        emptyState.hide();
        container.show().empty();

        books.forEach(book => {
            const bookCard = this.createBookCard(book);
            container.append(bookCard);
        });

        // Update total count with jQuery
        $('#totalBooksCount').html(`
            <i class="bi bi-collection"></i> Toplam: ${books.length} kitap
        `);
    }

    createBookCard(book) {
        const statusInfo = this.getStatusInfo(book.status);
        const stars = this.generateStars(book.rating);
        
        const card = $(`
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="card book-card shadow">
                    <div class="book-card-header">
                        <span class="category-badge">${book.category}</span>
                        <h5 class="book-title" title="${book.title}">${book.title}</h5>
                        <div class="book-author">
                            <i class="bi bi-person-fill"></i>
                            ${book.author}
                        </div>
                    </div>
                    <div class="book-card-body">
                        <div class="book-info-item">
                            <span class="book-info-label">Durum:</span>
                            <span class="status-badge status-${book.status}">
                                <i class="${statusInfo.icon}"></i>
                                ${statusInfo.text}
                            </span>
                        </div>
                        
                        ${book.pages > 0 ? `
                            <div class="book-info-item">
                                <span class="book-info-label">Sayfa:</span>
                                <span class="book-info-value">
                                    <i class="bi bi-file-text"></i> ${book.pages}
                                </span>
                            </div>
                        ` : ''}
                        
                        ${book.year ? `
                            <div class="book-info-item">
                                <span class="book-info-label">Yıl:</span>
                                <span class="book-info-value">
                                    <i class="bi bi-calendar"></i> ${book.year}
                                </span>
                            </div>
                        ` : ''}
                        
                        ${book.rating > 0 ? `
                            <div class="book-info-item">
                                <span class="book-info-label">Puan:</span>
                                <span class="rating-stars">${stars}</span>
                            </div>
                        ` : ''}
                        
                        ${book.notes ? `
                            <div class="book-notes">
                                <i class="bi bi-chat-left-quote"></i>
                                ${book.notes}
                            </div>
                        ` : ''}
                        
                        <div class="book-actions">
                            <button class="btn btn-sm btn-primary" data-action="edit" data-id="${book.id}">
                                <i class="bi bi-pencil"></i> Düzenle
                            </button>
                            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${book.id}">
                                <i class="bi bi-trash"></i> Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Event handlers using jQuery event delegation
        card.find('[data-action="edit"]').on('click', () => this.handleEdit(book.id));
        card.find('[data-action="delete"]').on('click', () => this.handleDelete(book.id));

        return card;
    }

    getStatusInfo(status) {
        const statusMap = {
            'read': { text: 'Okundu', icon: 'bi bi-check-circle-fill' },
            'reading': { text: 'Okunuyor', icon: 'bi bi-book-half' },
            'unread': { text: 'Okunmadı', icon: 'bi bi-circle' }
        };
        return statusMap[status] || statusMap['unread'];
    }

    generateStars(rating) {
        if (!rating) return '';
        
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="bi bi-star-fill"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="bi bi-star-half"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="bi bi-star"></i>';
        }
        
        return stars;
    }

    handleEdit(bookId) {
        const book = this.bookManager.getBookById(bookId);
        if (!book) return;

        this.currentEditId = bookId;

        // Fill form using jQuery
        $('#bookId').val(book.id);
        $('#bookTitle').val(book.title);
        $('#bookAuthor').val(book.author);
        $('#bookCategory').val(book.category);
        $('#bookPages').val(book.pages || '');
        $('#bookYear').val(book.year || '');
        $('#bookStatus').val(book.status);
        $('#bookRating').val(book.rating || '');
        $('#bookNotes').val(book.notes || '');

        // Update modal title
        $('#modalTitle').html('<i class="bi bi-pencil"></i> Kitap Düzenle');

        // Show modal using Bootstrap
        const modal = new bootstrap.Modal($('#bookModal')[0]);
        modal.show();
    }

    handleDelete(bookId) {
        const book = this.bookManager.getBookById(bookId);
        if (!book) return;

        // Confirmation using jQuery and SweetAlert-style
        if (confirm(`"${book.title}" kitabını silmek istediğinize emin misiniz?`)) {
            this.bookManager.deleteBook(bookId);
            this.showAlert('Kitap başarıyla silindi!', 'info');
            this.loadBooks();
            this.updateStats();
        }
    }

    resetForm() {
        this.currentEditId = null;
        
        // Reset form using jQuery
        $('#bookForm')[0].reset();
        $('#bookId').val('');
        $('#modalTitle').html('<i class="bi bi-book"></i> Yeni Kitap Ekle');
    }

    updateStats() {
        const books = this.bookManager.getAllBooks();
        
        const stats = {
            total: books.length,
            read: books.filter(b => b.status === 'read').length,
            reading: books.filter(b => b.status === 'reading').length,
            unread: books.filter(b => b.status === 'unread').length
        };

        // Update stats using jQuery
        $('#readCount').text(stats.read);
        $('#readingCount').text(stats.reading);
        $('#unreadCount').text(stats.unread);
        $('#totalBooksCount').html(`
            <i class="bi bi-collection"></i> Toplam: ${stats.total} kitap
        `);
    }

    showAlert(message, type = 'info') {
        // Create Bootstrap alert using jQuery
        const alert = $(`
            <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
                 style="z-index: 9999; min-width: 300px;" role="alert">
                <i class="bi bi-info-circle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        $('body').append(alert);

        // Auto dismiss after 3 seconds using jQuery
        setTimeout(() => {
            alert.fadeOut(400, function() {
                $(this).remove();
            });
        }, 3000);
    }
}

// Initialize the app
const app = new App();

// Export for global access if needed
window.BookApp = app;