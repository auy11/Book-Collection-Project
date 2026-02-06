import Helpers from '../utils/helpers.js';
import Book from '../interfaces/Book.js';

class BookForm {
    constructor(bookData = null, isEdit = false) {
        this.bookData = bookData;
        this.isEdit = isEdit;
        this.currentRating = bookData?.rating || 0;
    }

    render() {
        const title = this.isEdit ? 'Kitap Düzenle' : 'Yeni Kitap Ekle';
        const buttonText = this.isEdit ? 'Güncelle' : 'Ekle';

        return `
            <div class="form-container">
                <div class="page-header">
                    <h1>${title}</h1>
                    <div class="page-actions">
                        <button class="btn btn-secondary" id="cancel-btn">
                            <i class="fas fa-times"></i> İptal
                        </button>
                    </div>
                </div>

                <form id="book-form">
                    <div class="form-group">
                        <label class="form-label" for="title">Kitap Adı *</label>
                        <input type="text" id="title" name="title" class="form-input" 
                               value="${this.bookData?.title || ''}" 
                               placeholder="Kitap adını giriniz" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="author">Yazar *</label>
                        <input type="text" id="author" name="author" class="form-input" 
                               value="${this.bookData?.author || ''}" 
                               placeholder="Yazar adını giriniz" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="year">Yayın Yılı</label>
                            <input type="number" id="year" name="year" class="form-input" 
                                   value="${this.bookData?.year || new Date().getFullYear()}" 
                                   min="1000" max="${new Date().getFullYear() + 5}">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="genre">Tür</label>
                            <select id="genre" name="genre" class="form-select">
                                ${Book.getGenres().map(genre => `
                                    <option value="${genre}" ${this.bookData?.genre === genre ? 'selected' : ''}>
                                        ${genre}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="status">Durum</label>
                        <select id="status" name="status" class="form-select">
                            <option value="toread" ${this.bookData?.status === 'toread' ? 'selected' : ''}>
                                Okunacak
                            </option>
                            <option value="reading" ${this.bookData?.status === 'reading' ? 'selected' : ''}>
                                Okunuyor
                            </option>
                            <option value="read" ${this.bookData?.status === 'read' ? 'selected' : ''}>
                                Okundu
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Puan</label>
                        <div class="rating-stars" id="rating-stars">
                            ${[1, 2, 3, 4, 5].map(star => `
                                <i class="star ${star <= this.currentRating ? 'fas fa-star active' : 'far fa-star'}" 
                                   data-rating="${star}"></i>
                            `).join('')}
                        </div>
                        <input type="hidden" id="rating" name="rating" value="${this.currentRating}">
                        <div class="mt-1">
                            <small>Seçili puan: <span id="selected-rating">${this.currentRating || '0'}</span>/5</small>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="coverUrl">Kapak Resmi URL</label>
                        <input type="url" id="coverUrl" name="coverUrl" class="form-input" 
                               value="${this.bookData?.coverUrl || ''}" 
                               placeholder="https://example.com/kitap-kapagi.jpg">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="description">Açıklama</label>
                        <textarea id="description" name="description" class="form-textarea" 
                                  placeholder="Kitap hakkında notlarınız...">${this.bookData?.description || ''}</textarea>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="form-cancel-btn">
                            İptal
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> ${buttonText}
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    setupEventListeners(onSubmit, onCancel) {
        // Rating stars
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.currentRating = rating;
                this.updateRatingStars();
                document.getElementById('rating').value = rating;
                document.getElementById('selected-rating').textContent = rating;
            });
        });

        // Form submission
        const form = document.getElementById('book-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = Helpers.getFormData('book-form');
                formData.rating = parseInt(formData.rating) || 0;
                formData.year = parseInt(formData.year) || new Date().getFullYear();
                
                if (this.isEdit && this.bookData) {
                    formData.id = this.bookData.id;
                }
                
                onSubmit(formData);
            });
        }

        // Cancel buttons
        ['cancel-btn', 'form-cancel-btn'].forEach(btnId => {
            document.getElementById(btnId)?.addEventListener('click', onCancel);
        });
    }

    updateRatingStars() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            const starNum = index + 1;
            if (starNum <= this.currentRating) {
                star.className = 'star fas fa-star active';
            } else {
                star.className = 'star far fa-star';
            }
        });
    }
}

export default BookForm;