// 트렌드 데이터 로드 및 시각화

async function loadTrendData() {
    try {
        const response = await fetch('data/trends.json');
        const data = await response.json();
        const trends = data.trends;

        // 로딩 숨기기
        document.getElementById('loading').style.display = 'none';
        document.getElementById('trend-content').style.display = 'block';

        // 성장률 표시
        document.getElementById('growth-rate').textContent =
            trends.growth_rate > 0 ? `+${trends.growth_rate}%` : `${trends.growth_rate}%`;
        document.getElementById('total-weeks').textContent = trends.total_weeks;

        // 날짜 범위 표시
        if (trends.first_date && trends.last_date) {
            const firstDate = formatDate(trends.first_date);
            const lastDate = formatDate(trends.last_date);
            document.getElementById('date-range').textContent = `${firstDate} ~ ${lastDate}`;
        }

        // 차트 생성
        createDatasetsChart(trends);
        createDownloadsChart(trends);
        createLikesChart(trends);
        createMultilingualChart(trends);

    } catch (error) {
        console.error('Trend data loading error:', error);
        document.getElementById('loading').textContent =
            'Trend data not yet available. Data will be collected starting next week.';
    }
}

function formatDate(dateStr) {
    // YYYYMMDD -> YYYY-MM-DD
    return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
}

function createDatasetsChart(trends) {
    const ctx = document.getElementById('datasetsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trends.dates.map(formatDate),
            datasets: [{
                label: 'Total Datasets',
                data: trends.total_datasets,
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function createDownloadsChart(trends) {
    const ctx = document.getElementById('downloadsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trends.dates.map(formatDate),
            datasets: [{
                label: 'Total Downloads',
                data: trends.total_downloads,
                borderColor: '#004e89',
                backgroundColor: 'rgba(0, 78, 137, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function createLikesChart(trends) {
    const ctx = document.getElementById('likesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trends.dates.map(formatDate),
            datasets: [{
                label: 'Total Likes',
                data: trends.total_likes,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function createMultilingualChart(trends) {
    const ctx = document.getElementById('multilingualChart').getContext('2d');

    // 다국어 비율 계산
    const multilingualRatio = trends.total_datasets.map((total, index) => {
        const multilingual = trends.multilingual_count[index];
        return total > 0 ? (multilingual / total * 100).toFixed(1) : 0;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: trends.dates.map(formatDate),
            datasets: [{
                label: 'Multilingual Dataset Ratio (%)',
                data: multilingualRatio,
                backgroundColor: 'rgba(155, 89, 182, 0.7)',
                borderColor: '#9b59b6',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', loadTrendData);
