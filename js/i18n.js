// 国际化翻译数据：中文 / 日本語 / English

const translations = {
  zh: {
    siteTitle: 'VR360 · 自然风光全景',
    siteSubtitle: '足不出户，身临其境感受世界各地的壮美风光',
    homeHeading: '自然风光',
    homeHeadingVR: 'VR360',
    homeHeadingPanorama: '全景',
    enterVR: '进入全景',
    footerHint: '点击轮播图或下方卡片，开启 VR360 全景之旅',

    vrBadge: 'VR 全景',
    vrLoading: '加载全景中',
    vrHint: '拖拽旋转 · 滚轮缩放 · 点击下方缩略图切换景点',
    btnBack: '返回首页',
    btnAutoRotateOn: '关闭自动旋转',
    btnAutoRotateOff: '开启自动旋转',
    btnFullscreen: '全屏模式',
    btnGyroscopeOn: '关闭陀螺仪',
    btnGyroscopeOff: '开启陀螺仪',

    spots: {
      'mountain-sunrise': {
        name: '山间晨曦',
        location: '群山之巅',
        description: '清晨第一缕阳光洒落山峦，云海翻涌于山谷之间，远山如黛，层峦叠嶂，天地之间一派壮阔景象。'
      },
      'golden-sunset': {
        name: '金色日落',
        location: '水岸夕阳',
        description: '夕阳余晖染红天际，金色光芒洒满水面，建筑剪影与波光交相辉映，宛如一幅流动的油画。'
      },
      'misty-peaks': {
        name: '雾霭群峰',
        location: '奇峰林立',
        description: '云雾缭绕于奇峰之间，三千石柱拔地而起，苍翠欲滴的原始森林覆盖山谷，宛如仙境降临人间。'
      },
      'lake-scenery': {
        name: '湖光山色',
        location: '碧水湖畔',
        description: '湖水如镜映照蓝天白云，远山倒影清晰如画，微风拂过水面泛起粼粼波光，令人心旷神怡。'
      },
      'forest-path': {
        name: '林间幽径',
        location: '静谧森林',
        description: '阳光透过树叶洒下斑驳光影，蜿蜒小径通向远方，鸟鸣虫唱萦绕耳畔，享受片刻宁静与安然。'
      },
      'cloud-sea': {
        name: '云海奇松',
        location: '高山之巅',
        description: '云海翻腾如临大海之滨，奇松怪石在云雾中若隐若现，日出时分霞光万道，蔚为壮观。'
      },
      'vast-grassland': {
        name: '辽阔草原',
        location: '无垠草海',
        description: '一望无际的丘陵草原如绿色海洋，起伏的山坡线条柔美，蓝天白云下牛羊点缀其间，天地辽阔任君驰骋。'
      },
      'dawn-plateau': {
        name: '晨曦高原',
        location: '高原黎明',
        description: '黎明时分的高原大地，晨曦微露染红东方天际，远山剪影层次分明，天地静谧而庄严神圣。'
      }
    }
  },

  ja: {
    siteTitle: 'VR360 · 自然風景パノラマ',
    siteSubtitle: '世界中の壮大な景色を、自宅にいながら体感しよう',
    homeHeading: '自然風景',
    homeHeadingVR: 'VR360',
    homeHeadingPanorama: 'パノラマ',
    enterVR: 'パノラマに入る',
    footerHint: 'カルーセルまたはカードをクリックして、VR360パノラマの旅を始めましょう',

    vrBadge: 'VR パノラマ',
    vrLoading: 'パノラマ読み込み中',
    vrHint: 'ドラッグで回転 · スクロールでズーム · サムネイルでスポット切替',
    btnBack: 'ホームに戻る',
    btnAutoRotateOn: '自動回転を停止',
    btnAutoRotateOff: '自動回転を開始',
    btnFullscreen: 'フルスクリーン',
    btnGyroscopeOn: 'ジャイロを停止',
    btnGyroscopeOff: 'ジャイロを開始',

    spots: {
      'mountain-sunrise': {
        name: '山間の夜明け',
        location: '山々の頂',
        description: '夜明けの最初の光が山々を照らし、雲海が谷間に広がる。遠くの山並みが藍色に染まり、幾重にも重なる峰々が壮大な景色を作り出す。'
      },
      'golden-sunset': {
        name: '黄金の夕日',
        location: '水辺の夕暮れ',
        description: '夕日の残光が空を赤く染め、金色の光が水面に降り注ぐ。建物のシルエットと波光が調和し、流れるような絵画のような光景が広がる。'
      },
      'misty-peaks': {
        name: '霧立つ峰々',
        location: '奇峰林立',
        description: '霧と雲が奇峰の間を縫って漂い、三千の石柱が空に向かってそびえ立つ。原生林の深い緑が谷を覆い、まるで仙境が地上に降り立ったかのよう。'
      },
      'lake-scenery': {
        name: '湖光山色',
        location: '碧き湖の畔',
        description: '鏡のような湖面が青空と白雲を映し出し、遠くの山々の影が絵のように鮮やかに揺れる。そよ風が水面を撫で、きらめく波紋が心を癒してくれる。'
      },
      'forest-path': {
        name: '森の小径',
        location: '静寂の森',
        description: '木漏れ日が差し込み、まだら模様の光と影を作り出す。曲がりくねった小道が遠くへと続き、鳥のさえずりと虫の音が耳に心地よく響く静かなひととき。'
      },
      'cloud-sea': {
        name: '雲海と奇松',
        location: '高山の頂',
        description: '雲海が大海原のように押し寄せ、奇松と奇岩が霧の中に姿を現したり隠れたりする。日の出の時、幾筋もの光芒が差し込み、息をのむ壮観さである。'
      },
      'vast-grassland': {
        name: '広大な草原',
        location: '果てしない草原',
        description: '見渡す限りの丘陵草原が緑の海のように広がり、なだらかな稜線が優美な曲線を描く。青空と白雲の下、点在する牛羊が天地の広がりを感じさせる。'
      },
      'dawn-plateau': {
        name: '暁の高原',
        location: '高原の夜明け',
        description: '夜明け前の高原の大地、朝焼けが東の空をほのかに赤く染める。遠くの山並みのシルエットが幾重にも重なり、天地は静寂の中に神聖な荘厳さを湛えている。'
      }
    }
  },

  en: {
    siteTitle: 'VR360 · Nature Panorama',
    siteSubtitle: 'Experience the world\'s magnificent scenery from the comfort of home',
    homeHeading: 'Nature Scenery',
    homeHeadingVR: 'VR360',
    homeHeadingPanorama: 'Panorama',
    enterVR: 'Enter Panorama',
    footerHint: 'Click the carousel or cards below to start your VR360 journey',

    vrBadge: 'VR Panorama',
    vrLoading: 'Loading panorama',
    vrHint: 'Drag to rotate · Scroll to zoom · Click thumbnails to switch spots',
    btnBack: 'Back to Home',
    btnAutoRotateOn: 'Stop Auto Rotate',
    btnAutoRotateOff: 'Start Auto Rotate',
    btnFullscreen: 'Fullscreen',
    btnGyroscopeOn: 'Disable Gyroscope',
    btnGyroscopeOff: 'Enable Gyroscope',

    spots: {
      'mountain-sunrise': {
        name: 'Mountain Sunrise',
        location: 'Mountain Summit',
        description: 'The first rays of dawn illuminate the mountain ridges as a sea of clouds rolls through the valleys. Distant peaks fade into shades of indigo, layer upon layer of grandeur stretching across the horizon.'
      },
      'golden-sunset': {
        name: 'Golden Sunset',
        location: 'Waterside Dusk',
        description: 'The afterglow of sunset paints the sky crimson as golden light spills across the water. Silhouettes of buildings and shimmering reflections intertwine, creating a scene like a living oil painting.'
      },
      'misty-peaks': {
        name: 'Misty Peaks',
        location: 'Towering Pillars',
        description: 'Mist and cloud drift among towering stone pillars, three thousand peaks rising from the earth. Emerald primordial forest blankets the valleys below, as if a fairy realm has descended upon the mortal world.'
      },
      'lake-scenery': {
        name: 'Lakeside Scenery',
        location: 'Azure Lakeshore',
        description: 'The mirror-like lake reflects blue sky and white clouds, with distant mountain silhouettes crisp as a painting. A gentle breeze ripples the water\'s surface, its sparkling waves soothing the soul.'
      },
      'forest-path': {
        name: 'Forest Pathway',
        location: 'Tranquil Woods',
        description: 'Sunlight filters through the canopy, casting dappled patterns of light and shadow. A winding path leads into the distance, accompanied by birdsong and the hum of insects — a moment of perfect stillness.'
      },
      'cloud-sea': {
        name: 'Sea of Clouds',
        location: 'Alpine Summit',
        description: 'A churning sea of clouds stretches to the horizon like an ocean in the sky. Ancient pines and weathered rocks appear and vanish in the mist, and at sunrise, radiant beams pierce through in breathtaking splendor.'
      },
      'vast-grassland': {
        name: 'Vast Grassland',
        location: 'Endless Prairie',
        description: 'Rolling hills of grassland stretch as far as the eye can see, a green ocean under blue skies. Gentle slopes trace graceful curves across the landscape, with cattle and sheep dotting the boundless expanse.'
      },
      'dawn-plateau': {
        name: 'Dawn Plateau',
        location: 'Highland Dawn',
        description: 'In the early hours of dawn, the plateau rests beneath a sky tinged rose by the coming sun. Layered silhouettes of distant mountains stand in solemn grandeur, the world hushed in sacred tranquility.'
      }
    }
  }
};

// ==================== i18n 管理 ====================

const storage = typeof localStorage !== 'undefined' ? localStorage : null;
let currentLang = (storage && storage.getItem('vr360-lang')) || 'en';

export function getLang() {
  return currentLang;
}

export function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }
  return value || key;
}

export function getSpotI18n(spotId) {
  const spotData = translations[currentLang].spots[spotId];
  if (spotData) return spotData;

  // 回退到中文
  if (currentLang !== 'zh' && translations.zh.spots[spotId]) {
    return translations.zh.spots[spotId];
  }
  return { name: spotId, location: '', description: '' };
}

export function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  if (storage) storage.setItem('vr360-lang', lang);
  document.documentElement.lang = lang;

  // 更新页面标题
  document.title = t('siteTitle');

  // 触发自定义事件，让各模块响应语言切换
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

// 初始化
document.documentElement.lang = currentLang;
document.title = translations[currentLang]?.siteTitle || 'VR360 · Nature Panorama';
