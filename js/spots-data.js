// 全景图景点数据配置
// name / location / description 由 js/i18n.js 根据当前语言动态提供
// panorama 指向 assets/panoramas/ 文件夹中的等距柱状投影(2:1)全景图

export const spots = [
  {
    id: 'mountain-sunrise',
    panorama: 'assets/panoramas/1.jpg',
    theme: { skyTop: '#4a7eb5', skyBottom: '#b8cfe0', ground: '#5a7a3a', accent: '#c4a35a' }
  },
  {
    id: 'golden-sunset',
    panorama: 'assets/panoramas/venice_sunset.hdr',
    theme: { skyTop: '#cc6633', skyBottom: '#f4a460', ground: '#8b4513', accent: '#daa520' }
  },
  {
    id: 'misty-peaks',
    panorama: 'assets/panoramas/11.jpg',
    theme: { skyTop: '#2d5a27', skyBottom: '#87ceeb', ground: '#3cb371', accent: '#f5deb3' }
  },
  {
    id: 'lake-scenery',
    panorama: 'assets/panoramas/lakes.hdr',
    theme: { skyTop: '#4682b4', skyBottom: '#e0f0ff', ground: '#2e8b57', accent: '#708090' }
  },
  {
    id: 'forest-path',
    panorama: 'assets/panoramas/rooitou_park.hdr',
    theme: { skyTop: '#ff7f7f', skyBottom: '#ffe4e1', ground: '#66cdaa', accent: '#ffb6c1' }
  },
  {
    id: 'cloud-sea',
    panorama: 'assets/panoramas/6.webp',
    theme: { skyTop: '#483d8b', skyBottom: '#dda0dd', ground: '#696969', accent: '#f0e68c' }
  },
  {
    id: 'vast-grassland',
    panorama: 'assets/panoramas/rolling_hills.hdr',
    theme: { skyTop: '#006080', skyBottom: '#40e0d0', ground: '#228b22', accent: '#ff6347' }
  },
  {
    id: 'dawn-plateau',
    panorama: 'assets/panoramas/kiara_1_dawn.hdr',
    theme: { skyTop: '#1a237e', skyBottom: '#64b5f6', ground: '#8d6e63', accent: '#fff8e1' }
  }
];

export function getSpotById(id) {
  return spots.find(s => s.id === id) || spots[0];
}
