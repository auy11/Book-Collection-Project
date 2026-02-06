import Helpers from '../utils/helpers.js';
import storageManager from '../utils/storage.js';

class StatisticsPage {
    constructor() {
        this.stats = {};
    }

    render() {
        this.stats = storageManager.getStatistics();
        
        return `
            <div class="page-header animate-slide-up">
                <h1>İstatistikler ve Analizler</h1>
                <div class="page-actions">
                    <button class="btn btn-secondary" id="refresh-stats-btn">
                        <i class="fas fa-sync-alt"></i> Yenile
                    </button>
                </div>
            </div>

            <div class="stats-grid animate-slide-up" style="animation-delay: 0.1s">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-value">${this.stats.total}</div>
                    <div class="stat-label">Toplam Kitap</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--success-light); color: var(--success-color);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-value" style="background: linear-gradient(135deg, var(--success-color), #059669); -webkit-background-clip: text;">${this.stats.read}</div>
                    <div class="stat-label">Okunan</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--primary-100); color: var(--primary-600);">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="stat-value" style="background: linear-gradient(135deg, var(--primary-600), var(--primary-400)); -webkit-background-clip: text;">
                        ${this.stats.total > 0 ? Math.round((this.stats.read / this.stats.total) * 100) : 0}%
                    </div>
                    <div class="stat-label">Okuma Oranı</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--warning-light); color: var(--warning-color);">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-value" style="background: linear-gradient(135deg, var(--warning-color), #d97706); -webkit-background-clip: text;">${this.stats.averageRating}</div>
                    <div class="stat-label">Ortalama Puan</div>
                </div>
            </div>

            <div class="chart-container animate-slide-up" style="animation-delay: 0.2s">
                <h3 class="chart-title"><i class="fas fa-tasks"></i> Durum Dağılımı</h3>
                <div id="status-chart">
                    ${this.renderStatusChart()}
                </div>
            </div>

            <div class="chart-container animate-slide-up" style="animation-delay: 0.3s">
                <h3 class="chart-title"><i class="fas fa-tags"></i> Tür Dağılımı</h3>
                <div id="genre-chart">
                    ${this.renderGenreChart()}
                </div>
            </div>

            <div class="chart-container animate-slide-up" style="animation-delay: 0.4s">
                <h3 class="chart-title"><i class="fas fa-calendar"></i> Yıllara Göre Okuma</h3>
                <div id="year-chart">
                    ${this.renderYearChart()}
                </div>
            </div>

            <div class="chart-container animate-slide-up" style="animation-delay: 0.5s">
                <h3 class="chart-title"><i class="fas fa-clipboard-list"></i> Detaylı Rapor</h3>
                <div class="detailed-report">
                    ${this.renderDetailedReport()}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.getElementById('refresh-stats-btn')?.addEventListener('click', () => {
            const icon = document.querySelector('#refresh-stats-btn i');
            icon.classList.add('fa-spin');
            setTimeout(() => icon.classList.remove('fa-spin'), 500);
            this.refreshStats();
        });
    }

    renderStatusChart() {
        const total = this.stats.total;
        if (total === 0) return '<p class="text-center" style="color: var(--text-tertiary); padding: 2rem;">Henüz veri yok</p>';
        
        const data = [
            { label: 'Okundu', value: this.stats.read, color: 'var(--success-color)', icon: 'check-circle' },
            { label: 'Okunuyor', value: this.stats.reading, color: 'var(--warning-color)', icon: 'book-reader' },
            { label: 'Okunacak', value: this.stats.toread, color: 'var(--gray-400)', icon: 'bookmark' }
        ];
        
        return `
            <div class="chart-bars">
                ${data.map(item => {
                    const percent = total > 0 ? (item.value / total) * 100 : 0;
                    return `
                        <div class="chart-bar-group">
                            <div class="chart-bar-label">
                                <i class="fas fa-${item.icon}" style="color: ${item.color}; margin-right: 0.5rem;"></i>
                                ${item.label}
                            </div>
                            <div class="chart-bar-container">
                                <div class="chart-bar" style="width: ${percent}%; background: ${item.color};">
                                    ${percent > 15 ? `${Math.round(percent)}%` : ''}
                                </div>
                            </div>
                            <div class="chart-bar-value">${item.value} kitap</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderGenreChart() {
        const genres = Object.entries(this.stats.byGenre);
        if (genres.length === 0) return '<p class="text-center" style="color: var(--text-tertiary); padding: 2rem;">Henüz veri yok</p>';
        
        const total = this.stats.total;
        const sortedGenres = genres.sort((a, b) => b[1] - a[1]);
        
        return `
            <div class="genre-list">
                ${sortedGenres.map(([genre, count]) => {
                    const percent = (count / total) * 100;
                    return `
                        <div class="genre-item">
                            <div class="genre-name">${genre}</div>
                            <div class="genre-bar-container">
                                <div class="genre-bar" style="width: ${percent}%"></div>
                            </div>
                            <div class="genre-count">${count} (${percent.toFixed(1)}%)</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderYearChart() {
        const years = Object.entries(this.stats.byYear);
        if (years.length === 0) return '<p class="text-center" style="color: var(--text-tertiary); padding: 2rem;">Henüz veri yok</p>';
        
        const sortedYears = years.sort((a, b) => b[0] - a[0]).slice(0, 6);
        const maxCount = Math.max(...sortedYears.map(([_, count]) => count));
        
        return `
            <div class="year-bars">
                ${sortedYears.map(([year, count]) => {
                    const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return `
                        <div class="year-bar-group">
                            <div class="year-bar" style="height: ${Math.max(height, 5)}%" data-value="${count}"></div>
                            <div class="year-label">${year}</div>
                            <div class="year-count">${count} kitap</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderDetailedReport() {
        const books = storageManager.loadBooks();
        const readBooks = books.filter(b => b.status === 'read');
        const topRated = books.filter(b => b.rating >= 4).sort((a, b) => b.rating - a.rating).slice(0, 5);
        const recentAdded = [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        
        return `
            <div class="report-section">
                <h4><i class="fas fa-trophy" style="color: var(--warning-color);"></i> En Yüksek Puanlı Kitaplar</h4>
                ${topRated.length > 0 ? 
                    topRated.map(book => `
                        <div class="report-item">
                            <span class="report-book-title">${book.title}</span>
                            <span class="report-book-rating">${Helpers.renderStars(book.rating)} ${book.rating}/5</span>
                        </div>
                    `).join('') : 
                    '<p style="color: var(--text-tertiary);">Henüz puanlanmış kitap yok</p>'
                }
            </div>
            
            <div class="report-section">
                <h4><i class="fas fa-clock" style="color: var(--info-color);"></i> Son Eklenen Kitaplar</h4>
                ${recentAdded.map(book => `
                    <div class="report-item">
                        <span class="report-book-title">${book.title}</span>
                        <span class="report-book-date">${Helpers.formatDate(book.createdAt)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="report-section">
                <h4><i class="fas fa-info-circle" style="color: var(--primary-500);"></i> Genel Özet</h4>
                <div class="report-summary">
                    <p>
                        <span><i class="fas fa-hourglass-half"></i> Tahmini Okuma Süresi</span>
                        <strong>${readBooks.length * 8} saat</strong>
                    </p>
                    <p>
                        <span><i class="fas fa-fire"></i> En Çok Okunan Tür</span>
                        <strong>${this.getMostCommonGenre()}</strong>
                    </p>
                    <p>
                        <span><i class="fas fa-chart-bar"></i> Ortalama Puan</span>
                        <strong>${this.stats.averageRating}/5</strong>
                    </p>
                    <p>
                        <span><i class="fas fa-bullseye"></i> Aylık Hedef</span>
                        <strong>10 kitap</strong>
                    </p>
                </div>
            </div>
        `;
    }

    getMostCommonGenre() {
        const genres = Object.entries(this.stats.byGenre);
        if (genres.length === 0) return 'Henüz yok';
        
        const mostCommon = genres.reduce((max, current) => 
            current[1] > max[1] ? current : max
        );
        
        return `${mostCommon[0]} (${mostCommon[1]} kitap)`;
    }

    refreshStats() {
        this.stats = storageManager.getStatistics();
        
        document.getElementById('status-chart').innerHTML = this.renderStatusChart();
        document.getElementById('genre-chart').innerHTML = this.renderGenreChart();
        document.getElementById('year-chart').innerHTML = this.renderYearChart();
        
        const reportContainer = document.querySelector('.detailed-report');
        if (reportContainer) {
            reportContainer.innerHTML = this.renderDetailedReport();
        }
        
        Helpers.showToast('İstatistikler güncellendi 📊', 'success');
    }
}

export default StatisticsPage;