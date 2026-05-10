import { PanoramaViewer } from './panorama-viewer.js';
import { UIController } from './ui-controller.js';
import { spots, getSpotById } from './spots-data.js';
import { t, getSpotI18n, getLang, setLang } from './i18n.js';

let viewer = null;
let ui = null;
let currentSpotId = spots[0].id;

// ==================== 轮播逻辑 ====================

let carouselIndex = 0;
let carouselTimer = null;
let carouselPaused = false;
const CAROUSEL_INTERVAL = 4500;

const icons = ['🏔️', '🌅', '⛰️', '🏞️', '🌿', '☁️', '🌾', '🌄'];

function buildCarousel() {
  const track = document.getElementById('carousel-track');
  const dots = document.getElementById('carousel-dots');
  if (!track || !dots) return;

  // 生成幻灯片
  track.innerHTML = spots.map((spot, i) => {
    const s = getSpotI18n(spot.id);
    return `
    <div class="carousel-slide${i === 0 ? ' active' : ''}" data-spot-id="${spot.id}" data-index="${i}">
      <div class="slide-bg" style="background-image: url(assets/carousel/${spot.id}.jpg)">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0.65) 100%)"></div>
      </div>
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <div class="slide-location">📍 ${s.location}</div>
        <div class="slide-name">${s.name}</div>
        <div class="slide-desc">${s.description}</div>
        <button class="slide-enter" data-spot-id="${spot.id}">${t('enterVR')}</button>
      </div>
    </div>
  `}).join('');

  // 生成指示点
  dots.innerHTML = spots.map((_, i) => `
    <button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
  `).join('');

  // 绑定事件
  bindCarouselEvents();
  startCarousel();
}

function rebuildCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = null;
  carouselIndex = 0;
  buildCarousel();
}

function bindCarouselEvents() {
  document.querySelectorAll('.carousel-slide').forEach((slide) => {
    slide.addEventListener('click', (e) => {
      if (e.target.closest('.slide-enter')) return;
      enterVR(slide.dataset.spotId);
    });
  });

  document.querySelectorAll('.slide-enter').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      enterVR(btn.dataset.spotId);
    });
  });

  document.querySelectorAll('.carousel-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
    });
  });

  document.getElementById('carousel-prev').addEventListener('click', () => {
    goToSlide((carouselIndex - 1 + spots.length) % spots.length);
  });
  document.getElementById('carousel-next').addEventListener('click', () => {
    goToSlide((carouselIndex + 1) % spots.length);
  });

  const carousel = document.getElementById('hero-carousel');
  carousel.addEventListener('mouseenter', () => { carouselPaused = true; });
  carousel.addEventListener('mouseleave', () => { carouselPaused = false; });
  carousel.addEventListener('touchstart', () => { carouselPaused = true; });
  carousel.addEventListener('touchend', () => {
    setTimeout(() => { carouselPaused = false; }, 2000);
  });
}

function goToSlide(index) {
  if (index === carouselIndex) return;

  document.querySelectorAll('.carousel-slide').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.carousel-dot').forEach((d) => d.classList.remove('active'));

  carouselIndex = index;
  const slide = document.querySelector(`.carousel-slide[data-index="${index}"]`);
  const dot = document.querySelector(`.carousel-dot[data-index="${index}"]`);
  if (slide) slide.classList.add('active');
  if (dot) dot.classList.add('active');

  resetCarouselTimer();
}

function startCarousel() {
  carouselTimer = setInterval(() => {
    if (!carouselPaused) {
      goToSlide((carouselIndex + 1) % spots.length);
    }
  }, CAROUSEL_INTERVAL);
}

function resetCarouselTimer() {
  clearInterval(carouselTimer);
  startCarousel();
}

// ==================== 首页初始化 ====================

function buildSpotsGrid() {
  const grid = document.getElementById('spots-grid');
  if (!grid) return;

  grid.innerHTML = spots.map((spot, i) => {
    const s = getSpotI18n(spot.id);
    return `
    <div class="spot-card" data-spot-id="${spot.id}">
      <div class="card-header">
        <div class="card-icon" style="background: linear-gradient(135deg, ${spot.theme.skyTop}, ${spot.theme.ground})">
          ${icons[i]}
        </div>
        <div class="card-name">${s.name}</div>
      </div>
      <div class="card-location">${s.location}</div>
      <div class="card-desc">${s.description}</div>
      <div class="card-enter">${t('enterVR')}</div>
    </div>
  `}).join('');

  grid.querySelectorAll('.spot-card').forEach((card) => {
    card.addEventListener('click', () => {
      enterVR(card.dataset.spotId);
    });
  });
}

function updateHomeText() {
  // 更新标题和副标题
  const titleEl = document.querySelector('.home-title');
  if (titleEl) {
    titleEl.innerHTML = `<span class="title-icon">🌍</span>
        ${t('homeHeading')}
        <span class="title-accent">${t('homeHeadingVR')}</span>
        ${t('homeHeadingPanorama')}`;
  }
  const subtitleEl = document.querySelector('.home-subtitle');
  if (subtitleEl) subtitleEl.textContent = t('siteSubtitle');

  const footerEl = document.querySelector('.home-footer p');
  if (footerEl) footerEl.textContent = t('footerHint');
}

// ==================== 语言切换 ====================

function onLangChange() {
  updateHomeText();
  rebuildCarousel();
  buildSpotsGrid();
  // 更新语言切换按钮状态
  updateLangSwitcherUI();
}

function updateLangSwitcherUI() {
  const lang = getLang();
  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// ==================== 页面切换 ====================

async function enterVR(spotId) {
  const homePage = document.getElementById('home-page');
  const vrPage = document.getElementById('vr-page');

  currentSpotId = spotId;

  homePage.style.opacity = '0';
  homePage.style.pointerEvents = 'none';
  setTimeout(() => {
    homePage.style.display = 'none';
  }, 400);

  vrPage.classList.remove('hidden');
  vrPage.classList.add('transitioning-in');
  setTimeout(() => vrPage.classList.remove('transitioning-in'), 500);

  const container = document.getElementById('vr-container');
  if (!viewer) {
    viewer = new PanoramaViewer(container);
    ui = new UIController(viewer);
    setupBackButton();
  } else {
    container.appendChild(viewer.renderer.domElement);
    viewer.onResize();
  }

  const spot = getSpotById(spotId);
  ui.setCurrentSpot(spotId);
  await viewer.loadPanorama(spot.panorama, spot.theme);
}

function exitVR() {
  const homePage = document.getElementById('home-page');
  const vrPage = document.getElementById('vr-page');

  homePage.style.display = '';
  requestAnimationFrame(() => {
    homePage.style.opacity = '1';
    homePage.style.pointerEvents = '';
  });

  vrPage.classList.add('hidden');

  if (viewer) {
    viewer.setAutoRotate(false);
    viewer.disableGyroscope();
    viewer.resetView();
  }
}

function setupBackButton() {
  const btnBack = document.getElementById('btn-back');
  if (!btnBack) return;

  const newBtn = btnBack.cloneNode(true);
  btnBack.parentNode.replaceChild(newBtn, btnBack);

  newBtn.addEventListener('click', () => exitVR());
  newBtn.classList.add('show');
}

// ==================== 键盘快捷键 ====================

document.addEventListener('keydown', (e) => {
  if (!viewer || document.getElementById('vr-page').classList.contains('hidden')) return;

  switch (e.key.toLowerCase()) {
    case 'escape':
      exitVR();
      break;
    case 'f':
      if (ui) ui.toggleFullscreen();
      break;
    case 'a':
      if (ui) ui.toggleAutoRotate();
      break;
    case 'arrowleft':
      if (ui) ui.navigateSpot(-1);
      break;
    case 'arrowright':
      if (ui) ui.navigateSpot(1);
      break;
  }
});

// ==================== 应用启动 ====================

function bindLangSwitcher() {
  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLang(btn.dataset.lang);
    });
  });
}

function init() {
  updateHomeText();
  buildCarousel();
  buildSpotsGrid();
  updateLangSwitcherUI();
  bindLangSwitcher();

  // 监听语言切换事件
  window.addEventListener('langchange', onLangChange);

  console.log('🌍 VR360 自然风光全景网站已就绪');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
