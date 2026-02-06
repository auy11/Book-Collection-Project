import Helpers from '../utils/helpers.js';
import Book from '../interfaces/Book.js';

class BookItem {
    constructor(book) {
        this.book = book;
    }

    renderDetailModal() {
        const statusLabel = Book.getStatusLabel(this.book.status);
        const formattedDate = Helpers.formatDate(this.book.createdAt);
        
        return `
            <div class="modal-overlay active" id="book-detail-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">${this.book.title}</h2>
                        <button class="modal-close" data-modal="book-detail-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="book-detail-header">
                            <div class="book-detail-cover">
                                ${this.book.coverUrl ? 
                                    `<img src="${this.book.coverUrl}" alt="${this.book.title}" style="width: 150px; height: 200px; object-fit: cover; border-radius: 8px;">` : 
                                    `<div style="width: 150px; height: 200px; background: linear-gradient(135deg, #4361ee, #3a0ca3); display: flex; align-items: center; justify-content: center; border-radius: 8px; color: white; font-size: 3rem;">
                                        <i class="fas fa-book"></i>
                                    </div>`
                                }
                            </div>
                            
                            <div class="book-detail-info">
                                <h3>${this.book.title}</h3>
                                <p class="author"><strong>Yazar:</strong> ${this.book.author}</p>
                                <p class="year"><strong>Yayın Yılı:</strong> ${this.book.year}</p>
                                <p class="genre"><strong>Tür:</strong> ${this.book.genre}</p>
                                <p class="status"><strong>Durum:</strong> 
                                    <span class="status-badge status-${Book.getStatusColor(this.book.status)}">
                                        ${statusLabel}
                                    </span>
                                </p>
                                
                                ${this.book.rating > 0 ? `
                                    <div class="rating">
                                        <strong>Puan:</strong>
                                        <div class="star-rating">
                                            ${Helpers.renderStars(this.book.rating)}
                                        </div>
                                        <span>(${this.book.rating}/5)</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${this.book.description ? `
                            <div class="book-description-section">
                                <h4>Açıklama</h4>
                                <p>${this.book.description}</p>
                            </div>
                        ` : ''}
                        
                        <div class="book-meta-info">
                            <p><small><strong>Eklenme Tarihi:</strong> ${formattedDate}</small></p>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-modal="book-detail-modal">Kapat</button>
                        <button class="btn btn-primary" id="edit-detail-btn">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners(onEdit) {
        // Close button
        document.querySelectorAll('[data-modal="book-detail-modal"]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('book-detail-modal')?.remove();
            });
        });

        // Edit button
        const editBtn = document.getElementById('edit-detail-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                document.getElementById('book-detail-modal')?.remove();
                onEdit(this.book.id);
            });
        }
    }
}

export default BookItem;