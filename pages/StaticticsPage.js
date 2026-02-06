import Helpers from '../utils/helpers.js';
import storageManager from '../utils/storage.js';
import Book from '../interfaces/Book.js';

class StatisticsPage {
    constructor() {
        this.stats = {};
    }

    render() {
        Helpers.setPageTitle('İstatistikler');
        Helpers.setActiveNav('statistics');
        
        this.stats = storageManager.getStatistics();
        
        return `
            <div class="page-header">
                <h1>İstatistikler ve Analizler</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="refresh-stats-btn">
                        <i class="fas fa-sync-alt"></i> Yenile
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-value">${this.stats.total}</div>
                    <div class="stat-label">Toplam Kitap</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-value">${this.stats.read}</div>
                    <div class="stat-label">Okunan</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="stat-value">
                        ${this.stats.total > 0 ? Math.round((this.stats.read / this.stats.total) * 100) : 0}%
                    </div>
                    <div class="stat-label">Okuma Oranı</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-value">${this.stats.averageRating}</div>
                    <div class="stat-label">Ortalama Puan</div>
                </div>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Durum Dağılımı</h3>
                <div class="chart" id="status-chart">
                    ${this.renderStatusChart()}
                </div>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Tür Dağılımı</h3>
                <div class="chart" id="genre-chart">
                    ${this.renderGenreChart()}
                </div>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Yıllara Göre Okuma</h3>
                <div class="chart" id="year-chart">
                    ${this.renderYearChart()}
                </div>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Detaylı Rapor</h3>
                <div class="detailed-report">
                    ${this.renderDetailedReport()}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-stats-btn')?.addEventListener('click', () => {
            this.refreshStats();
        });
    }

    renderStatusChart() {
        const total = this.stats.total;
        if (total === 0) return '<p class="text-center">Henüz veri yok</p>';
        
        const readPercent = (this.stats.read / total) * 100;
        const readingPercent = (this.stats.reading / total) * 100;
        const toreadPercent = (this.stats.toread / total) * 100;
        
        return `
            <div class="chart-bars">
                <div class="chart-bar-group">
                    <div class="chart-bar-label">Okundu</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar" style="width: ${readPercent}%; background-color: #4cc9f0;"></div>
                    </div>
                    <div class="chart-bar-value">${this.stats.read} (${readPercent.toFixed(1)}%)</div>
                </div>
                
                <div class="chart-bar-group">
                    <div class="chart-bar-label">Okunuyor</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar" style="width: ${readingPercent}%; background-color: #f8961e;"></div>
                    </div>
                    <div class="chart-bar-value">${this.stats.reading} (${readingPercent.toFixed(1)}%)</div>
                </div>
                
                <div class="chart-bar-group">
                    <div class="chart-bar-label">Okunacak</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar" style="width: ${toreadPercent}%; background-color: #adb5bd;"></div>
                    </div>
                    <div class="chart-bar-value">${this.stats.toread} (${toreadPercent.toFixed(1)}%)</div>
                </div>
            </div>
        `;
    }

    renderGenreChart() {
        const genres = Object.entries(this.stats.byGenre);
        if (genres.length === 0) return '<p class="text-center">Henüz veri yok</p>';
        
        const total = this.stats.total;
        let html = '<div class="genre-list">';
        
        genres.sort((a, b) => b[1] - a[1]).forEach(([genre, count]) => {
            const percent = (count / total) * 100;
            html += `
                <div class="genre-item">
                    <div class="genre-name">${genre}</div>
                    <div class="genre-bar-container">
                        <div class="genre-bar" style="width: ${percent}%"></div>
                    </div>
                    <div class="genre-count">${count} (${percent.toFixed(1)}%)</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    renderYearChart() {
        const years = Object.entries(this.stats.byYear);
        if (years.length === 0) return '<p class="text-center">Henüz veri yok</p>';
        
        // Son 5 yılı göster
        const recentYears = years.sort((a, b) => b[0] - a[0]).slice(0, 5);
        const maxCount = Math.max(...recentYears.map(([_, count]) => count));
        
        let html = '<div class="year-bars">';
        
        recentYears.forEach(([year, count]) => {
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            html += `
                <div class="year-bar-group">
                    <div class="year-bar" style="height: ${height}%"></div>
                    <div class="year-label">${year}</div>
                    <div class="year-count">${count}</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    renderDetailedReport() {
        const books = storageManager.loadBooks();
        const readBooks = books.filter(b => b.status === 'read');
        const topRated = books.filter(b => b.rating >= 4).sort((a, b) => b.rating - a.rating).slice(0, 3);
        const recentAdded = books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        
        return `
            <div class="report-section">
                <h4>En Yüksek Puanlı Kitaplar</h4>
                ${topRated.length > 0 ? 
                    topRated.map(book => `
                        <div class="report-item">
                            <span class="report-book-title">${book.title}</span>
                            <span class="report-book-rating">${Helpers.renderStars(book.rating)}</span>
                        </div>
                    `).join('') : 
                    '<p>Henüz puanlanmış kitap yok</p>'
                }
            </div>
            
            <div class="report-section">
                <h4>Son Eklenen Kitaplar</h4>
                ${recentAdded.map(book => `
                    <div class="report-item">
                        <span class="report-book-title">${book.title}</span>
                        <span class="report-book-date">${Helpers.formatDate(book.createdAt)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="report-section">
                <h4>Genel Özet</h4>
                <div class="report-summary">
                    <p><strong>Toplam Okuma Süresi:</strong> Tahmini ${readBooks.length * 10} saat</p>
                    <p><strong>En Çok Okunan Tür:</strong> ${this.getMostCommonGenre()}</p>
                    <p><strong>Ortalama Kitap Uzunluğu:</strong> ${this.stats.averageRating}/5 puan</p>
                    <p><strong>Aylık Okuma Hedefi:</strong> 10 kitap</p>
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
        
        // Update charts
        document.getElementById('status-chart').innerHTML = this.renderStatusChart();
        document.getElementById('genre-chart').innerHTML = this.renderGenreChart();
        document.getElementById('year-chart').innerHTML = this.renderYearChart();
        
        // Update detailed report
        const reportContainer = document.querySelector('.detailed-report');
        if (reportContainer) {
            reportContainer.innerHTML = this.renderDetailedReport();
        }
        
        Helpers.showToast('İstatistikler yenilendi', 'success');
    }
}

// Add CSS for charts
const chartStyles = `
    <style>
        .chart-bars {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .chart-bar-group {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .chart-bar-label {
            width: 80px;
            font-weight: 600;
        }
        
        .chart-bar-container {
            flex: 1;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .chart-bar {
            height: 100%;
            border-radius: 10px;
        }
        
        .chart-bar-value {
            width: 100px;
            text-align: right;
            font-size: 0.9rem;
            color: #666;
        }
        
        .genre-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .genre-item {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .genre-name {
            width: 120px;
            font-weight: 600;
        }
        
        .genre-bar-container {
            flex: 1;
            height: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .genre-bar {
            height: 100%;
            background: linear-gradient(90deg, #4361ee, #7209b7);
            border-radius: 5px;
        }
        
        .genre-count {
            width: 100px;
            text-align: right;
            font-size: 0.9rem;
            color: #666;
        }
        
        .year-bars {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: 200px;
            padding: 1rem;
            border-bottom: 1px solid #ddd;
        }
        
        .year-bar-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            width: 40px;
        }
        
        .year-bar {
            width: 30px;
            background: linear-gradient(to top, #4361ee, #4cc9f0);
            border-radius: 4px 4px 0 0;
            transition: height 0.5s ease;
        }
        
        .year-label {
            font-size: 0.9rem;
            color: #666;
        }
        
        .year-count {
            font-weight: 600;
            color: #333;
        }
        
        .detailed-report {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .report-section {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
        }
        
        .report-section h4 {
            margin-bottom: 1rem;
            color: #3a0ca3;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 0.5rem;
        }
        
        .report-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .report-item:last-child {
            border-bottom: none;
        }
        
        .report-book-title {
            font-weight: 500;
        }
        
        .report-book-rating {
            color: #f8961e;
        }
        
        .report-book-date {
            color: #666;
            font-size: 0.9rem;
        }
        
        .report-summary p {
            margin-bottom: 0.5rem;
            padding: 0.5rem 0;
            border-bottom: 1px dashed #dee2e6;
        }
        
        .report-summary p:last-child {
            border-bottom: none;
        }
    </style>
`;

// Add styles to document
if (!document.querySelector('#chart-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'chart-styles';
    styleElement.innerHTML = chartStyles;
    document.head.appendChild(styleElement.firstChild);
}

export default StatisticsPage;