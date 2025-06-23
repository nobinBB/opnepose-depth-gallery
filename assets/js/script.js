// タブ切り替え機能
const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // アクティブクラスの切り替え
        tabLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        link.classList.add('active');
        const tabId = link.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// モーダル機能
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function () {
        modal.style.display = 'block';
        const imageSrc = this.getAttribute('data-image');
        modalImg.src = imageSrc;
    });
});

closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 画像フォルダの設定
const imageConfig = {
    suspended: {
        folder: './assets/img/Suspended/',
        zipFolder: './assets/zip/Suspended/',
        baseName: 'suspended',
        count: 13,
        hasBaseImage: false
    },
    lying: {
        folder: './assets/img/lying/',
        zipFolder: './assets/zip/lying/',
        baseName: 'lying',
        count: 38, 
        hasBaseImage: false
    },
    standing: {
        folder: './assets/img/standing/',
        zipFolder: './assets/zip/standing/',
        baseName: 'standing',
        count: 66,
        hasBaseImage: false
    },

    all_fours: {
        folder: './assets/img/all_fours/',
        zipFolder: './assets/zip/all_fours/',
        baseName: 'all_fours',
        count: 13,
        hasBaseImage: false
    },
    Kneeling: {
        folder: './assets/img/Kneeling/',
        zipFolder: './assets/zip/Kneeling/',
        baseName: 'Kneeling',
        count: 32,
        hasBaseImage: false
    },
    split_leg: {
        folder: './assets/img/split_leg/',
        zipFolder: './assets/zip/split_leg/',
        baseName: 'split_leg',
        count: 14,
        hasBaseImage: false
    },
    Squatting: {
        folder: './assets/img/Squatting/',
        zipFolder: './assets/zip/Squatting/',
        baseName: 'Squatting',
        count: 20,
        hasBaseImage: false
    },
   sitting: {
        folder: './assets/img/sitting/',
        zipFolder: './assets/zip/sitting/',
        baseName: 'sitting',
        count: 33,
        hasBaseImage: false
    },
};

// ギャラリーアイテムを生成する関数
function generateGalleryItems(config, containerId) {
    const container = document.getElementById(containerId);
    const galleryGrid = container.querySelector('.gallery-grid');

    // 既存のアイテムをクリア
    galleryGrid.innerHTML = '';

    const items = [];

    // ベース画像がある場合（例：Suspended.png）
    if (config.hasBaseImage) {
        const baseImagePath = `${config.folder}${config.baseName}.png`;
        const baseZipPath = `${config.zipFolder}${config.baseName}.zip`;

        items.push({
            imagePath: baseImagePath,
            zipPath: baseZipPath,
            altText: `${config.baseName} pose`
        });
    }

    // 番号付き画像を生成（例：Suspended001.png〜Suspended012.png）
    const startNum = 1; // 常に001から開始
    const endNum = config.hasBaseImage ? config.count - 1 : config.count;

    for (let i = startNum; i <= endNum; i++) {
        const paddedNum = i.toString().padStart(3, '0');
        const imagePath = `${config.folder}${config.baseName}${paddedNum}.png`;
        const zipPath = `${config.zipFolder}${config.baseName}${paddedNum}.zip`;

        items.push({
            imagePath: imagePath,
            zipPath: zipPath,
            altText: `${config.baseName} pose`
        });
    }

    // HTMLを生成
    items.forEach(item => {
        try {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-item-wrapper';

            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-image', item.imagePath);

            const img = document.createElement('img');
            img.alt = item.altText;

            // エラーハンドラーを先に設定
            img.onerror = function () {
                try {
                    wrapper.style.display = 'none';
                } catch (e) {
                    // 何もしない
                }
            };

            // srcは最後に設定
            img.src = item.imagePath;

            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'download-btn';
            downloadBtn.href = item.zipPath;
            downloadBtn.textContent = 'DL';

            galleryItem.appendChild(img);
            wrapper.appendChild(galleryItem);
            wrapper.appendChild(downloadBtn);
            galleryGrid.appendChild(wrapper);
        } catch (e) {
            // エラーが発生してもスキップして続行
        }
    });
}

// フォルダ内のファイル数を自動検出する関数（オプション）
async function detectImageCount(config) {
    const detectedCount = { count: 0, hasBaseImage: false };

    // ベース画像をチェック
    try {
        const baseResponse = await fetch(`${config.folder}${config.baseName}.png`, { method: 'HEAD' });
        if (baseResponse.ok) {
            detectedCount.hasBaseImage = true;
            detectedCount.count++;
        }
    } catch (e) {
        // ファイルが存在しない
    }

    // 番号付きファイルをチェック
    let i = 1;
    while (i <= 50) { // 最大50まで検索
        try {
            const paddedNum = i.toString().padStart(3, '0');
            const response = await fetch(`${config.folder}${config.baseName}${paddedNum}.png`, { method: 'HEAD' });
            if (response.ok) {
                detectedCount.count++;
                i++;
            } else {
                break;
            }
        } catch (e) {
            break;
        }
    }

    return detectedCount;
}

// 自動検出を使用する場合の初期化関数
async function initializeGalleryWithDetection() {
    // Suspended フォルダの自動検出
    const suspendedDetected = await detectImageCount(imageConfig.suspended);
    imageConfig.suspended.count = suspendedDetected.count;
    imageConfig.suspended.hasBaseImage = suspendedDetected.hasBaseImage;

    // Lying フォルダの自動検出
    const lyingDetected = await detectImageCount(imageConfig.lying);
    imageConfig.lying.count = lyingDetected.count;
    imageConfig.lying.hasBaseImage = lyingDetected.hasBaseImage;


    const standingDetected = await detectImageCount(imageConfig.standing);
    imageConfig.standing.count = standingDetected.count;
    imageConfig.standing.hasBaseImage = standingDetected.hasBaseImage;

    const all_foursDetected = await detectImageCount(imageConfig.all_fours);
    imageConfig.all_fours.count = all_foursDetected.count;
    imageConfig.all_fours.hasBaseImage = all_foursDetected.hasBaseImage;
    
    const KneelingDetected = await detectImageCount(imageConfig.Kneeling);
    imageConfig.Kneeling.count = KneelingDetected.count;
    imageConfig.Kneeling.hasBaseImage = KneelingDetected.hasBaseImage;

    const split_legDetected = await detectImageCount(imageConfig.split_leg);
    imageConfig.split_leg.count = split_legDetected.count;
    imageConfig.split_leg.hasBaseImage = split_legDetected.hasBaseImage;
    
    const SquattingDetected = await detectImageCount(imageConfig.Squatting);
    imageConfig.Squatting.count = SquattingDetected.count;
    imageConfig.Squatting.hasBaseImage = SquattingDetected.hasBaseImage;
    
    constsittingDetected = await detectImageCount(imageConfig.Squatting);
    imageConfig.Squatting.count =sittingDetected.count;
    imageConfig.Squatting.hasBaseImage =sittingDetected.hasBaseImage;

    // ギャラリーを生成
    generateGalleryItems(imageConfig.suspended, 'tab1');
    generateGalleryItems(imageConfig.lying, 'tab2');
    generateGalleryItems(imageConfig.standing, 'tab3');
    generateGalleryItems(imageConfig.all_fours, 'tab4');
    generateGalleryItems(imageConfig.Kneeling, 'tab5');
    generateGalleryItems(imageConfig.split_leg, 'tab6');
    generateGalleryItems(imageConfig.Squatting, 'tab7');
    generateGalleryItems(imageConfig.sitting, 'tab8');

    // モーダル機能を再初期化
    initializeModal();
}

// 手動設定での初期化関数
function initializeGallery() {
    generateGalleryItems(imageConfig.suspended, 'tab1');
    generateGalleryItems(imageConfig.lying, 'tab2');
    generateGalleryItems(imageConfig.standing, 'tab3');
    generateGalleryItems(imageConfig.all_fours, 'tab4');
    generateGalleryItems(imageConfig.Kneeling, 'tab5');
    generateGalleryItems(imageConfig.split_leg, 'tab6');
    generateGalleryItems(imageConfig.Squatting, 'tab7');
    generateGalleryItems(imageConfig.sitting, 'tab8');
    initializeModal();
}

// モーダル機能の初期化
function initializeModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close');

    // 既存のイベントリスナーを削除して重複を防ぐ
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            modal.style.display = 'block';
            const imageSrc = this.getAttribute('data-image');
            modalImg.src = imageSrc;
        });
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// タブ切り替え機能
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // アクティブクラスの切り替え
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            link.classList.add('active');
            const tabId = link.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function () {
    // グローバルエラーハンドラー
    window.addEventListener('error', function (e) {
        e.preventDefault();
        return true;
    });

    initializeTabs();
    initializeGallery();
});

// 設定を変更する場合の関数
function updateConfig(tabName, newConfig) {
    imageConfig[tabName] = { ...imageConfig[tabName], ...newConfig };

    let containerId;
    switch (tabName) {
        case 'suspended': containerId = 'tab1'; break;
        case 'lying': containerId = 'tab2'; break;
        case 'standing': containerId = 'tab3'; break;
        case 'all_fours': containerId = 'tab4'; break;
        default: containerId = 'tab1';
    }

    generateGalleryItems(imageConfig[tabName], containerId);
    initializeModal();
}