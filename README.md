# 🤗 한국어 Hugging Face 데이터셋 카탈로그

한국어를 지원하는 Hugging Face 데이터셋을 자동으로 수집하고 웹 페이지로 공개하는 프로젝트입니다.

## 📋 프로젝트 구조

```
huggingface_dataset_paper/
├── docs/                    # GitHub Pages 정적 사이트
│   ├── index.html          # 메인 페이지
│   ├── css/
│   │   └── style.css       # 스타일시트
│   ├── js/
│   │   └── app.js          # 프론트엔드 로직
│   └── data/               # 데이터셋 JSON 파일 (자동 생성)
│       ├── korean_datasets.json
│       ├── korean_datasets.csv
│       └── statistics.json
├── scripts/                 # 데이터 수집 스크립트
│   └── collect_korean_datasets.py
├── .github/
│   └── workflows/
│       ├── update-datasets.yml    # 주기적 데이터 업데이트
│       └── deploy-pages.yml       # GitHub Pages 배포
└── README.md
```

## 🚀 시작하기

### 1. 로컬에서 데이터 수집

필요한 패키지를 설치합니다:

```bash
pip install huggingface-hub pandas tqdm
```

데이터 수집 스크립트를 실행합니다:

```bash
python scripts/collect_korean_datasets.py
```

### 2. GitHub Pages 설정

#### 2.1. GitHub 저장소 생성
1. GitHub에서 새 저장소를 생성합니다
2. 로컬 프로젝트를 GitHub에 푸시합니다:

```bash
git init
git add .
git commit -m "Initial commit: Korean HF datasets catalog"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

#### 2.2. GitHub Pages 활성화
1. GitHub 저장소의 **Settings** → **Pages**로 이동
2. **Source**를 `GitHub Actions`로 설정
3. 저장하면 자동으로 배포가 시작됩니다

#### 2.3. GitHub Actions 권한 설정
1. **Settings** → **Actions** → **General**로 이동
2. **Workflow permissions**에서 `Read and write permissions` 선택
3. **Save** 클릭

### 3. 자동 업데이트 확인

- **자동 업데이트**: 매주 월요일 오전 9시(KST)에 자동으로 실행됩니다
- **수동 업데이트**: GitHub Actions 탭에서 `Update Korean Datasets` 워크플로우를 수동으로 실행할 수 있습니다

## 📊 기능

### 웹사이트 기능
- ✅ 한국어 데이터셋 목록 표시
- ✅ 검색 기능 (이름, 설명)
- ✅ 필터링 (저자, 작업 유형)
- ✅ 정렬 (인기도, 다운로드, 최신순, 이름순)
- ✅ 통계 대시보드
- ✅ 페이지네이션
- ✅ 반응형 디자인

### 자동화 기능
- ✅ 주기적 데이터 수집 (매주)
- ✅ 자동 GitHub Pages 배포
- ✅ 데이터 버전 관리

## 🛠️ 커스터마이징

### 업데이트 주기 변경

`.github/workflows/update-datasets.yml` 파일의 cron 설정을 수정합니다:

```yaml
schedule:
  - cron: '0 0 * * 1'  # 매주 월요일
  # - cron: '0 0 * * *'  # 매일
  # - cron: '0 0 1 * *'  # 매월 1일
```

### 디자인 변경

`docs/css/style.css` 파일의 CSS 변수를 수정합니다:

```css
:root {
    --primary-color: #ff6b35;      /* 메인 색상 */
    --secondary-color: #004e89;    /* 보조 색상 */
    --bg-color: #f8f9fa;          /* 배경 색상 */
}
```

### 페이지당 아이템 수 변경

`docs/js/app.js` 파일의 `itemsPerPage` 변수를 수정합니다:

```javascript
const itemsPerPage = 12;  // 원하는 숫자로 변경
```

## 📝 데이터 스키마

### korean_datasets.json
```json
{
  "last_updated": "2024-01-15T10:00:00",
  "total_count": 150,
  "datasets": [
    {
      "id": "dataset-name",
      "author": "author-name",
      "created_at": "2023-01-01T00:00:00",
      "last_modified": "2024-01-01T00:00:00",
      "downloads": 1000,
      "likes": 50,
      "tags": ["tag1", "tag2"],
      "description": "Dataset description",
      "url": "https://huggingface.co/datasets/...",
      "languages": ["ko", "en"],
      "tasks": ["text-classification"],
      "size_categories": ["1K<n<10K"]
    }
  ]
}
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🙏 감사의 말

- [Hugging Face](https://huggingface.co/) - 데이터셋 제공
- [GitHub Pages](https://pages.github.com/) - 무료 호스팅

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 Issues를 열어주세요.

---

⭐ 이 프로젝트가 유용하다면 별표를 눌러주세요!
