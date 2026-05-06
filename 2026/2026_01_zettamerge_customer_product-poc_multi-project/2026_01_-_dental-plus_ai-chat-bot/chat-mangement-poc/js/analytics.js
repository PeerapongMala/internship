/**
 * Analytics Section JavaScript
 * Chart.js integration with cleanup
 */

const AnalyticsState = {
    charts: [],
    initialized: false,
    currentPeriod: 'this-week'
};

// Mock Data for different periods
const AnalyticsData = {
    'this-week': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
        responseTime: [2.5, 2.3, 2.8, 2.1, 2.4, 2.6, 2.2],
        casesHandled: [45, 52, 48, 61, 55, 40, 35],
        stats: { speed: '2.5 นาที', quality: '4.8/5.0', volume: '336 เคส' }
    },
    'last-week': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
        responseTime: [2.8, 2.6, 3.0, 2.4, 2.7, 2.9, 2.5],
        casesHandled: [42, 48, 45, 55, 50, 38, 32],
        stats: { speed: '2.7 นาที', quality: '4.6/5.0', volume: '310 เคส' }
    },
    'this-month': {
        labels: ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2', 'สัปดาห์ที่ 3', 'สัปดาห์ที่ 4'],
        responseTime: [2.6, 2.4, 2.5, 2.3],
        casesHandled: [310, 325, 336, 348],
        stats: { speed: '2.5 นาที', quality: '4.7/5.0', volume: '1,319 เคส' }
    },
    'last-month': {
        labels: ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2', 'สัปดาห์ที่ 3', 'สัปดาห์ที่ 4'],
        responseTime: [2.9, 2.7, 2.6, 2.5],
        casesHandled: [280, 295, 310, 320],
        stats: { speed: '2.7 นาที', quality: '4.5/5.0', volume: '1,205 เคส' }
    }
};

function initAnalytics() {
    if (AnalyticsState.initialized) {
        // Charts already exist, no need to reinit
        return;
    }

    // Initialize charts here
    const chartsContainer = document.getElementById('analytics-charts');
    if (chartsContainer) {
        chartsContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-xl p-4">
                    <canvas id="speedChart"></canvas>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                    <canvas id="volumeChart"></canvas>
                </div>
            </div>
        `;

        createAnalyticsCharts();
    }

    AnalyticsState.initialized = true;
    console.log('Analytics initialized');
}

function createAnalyticsCharts() {
    // Create speed chart
    const speedCtx = document.getElementById('speedChart');
    if (speedCtx) {
        const speedChart = new Chart(speedCtx, {
            type: 'line',
            data: {
                labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
                datasets: [{
                    label: 'Response Time (นาที)',
                    data: [2.5, 2.3, 2.8, 2.1, 2.4, 2.6, 2.2],
                    borderColor: '#14b8a6',
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'เวลาตอบกลับเฉลี่ย'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'นาที'
                        }
                    }
                }
            }
        });
        AnalyticsState.charts.push(speedChart);
    }

    // Create volume chart
    const volumeCtx = document.getElementById('volumeChart');
    if (volumeCtx) {
        const volumeChart = new Chart(volumeCtx, {
            type: 'bar',
            data: {
                labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
                datasets: [{
                    label: 'เคสที่จัดการ',
                    data: [45, 52, 48, 61, 55, 40, 35],
                    backgroundColor: '#14b8a6',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'จำนวนเคสที่จัดการ'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'เคส'
                        }
                    }
                }
            }
        });
        AnalyticsState.charts.push(volumeChart);
    }
}

function destroyAnalyticsCharts() {
    AnalyticsState.charts.forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    AnalyticsState.charts = [];
    AnalyticsState.initialized = false;
    console.log('Analytics charts destroyed');
}

// ============================================
// Period Switching
// ============================================
function changePeriod(period) {
    AnalyticsState.currentPeriod = period;
    const data = AnalyticsData[period];

    if (!data) return;

    // Update stat cards
    const speedStat = document.querySelector('#analytics-speed-stat');
    const qualityStat = document.querySelector('#analytics-quality-stat');
    const volumeStat = document.querySelector('#analytics-volume-stat');

    if (speedStat) speedStat.textContent = data.stats.speed;
    if (qualityStat) qualityStat.textContent = data.stats.quality;
    if (volumeStat) volumeStat.textContent = data.stats.volume;

    // Update charts
    if (AnalyticsState.charts.length >= 2) {
        // Update speed chart
        const speedChart = AnalyticsState.charts[0];
        speedChart.data.labels = data.labels;
        speedChart.data.datasets[0].data = data.responseTime;
        speedChart.update();

        // Update volume chart
        const volumeChart = AnalyticsState.charts[1];
        volumeChart.data.labels = data.labels;
        volumeChart.data.datasets[0].data = data.casesHandled;
        volumeChart.update();
    }

    console.log('Analytics period changed to:', period);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAnalytics);
