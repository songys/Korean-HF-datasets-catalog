// 전역 변수
let allDatasets = [];
let filteredDatasets = [];
let currentPage = 1;
const itemsPerPage = 12;

// 데이터 로드
async function loadData() {
    try {
        // 데이터셋 로드
        const datasetsResponse = await fetch('data/korean_datasets.json');
        const datasetsData = await datasetsResponse.json();
        allDatasets = datasetsData.datasets;

        // 통계 로드
        const statsResponse = await fetch('data/statistics.json');
        const statsData = await statsResponse.json();

        // 업데이트 날짜 표시
        document.getElementById('last-updated').textContent =
            new Date(datasetsData.last_updated).toLocaleString('en-US');

        // 통계 표시
        displayStatistics(statsData.statistics);

        // 필터 옵션 초기화
        initializeFilters();

        // 초기 데이터 표시
        filteredDatasets = [...allDatasets];
        displayDatasets();

        // 로딩 숨기기
        document.getElementById('loading').style.display = 'none';

    } catch (error) {
        console.error('Data loading error:', error);
        document.getElementById('loading').textContent =
            'Error loading datasets.';
    }
}

// 통계 표시
function displayStatistics(stats) {
    document.getElementById('total-datasets').textContent = stats.total_datasets.toLocaleString('en-US');
    document.getElementById('total-downloads').textContent = stats.total_downloads.toLocaleString('en-US');
    document.getElementById('total-likes').textContent = stats.total_likes.toLocaleString('en-US');
    document.getElementById('multilingual-count').textContent = stats.multilingual_count.toLocaleString('en-US');
}

// 필터 옵션 초기화
function initializeFilters() {
    const authors = new Set();
    const tasks = new Set();

    allDatasets.forEach(dataset => {
        if (dataset.author) authors.add(dataset.author);
        if (dataset.tasks) dataset.tasks.forEach(task => tasks.add(task));
    });

    // 저자 필터
    const authorFilter = document.getElementById('author-filter');
    Array.from(authors).sort().forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorFilter.appendChild(option);
    });

    // 작업 필터
    const taskFilter = document.getElementById('task-filter');
    Array.from(tasks).sort().forEach(task => {
        const option = document.createElement('option');
        option.value = task;
        option.textContent = task;
        taskFilter.appendChild(option);
    });
}

// 데이터셋 표시
function displayDatasets() {
    const container = document.getElementById('datasets-container');
    const noResults = document.getElementById('no-results');

    if (filteredDatasets.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        updatePagination();
        return;
    }

    noResults.style.display = 'none';

    // 페이지네이션 계산
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageDatasets = filteredDatasets.slice(startIndex, endIndex);

    // 데이터셋 카드 생성
    container.innerHTML = pageDatasets.map(dataset => createDatasetCard(dataset)).join('');

    // 페이지네이션 업데이트
    updatePagination();
}

// 데이터셋 카드 생성
function createDatasetCard(dataset) {
    const description = dataset.description
        ? dataset.description.substring(0, 150) + (dataset.description.length > 150 ? '...' : '')
        : 'No description available.';

    const languages = dataset.languages.slice(0, 3).map(lang =>
        `<span class="tag language">${lang}</span>`
    ).join('');

    const tasks = dataset.tasks.slice(0, 2).map(task =>
        `<span class="tag task">${task}</span>`
    ).join('');

    return `
        <div class="dataset-card" onclick="window.open('${dataset.url}', '_blank')">
            <div class="dataset-header">
                <h3 class="dataset-title">${dataset.id}</h3>
                <p class="dataset-author">by ${dataset.author || 'Unknown'}</p>
            </div>
            <p class="dataset-description">${description}</p>
            <div class="dataset-tags">
                ${languages}
                ${tasks}
            </div>
            <div class="dataset-stats">
                <span class="stat-item">📥 ${(dataset.downloads || 0).toLocaleString('en-US')}</span>
                <span class="stat-item">❤️ ${(dataset.likes || 0).toLocaleString('en-US')}</span>
            </div>
        </div>
    `;
}

// 페이지네이션 업데이트
function updatePagination() {
    const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);

    document.getElementById('page-info').textContent = `${currentPage} / ${totalPages || 1}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages || totalPages === 0;
}

// 필터 적용
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const authorFilter = document.getElementById('author-filter').value;
    const taskFilter = document.getElementById('task-filter').value;
    const sortBy = document.getElementById('sort-select').value;

    // 필터링
    filteredDatasets = allDatasets.filter(dataset => {
        const matchesSearch = !searchTerm ||
            dataset.id.toLowerCase().includes(searchTerm) ||
            (dataset.description && dataset.description.toLowerCase().includes(searchTerm));

        const matchesAuthor = !authorFilter || dataset.author === authorFilter;

        const matchesTask = !taskFilter ||
            (dataset.tasks && dataset.tasks.includes(taskFilter));

        return matchesSearch && matchesAuthor && matchesTask;
    });

    // 정렬
    switch(sortBy) {
        case 'likes':
            filteredDatasets.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
        case 'downloads':
            filteredDatasets.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
            break;
        case 'recent':
            filteredDatasets.sort((a, b) =>
                new Date(b.last_modified || 0) - new Date(a.last_modified || 0));
            break;
        case 'name':
            filteredDatasets.sort((a, b) => a.id.localeCompare(b.id));
            break;
    }

    // 첫 페이지로 리셋
    currentPage = 1;
    displayDatasets();
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // 검색
    document.getElementById('search-input').addEventListener('input', applyFilters);

    // 필터
    document.getElementById('author-filter').addEventListener('change', applyFilters);
    document.getElementById('task-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-select').addEventListener('change', applyFilters);

    // 페이지네이션
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayDatasets();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayDatasets();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});
