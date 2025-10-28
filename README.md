# 🤗 Korean Hugging Face Dataset Catalog

A project that automatically collects and publishes Korean language Hugging Face datasets as a web page.

## 📋 Project Structure

```
Korean-HF-datasets-catalog/
├── docs/                    # GitHub Pages static site
│   ├── index.html          # Main page
│   ├── css/
│   │   └── style.css       # Stylesheet
│   ├── js/
│   │   └── app.js          # Frontend logic
│   └── data/               # Dataset JSON files (auto-generated)
│       ├── Korean_datasets.json
│       ├── Korean_datasets.csv
│       └── statistics.json
├── scripts/                 # Data collection scripts
│   └── collect_Korean_datasets.py
├── .github/
│   └── workflows/
│       ├── update-datasets.yml    # Periodic data updates
│       └── deploy-pages.yml       # GitHub Pages deployment
└── README.md
```

## 🚀 Getting Started

### 1. Local Data Collection

Install required packages:

```bash
pip install huggingface-hub pandas tqdm
```

Run the data collection script:

```bash
python scripts/collect_Korean_datasets.py
```

### 2. GitHub Pages Setup

#### 2.1. Create GitHub Repository
1. Create a new repository on GitHub
2. Push the local project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Korean HF datasets catalog"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

#### 2.2. Enable GitHub Pages
1. Go to **Settings** → **Pages** in your GitHub repository
2. Set **Source** to `GitHub Actions`
3. Save and deployment will start automatically

#### 2.3. Configure GitHub Actions Permissions
1. Go to **Settings** → **Actions** → **General**
2. Select `Read and write permissions` under **Workflow permissions**
3. Click **Save**

### 3. Automatic Updates and Notifications

- **Automatic Updates**: Runs automatically every Monday at 9 AM (KST)
- **Manual Updates**: You can manually run the `Update Korean Datasets` workflow from the GitHub Actions tab
- **Notifications**: Enable GitHub notifications at https://github.com/settings/notifications to receive email alerts for workflow runs
- **Detailed Summary**: View detailed statistics and trends in the GitHub Actions Summary tab after each run

## 📊 Features

### Website Features
- ✅ Display Korean dataset list
- ✅ Search functionality (name, description)
- ✅ Filtering (author, task type)
- ✅ Sorting (popularity, downloads, recent, name)
- ✅ Statistics dashboard
- ✅ Pagination
- ✅ Responsive design

### Automation Features
- ✅ Periodic data collection (weekly)
- ✅ Automatic GitHub Pages deployment
- ✅ Data version control

## 🛠️ Customization

### Change Update Schedule

Modify the cron setting in `.github/workflows/update-datasets.yml`:

```yaml
schedule:
  - cron: '0 0 * * 1'  # Every Monday
  # - cron: '0 0 * * *'  # Daily
  # - cron: '0 0 1 * *'  # First day of month
```

### Change Design

Modify CSS variables in `docs/css/style.css`:

```css
:root {
    --primary-color: #ff6b35;      /* Primary color */
    --secondary-color: #004e89;    /* Secondary color */
    --bg-color: #f8f9fa;          /* Background color */
}
```

### Change Items Per Page

Modify the `itemsPerPage` variable in `docs/js/app.js`:

```javascript
const itemsPerPage = 12;  // Change to desired number
```

## 📝 Data Schema

### Korean_datasets.json
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
      "languages": ["zh", "en"],
      "tasks": ["text-classification"],
      "size_categories": ["1K<n<10K"]
    }
  ]
}
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project follows the MIT License.

## 📚 Citation

If you use this project, please cite the following paper:

```bibtex
@misc{choi2025languagedataleftbehind,
      title={No Language Data Left Behind: A Comparative Study of CJK Language Datasets in the Hugging Face Ecosystem},
      author={Dasol Choi and Woomyoung Park and Youngsook Song},
      year={2025},
      eprint={2507.04329},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2507.04329},
}
```

**Paper Link**: [arXiv:2507.04329](https://arxiv.org/abs/2507.04329)

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) - Dataset provider
- [GitHub Pages](https://pages.github.com/) - Free hosting

## 📞 Contact

If you have any questions about the project, please open an issue.

---

⭐ If you find this project useful, please give it a star!

You can view the result at:
https://songys.github.io/Korean-HF-datasets-catalog/
