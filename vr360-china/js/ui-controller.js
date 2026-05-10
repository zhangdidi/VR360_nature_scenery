import { spots, getSpotById } from './spots-data.js';
import { t, getSpotI18n } from './i18n.js';

export class UIController {
  constructor(viewer) {
    this.viewer = viewer;
    this.currentSpotId = spots[0].id;
    this.isGalleryOpen = true;
    this.isLoading = false;

    // DOM 元素引用
    this.elements = {
      loading: document.getElementById('loading-overlay'),
      progressBar: document.getElementById('progress-bar'),
      loadingText: document.querySelector('.loading-text'),
      gallery: document.getElementById('gallery-panel'),
      thumbnails: document.getElementById('thumbnails-container'),
      infoPanel: document.getElementById('info-panel'),
      infoBadge: document.querySelector('.info-badge'),
      spotName: document.getElementById('spot-name'),
      spotLocation: document.getElementById('spot-location'),
      spotDesc: document.getElementById('spot-description'),
      btnFullscreen: document.getElementById('btn-fullscreen'),
      btnAutoRotate: document.getElementById('btn-auto-rotate'),
      btnGyroscope: document.getElementById('btn-gyroscope'),
      btnBack: document.getElementById('btn-back'),
      toggleBar: document.getElementById('toggle-bar'),
      hintText: document.querySelector('.hint-text')
    };

    this.init();
    window.addEventListener('langchange', () => this.onLangChange());
  }

  init() {
    this.buildThumbnails();
    this.bindControls();
    this.updateUIText();
    this.updateInfoPanel();
    this.detectMobile();
  }

  // ==================== 语言切换 ====================

  onLangChange() {
    this.updateUIText();
    this.buildThumbnails();
    this.updateInfoPanel();
  }

  updateUIText() {
    // 加载文本
    if (this.elements.loadingText) {
      this.elements.loadingText.textContent = t('vrLoading');
    }
    // 徽章
    if (this.elements.infoBadge) {
      this.elements.infoBadge.textContent = t('vrBadge');
    }
    // 提示文字
    if (this.elements.hintText) {
      this.elements.hintText.textContent = t('vrHint');
    }
    // 返回按钮标题
    if (this.elements.btnBack) {
      this.elements.btnBack.title = t('btnBack');
    }
    // 控制按钮标题
    this.updateControlTitles();
  }

  updateControlTitles() {
    if (this.elements.btnAutoRotate) {
      const isActive = this.elements.btnAutoRotate.classList.contains('active');
      this.elements.btnAutoRotate.title = isActive ? t('btnAutoRotateOn') : t('btnAutoRotateOff');
    }
    if (this.elements.btnFullscreen) {
      this.elements.btnFullscreen.title = t('btnFullscreen');
    }
    if (this.elements.btnGyroscope) {
      const isActive = this.elements.btnGyroscope.classList.contains('active');
      this.elements.btnGyroscope.title = isActive ? t('btnGyroscopeOn') : t('btnGyroscopeOff');
    }
  }

  // ==================== 缩略图列表 ====================

  buildThumbnails() {
    this.elements.thumbnails.innerHTML = '';
    spots.forEach((spot) => {
      const s = getSpotI18n(spot.id);
      const card = document.createElement('div');
      card.className = 'thumbnail-card';
      card.dataset.spotId = spot.id;
      card.innerHTML = `
        <div class="thumbnail-preview" style="background: linear-gradient(135deg, ${spot.theme.skyTop}, ${spot.theme.ground})">
          <span class="thumbnail-icon">📍</span>
        </div>
        <div class="thumbnail-info">
          <div class="thumbnail-name">${s.name}</div>
          <div class="thumbnail-location">${s.location}</div>
        </div>
      `;
      card.addEventListener('click', () => this.switchSpot(spot.id));
      this.elements.thumbnails.appendChild(card);
    });

    this.highlightCurrentSpot();
  }

  highlightCurrentSpot() {
    document.querySelectorAll('.thumbnail-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.spotId === this.currentSpotId);
    });
  }

  // ==================== 外部调用 ====================

  setCurrentSpot(spotId) {
    this.currentSpotId = spotId;
    this.highlightCurrentSpot();
    this.updateInfoPanel();
  }

  // ==================== 景点切换 ====================

  async switchSpot(spotId) {
    if (this.isLoading || spotId === this.currentSpotId) return;
    this.isLoading = true;
    this.currentSpotId = spotId;

    const spot = getSpotById(spotId);
    this.highlightCurrentSpot();
    this.updateInfoPanel();

    if (window.innerWidth <= 768) {
      this.closeGallery();
    }

    await this.viewer.loadPanorama(spot.panorama, spot.theme);
    this.isLoading = false;
  }

  updateInfoPanel() {
    const spot = getSpotI18n(this.currentSpotId);
    if (!spot) return;
    this.elements.spotName.textContent = spot.name;
    this.elements.spotLocation.textContent = spot.location;
    this.elements.spotDesc.textContent = spot.description;

    this.elements.infoPanel.classList.remove('info-enter');
    void this.elements.infoPanel.offsetWidth;
    this.elements.infoPanel.classList.add('info-enter');
  }

  // ==================== 控制按钮 ====================

  bindControls() {
    this.elements.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    this.elements.btnAutoRotate.addEventListener('click', () => this.toggleAutoRotate());
    this.elements.btnGyroscope.addEventListener('click', () => this.toggleGyroscope());

    this.viewer.onAutoRotateComplete = () => {
      this.elements.btnAutoRotate.classList.remove('active');
      this.updateControlTitles();
    };

    this.viewer.onLoadStart = () => this.showLoading();
    this.viewer.onLoadComplete = () => this.hideLoading();
    this.viewer.onLoadProgress = (p) => this.updateProgress(p);
  }

  navigateSpot(direction) {
    const currentIndex = spots.findIndex(s => s.id === this.currentSpotId);
    const newIndex = (currentIndex + direction + spots.length) % spots.length;
    this.switchSpot(spots[newIndex].id);
  }

  // ==================== 全屏 ====================

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  // ==================== 自动旋转 ====================

  toggleAutoRotate() {
    const enabled = !this.viewer.autoRotate;
    this.viewer.setAutoRotate(enabled);
    this.elements.btnAutoRotate.classList.toggle('active', enabled);
    this.updateControlTitles();
  }

  // ==================== 陀螺仪 ====================

  toggleGyroscope() {
    const enabled = !this.viewer.gyroscopeEnabled;
    if (enabled) {
      this.viewer.enableGyroscope();
    } else {
      this.viewer.disableGyroscope();
    }
    this.elements.btnGyroscope.classList.toggle('active', enabled);
    this.updateControlTitles();
  }

  // ==================== 画廊 ====================

  openGallery() {
    this.isGalleryOpen = true;
    this.elements.gallery.classList.remove('hidden');
    const activeCard = document.querySelector('.thumbnail-card.active');
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  closeGallery() {
    this.isGalleryOpen = false;
    this.elements.gallery.classList.add('hidden');
  }

  // ==================== 加载状态 ====================

  showLoading() {
    this.elements.loading.classList.remove('hidden');
    this.elements.loading.classList.add('visible');
    this.elements.progressBar.style.width = '0%';
  }

  hideLoading() {
    this.elements.progressBar.style.width = '100%';
    setTimeout(() => {
      this.elements.loading.classList.remove('visible');
      this.elements.loading.classList.add('hidden');
    }, 400);
  }

  updateProgress(progress) {
    this.elements.progressBar.style.width = `${Math.round(progress * 100)}%`;
  }

  // ==================== 移动端检测 ====================

  detectMobile() {
    const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
    if (isMobile) {
      this.elements.btnGyroscope.style.display = 'flex';
      document.body.classList.add('is-mobile');
    }
  }
}
