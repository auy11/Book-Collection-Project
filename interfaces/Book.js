// Book Interface - Kitap veri yapısı
class Book {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.title = data.title || '';
        this.author = data.author || '';
        this.year = data.year || new Date().getFullYear();
        this.genre = data.genre || 'Diğer';
        this.status = data.status || 'toread'; // toread, reading, read
        this.rating = data.rating || 0;
        this.coverUrl = data.coverUrl || '';
        this.description = data.description || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    generateId() {
        return 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    validate() {
        const errors = [];
        
        if (!this.title.trim()) {
            errors.push('Kitap başlığı gereklidir');
        }
        
        if (!this.author.trim()) {
            errors.push('Yazar adı gereklidir');
        }
        
        if (this.year < 1000 || this.year > new Date().getFullYear() + 5) {
            errors.push('Geçerli bir yıl giriniz');
        }
        
        if (this.rating < 0 || this.rating > 5) {
            errors.push('Puan 0-5 arasında olmalıdır');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            year: this.year,
            genre: this.genre,
            status: this.status,
            rating: this.rating,
            coverUrl: this.coverUrl,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromJSON(json) {
        return new Book(json);
    }

    // Durum etiketleri
    static getStatusLabel(status) {
        const labels = {
            'read': 'Okundu',
            'reading': 'Okunuyor',
            'toread': 'Okunacak'
        };
        return labels[status] || 'Bilinmeyen';
    }

    static getStatusColor(status) {
        const colors = {
            'read': 'success',
            'reading': 'warning',
            'toread': 'secondary'
        };
        return colors[status] || 'secondary';
    }

    // Tür listesi
    static getGenres() {
        return [
            'Roman',
            'Bilim Kurgu',
            'Fantastik',
            'Tarih',
            'Biyografi',
            'Kişisel Gelişim',
            'Polisiye',
            'Macera',
            'Çocuk',
            'Şiir',
            'Deneme',
            'Diğer'
        ];
    }
}

export default Book;