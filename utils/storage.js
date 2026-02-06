// LocalStorage yönetimi
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'bookCollection';
        this.USER_KEY = 'bookUserSettings';
    }

    // Kitapları kaydet
    saveBooks(books) {
        try {
            const booksData = books.map(book => 
                typeof book.toJSON === 'function' ? book.toJSON() : book
            );
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(booksData));
            return true;
        } catch (error) {
            console.error('Kitaplar kaydedilemedi:', error);
            return false;
        }
    }

    // Kitapları yükle
    loadBooks() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const booksData = JSON.parse(stored);
                // Demo verileri ekle (eğer hiç kitap yoksa)
                if (booksData.length === 0) {
                    return this.getDemoBooks();
                }
                return booksData.map(book => ({
                    ...book,
                    createdAt: new Date(book.createdAt),
                    updatedAt: new Date(book.updatedAt)
                }));
            }
            return this.getDemoBooks();
        } catch (error) {
            console.error('Kitaplar yüklenemedi:', error);
            return this.getDemoBooks();
        }
    }

    // Demo kitaplar (ilk kullanım için)
    getDemoBooks() {
        return [
            {
                id: 'book_1',
                title: 'Suç ve Ceza',
                author: 'Fyodor Dostoyevski',
                year: 1866,
                genre: 'Roman',
                status: 'read',
                rating: 5,
                coverUrl: '',
                description: 'Raskolnikov\'un psikolojik çöküşünü anlatan başyapıt.',
                createdAt: new Date('2023-01-15').toISOString(),
                updatedAt: new Date('2023-01-20').toISOString()
            },
            {
                id: 'book_2',
                title: '1984',
                author: 'George Orwell',
                year: 1949,
                genre: 'Bilim Kurgu',
                status: 'read',
                rating: 4,
                coverUrl: '',
                description: 'Distopik bir gelecek tasviri.',
                createdAt: new Date('2023-02-10').toISOString(),
                updatedAt: new Date('2023-02-15').toISOString()
            },
            {
                id: 'book_3',
                title: 'Sefiller',
                author: 'Victor Hugo',
                year: 1862,
                genre: 'Roman',
                status: 'reading',
                rating: 0,
                coverUrl: '',
                description: 'Jean Valjean\'ın hikayesi.',
                createdAt: new Date('2023-03-01').toISOString(),
                updatedAt: new Date('2023-03-01').toISOString()
            },
            {
                id: 'book_4',
                title: 'Küçük Prens',
                author: 'Antoine de Saint-Exupéry',
                year: 1943,
                genre: 'Çocuk',
                status: 'toread',
                rating: 0,
                coverUrl: '',
                description: 'Felsefi bir çocuk kitabı.',
                createdAt: new Date('2023-03-05').toISOString(),
                updatedAt: new Date('2023-03-05').toISOString()
            }
        ];
    }

    // Tekil kitap ekle/güncelle
    saveBook(book) {
        const books = this.loadBooks();
        const existingIndex = books.findIndex(b => b.id === book.id);
        
        if (existingIndex >= 0) {
            // Güncelle
            books[existingIndex] = {
                ...book,
                updatedAt: new Date().toISOString()
            };
        } else {
            // Yeni ekle
            books.push({
                ...book,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        
        return this.saveBooks(books);
    }

    // Kitap sil
    deleteBook(bookId) {
        const books = this.loadBooks();
        const filteredBooks = books.filter(book => book.id !== bookId);
        return this.saveBooks(filteredBooks);
    }

    // Filtreleme
    filterBooks(filters = {}) {
        let books = this.loadBooks();
        
        if (filters.status && filters.status !== 'all') {
            books = books.filter(book => book.status === filters.status);
        }
        
        if (filters.genre && filters.genre !== 'all') {
            books = books.filter(book => book.genre === filters.genre);
        }
        
        if (filters.year && filters.year !== 'all') {
            books = books.filter(book => book.year == filters.year);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            books = books.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm)
            );
        }
        
        // Sıralama
        if (filters.sort) {
            switch (filters.sort) {
                case 'title':
                    books.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'year':
                    books.sort((a, b) => b.year - a.year);
                    break;
                case 'rating':
                    books.sort((a, b) => b.rating - a.rating);
                    break;
                case 'date':
                    books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
            }
        }
        
        return books;
    }

    // İstatistikler
    getStatistics() {
        const books = this.loadBooks();
        
        const stats = {
            total: books.length,
            read: books.filter(b => b.status === 'read').length,
            reading: books.filter(b => b.status === 'reading').length,
            toread: books.filter(b => b.status === 'toread').length,
            
            averageRating: 0,
            byGenre: {},
            byYear: {}
        };
        
        // Ortalama puan
        const ratedBooks = books.filter(b => b.rating > 0);
        if (ratedBooks.length > 0) {
            const totalRating = ratedBooks.reduce((sum, book) => sum + book.rating, 0);
            stats.averageRating = (totalRating / ratedBooks.length).toFixed(1);
        }
        
        // Tür dağılımı
        books.forEach(book => {
            stats.byGenre[book.genre] = (stats.byGenre[book.genre] || 0) + 1;
            stats.byYear[book.year] = (stats.byYear[book.year] || 0) + 1;
        });
        
        return stats;
    }

    // Kullanıcı ayarlarını kaydet
    saveUserSettings(settings) {
        try {
            const currentSettings = this.loadUserSettings();
            const newSettings = { ...currentSettings, ...settings };
            localStorage.setItem(this.USER_KEY, JSON.stringify(newSettings));
            return true;
        } catch (error) {
            console.error('Ayarlar kaydedilemedi:', error);
            return false;
        }
    }

    // Kullanıcı ayarlarını yükle
    loadUserSettings() {
        try {
            const stored = localStorage.getItem(this.USER_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            return {
                readingGoal: 10,
                theme: 'light',
                notifications: true
            };
        } catch (error) {
            console.error('Ayarlar yüklenemedi:', error);
            return {
                readingGoal: 10,
                theme: 'light',
                notifications: true
            };
        }
    }

    // Tüm verileri temizle (test için)
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.USER_KEY);
        return true;
    }

    // Veri yedeği al
    exportData() {
        const data = {
            books: this.loadBooks(),
            settings: this.loadUserSettings(),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    // Veri yükle
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (data.books) {
                this.saveBooks(data.books);
            }
            
            if (data.settings) {
                this.saveUserSettings(data.settings);
            }
            
            return { success: true, message: 'Veriler başarıyla yüklendi' };
        } catch (error) {
            return { success: false, message: 'Geçersiz veri formatı' };
        }
    }
}

// Singleton instance
const storageManager = new StorageManager();
export default storageManager;