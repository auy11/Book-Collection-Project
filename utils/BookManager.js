// utils/BookManager.js - Book CRUD Operations

export class BookManager {
    constructor() {
        this.storageKey = 'bookCollection';
        this.books = this.loadFromStorage();
        
        // Auto-load sample books if storage is empty
        if (this.books.length === 0) {
            this.loadSampleBooks();
        }
    }

    // Load books from localStorage
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading books:', error);
            return [];
        }
    }

    // Load sample books from JSON file
    async loadSampleBooks() {
        try {
            // Try multiple possible paths
            const possiblePaths = [
                './data/sample-books.json',
                '/data/sample-books.json',
                'data/sample-books.json'
            ];
            
            for (const path of possiblePaths) {
                try {
                    const response = await fetch(path);
                    if (response.ok) {
                        const sampleBooks = await response.json();
                        this.books = sampleBooks.map(book => ({
                            ...book,
                            createdAt: book.createdAt || new Date().toISOString(),
                            updatedAt: book.updatedAt || new Date().toISOString()
                        }));
                        this.saveToStorage();
                        console.log('✅ Sample books loaded:', this.books.length, 'books');
                        return true;
                    }
                } catch (err) {
                    continue;
                }
            }
            
            // If JSON loading fails, create some default books
            console.log('⚠️ Could not load sample-books.json, creating default books...');
            this.createDefaultBooks();
            return true;
            
        } catch (error) {
            console.log('ℹ️ Error loading sample books:', error);
            this.createDefaultBooks();
        }
        return false;
    }

    // Create some default books if JSON file is not available
    createDefaultBooks() {
        const defaultBooks = [
            {
                id: this.generateId(),
                title: "1984",
                author: "George Orwell",
                category: "Roman",
                pages: 328,
                year: 1949,
                status: "read",
                rating: 5,
                notes: "Distopya türünün başyapıtlarından biri.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Suç ve Ceza",
                author: "Fyodor Dostoyevski",
                category: "Roman",
                pages: 671,
                year: 1866,
                status: "read",
                rating: 5,
                notes: "Rus edebiyatının başyapıtlarından biri.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Tutunamayanlar",
                author: "Oğuz Atay",
                category: "Roman",
                pages: 724,
                year: 1972,
                status: "reading",
                rating: 5,
                notes: "Türk edebiyatının zirvesi.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Simyacı",
                author: "Paulo Coelho",
                category: "Roman",
                pages: 176,
                year: 1988,
                status: "read",
                rating: 4.5,
                notes: "Kendi efsanemizi yaşamak üzerine ilham verici bir hikaye.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Yüzüklerin Efendisi",
                author: "J.R.R. Tolkien",
                category: "Fantastik",
                pages: 1178,
                year: 1954,
                status: "reading",
                rating: 5,
                notes: "Fantastik edebiyatın baş yapıtı.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Sapiens",
                author: "Yuval Noah Harari",
                category: "Tarih",
                pages: 443,
                year: 2011,
                status: "unread",
                rating: 0,
                notes: "İnsanlık tarihine farklı bir bakış açısı.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        this.books = defaultBooks;
        this.saveToStorage();
        console.log('✅ Created', defaultBooks.length, 'default books');
    }

    // Save books to localStorage
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.books));
            return true;
        } catch (error) {
            console.error('Error saving books:', error);
            return false;
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    // CREATE - Add new book
    addBook(bookData) {
        const newBook = {
            id: this.generateId(),
            title: bookData.title,
            author: bookData.author,
            category: bookData.category,
            pages: bookData.pages || 0,
            year: bookData.year || new Date().getFullYear(),
            status: bookData.status || 'unread',
            rating: bookData.rating || 0,
            notes: bookData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.books.push(newBook);
        this.saveToStorage();
        
        console.log('✅ Book added:', newBook.title);
        return newBook;
    }

    // READ - Get all books
    getAllBooks() {
        return [...this.books];
    }

    // READ - Get book by ID
    getBookById(id) {
        return this.books.find(book => book.id === id);
    }

    // UPDATE - Update existing book
    updateBook(id, bookData) {
        const index = this.books.findIndex(book => book.id === id);
        
        if (index === -1) {
            throw new Error('Book not found');
        }

        this.books[index] = {
            ...this.books[index],
            ...bookData,
            id: id, // Preserve original ID
            createdAt: this.books[index].createdAt, // Preserve creation date
            updatedAt: new Date().toISOString()
        };

        this.saveToStorage();
        
        console.log('✅ Book updated:', this.books[index].title);
        return this.books[index];
    }

    // DELETE - Remove book
    deleteBook(id) {
        const index = this.books.findIndex(book => book.id === id);
        
        if (index === -1) {
            throw new Error('Book not found');
        }

        const deletedBook = this.books.splice(index, 1)[0];
        this.saveToStorage();
        
        console.log('🗑️ Book deleted:', deletedBook.title);
        return deletedBook;
    }

    // Get books by category
    getBooksByCategory(category) {
        return this.books.filter(book => book.category === category);
    }

    // Get books by status
    getBooksByStatus(status) {
        return this.books.filter(book => book.status === status);
    }

    // Search books
    searchBooks(query) {
        const searchTerm = query.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm)
        );
    }

    // Get statistics
    getStats() {
        return {
            total: this.books.length,
            read: this.books.filter(b => b.status === 'read').length,
            reading: this.books.filter(b => b.status === 'reading').length,
            unread: this.books.filter(b => b.status === 'unread').length,
            categories: [...new Set(this.books.map(b => b.category))].length,
            averageRating: this.getAverageRating()
        };
    }

    // Get average rating
    getAverageRating() {
        const ratedBooks = this.books.filter(b => b.rating > 0);
        if (ratedBooks.length === 0) return 0;
        
        const sum = ratedBooks.reduce((acc, book) => acc + book.rating, 0);
        return (sum / ratedBooks.length).toFixed(2);
    }

    // Clear all books (with confirmation)
    clearAll() {
        this.books = [];
        this.saveToStorage();
        console.log('🗑️ All books cleared');
    }

    // Export books as JSON
    exportToJSON() {
        return JSON.stringify(this.books, null, 2);
    }

    // Import books from JSON
    importFromJSON(jsonString) {
        try {
            const importedBooks = JSON.parse(jsonString);
            if (!Array.isArray(importedBooks)) {
                throw new Error('Invalid data format');
            }
            
            this.books = importedBooks;
            this.saveToStorage();
            console.log('✅ Books imported successfully');
            return true;
        } catch (error) {
            console.error('Error importing books:', error);
            return false;
        }
    }
}