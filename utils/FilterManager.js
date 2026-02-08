// utils/FilterManager.js - Filter and Search Operations

export class FilterManager {
    constructor() {
        this.filters = {
            searchTerm: '',
            category: '',
            status: ''
        };
    }

    // Set search term
    setSearchTerm(term) {
        this.filters.searchTerm = term.toLowerCase().trim();
    }

    // Set category filter
    setCategory(category) {
        this.filters.category = category;
    }

    // Set status filter
    setStatus(status) {
        this.filters.status = status;
    }

    // Reset all filters
    resetFilters() {
        this.filters = {
            searchTerm: '',
            category: '',
            status: ''
        };
    }

    // Apply all active filters to books array
    filter(books) {
        let filteredBooks = [...books];

        // Apply search filter
        if (this.filters.searchTerm) {
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(this.filters.searchTerm) ||
                book.author.toLowerCase().includes(this.filters.searchTerm) ||
                book.category.toLowerCase().includes(this.filters.searchTerm) ||
                (book.notes && book.notes.toLowerCase().includes(this.filters.searchTerm))
            );
        }

        // Apply category filter
        if (this.filters.category) {
            filteredBooks = filteredBooks.filter(book => 
                book.category === this.filters.category
            );
        }

        // Apply status filter
        if (this.filters.status) {
            filteredBooks = filteredBooks.filter(book => 
                book.status === this.filters.status
            );
        }

        return filteredBooks;
    }

    // Get active filters
    getActiveFilters() {
        const active = [];
        
        if (this.filters.searchTerm) {
            active.push({ type: 'search', value: this.filters.searchTerm });
        }
        if (this.filters.category) {
            active.push({ type: 'category', value: this.filters.category });
        }
        if (this.filters.status) {
            active.push({ type: 'status', value: this.filters.status });
        }
        
        return active;
    }

    // Check if any filter is active
    hasActiveFilters() {
        return this.filters.searchTerm !== '' || 
               this.filters.category !== '' || 
               this.filters.status !== '';
    }
}