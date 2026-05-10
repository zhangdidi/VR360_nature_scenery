import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

/**
 * 生成程序化等距柱状投影全景纹理
 * 当没有真实全景图时，使用 Canvas 生成美观的场景全景
 */
function generateProceduralTexture(theme) {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 天空渐变（从顶部天顶到地平线）
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.55);
  skyGrad.addColorStop(0, theme.skyTop);
  skyGrad.addColorStop(0.6, theme.skyBottom);
  skyGrad.addColorStop(1, lightenColor(theme.skyBottom, 0.3));
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.55);

  // 远山层 1（最远，最淡）
  ctx.fillStyle = blendColors(theme.skyBottom, theme.ground, 0.4);
  ctx.beginPath();
  ctx.moveTo(0, height * 0.55);
  for (let x = 0; x <= width; x += 4) {
    const y = height * 0.55 - height * 0.08 * (
      Math.sin(x * 0.003) * 0.7 +
      Math.sin(x * 0.007 + 1.2) * 0.5 +
      Math.sin(x * 0.013 + 2.5) * 0.3 +
      0.8
    );
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height * 0.55);
  ctx.closePath();
  ctx.fill();

  // 远山层 2
  ctx.fillStyle = blendColors(theme.skyBottom, theme.ground, 0.55);
  ctx.beginPath();
  ctx.moveTo(0, height * 0.55);
  for (let x = 0; x <= width; x += 4) {
    const y = height * 0.55 - height * 0.12 * (
      Math.sin(x * 0.004 + 0.8) * 0.6 +
      Math.sin(x * 0.009 + 3.1) * 0.5 +
      Math.sin(x * 0.015 + 1.0) * 0.25 +
      0.9
    );
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height * 0.55);
  ctx.closePath();
  ctx.fill();

  // 主山体层
  ctx.fillStyle = theme.ground;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.58);
  for (let x = 0; x <= width; x += 4) {
    const y = height * 0.58 - height * 0.18 * (
      Math.sin(x * 0.005 + 0.3) * 0.5 +
      Math.sin(x * 0.011 + 2.0) * 0.4 +
      Math.sin(x * 0.018 + 4.0) * 0.35 +
      Math.sin(x * 0.025 + 0.7) * 0.15 +
      0.7
    );
    ctx.lineTo(x, Math.max(height * 0.42, y));
  }
  ctx.lineTo(width, height * 0.58);
  ctx.closePath();
  ctx.fill();

  // 地面渐变
  const groundGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
  groundGrad.addColorStop(0, theme.ground);
  groundGrad.addColorStop(1, darkenColor(theme.ground, 0.35));
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  // 前景丘陵
  ctx.fillStyle = darkenColor(theme.ground, 0.15);
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  for (let x = 0; x <= width; x += 6) {
    const y = height * 0.7 - height * 0.06 * (
      Math.sin(x * 0.008 + 1.5) * 0.5 +
      Math.sin(x * 0.02 + 3.0) * 0.35 +
      0.8
    );
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height * 0.7);
  ctx.closePath();
  ctx.fill();

  // 云朵效果
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height * 0.4;
    const rw = 30 + Math.random() * 100;
    const rh = 8 + Math.random() * 25;
    drawEllipse(ctx, cx, cy, rw, rh);
  }

  // 第二层云朵
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 20; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height * 0.35;
    const rw = 60 + Math.random() * 180;
    const rh = 10 + Math.random() * 30;
    drawEllipse(ctx, cx, cy, rw, rh);
  }

  return new THREE.CanvasTexture(canvas);
}

function drawEllipse(ctx, cx, cy, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function blendColors(c1, c2, ratio) {
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  return `rgb(${r},${g},${b})`;
}

function lightenColor(hex, factor) {
  const r = Math.min(255, Math.round(parseInt(hex.slice(1, 3), 16) + 255 * factor));
  const g = Math.min(255, Math.round(parseInt(hex.slice(3, 5), 16) + 255 * factor));
  const b = Math.min(255, Math.round(parseInt(hex.slice(5, 7), 16) + 255 * factor));
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex, factor) {
  const r = Math.max(0, Math.round(parseInt(hex.slice(1, 3), 16) * (1 - factor)));
  const g = Math.max(0, Math.round(parseInt(hex.slice(3, 5), 16) * (1 - factor)));
  const b = Math.max(0, Math.round(parseInt(hex.slice(5, 7), 16) * (1 - factor)));
  return `rgb(${r},${g},${b})`;
}

// ==================== 全景查看器 ====================

export class PanoramaViewer {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.sphere = null;
    this.animationId = null;

    // 旋转状态
    this.theta = 0;       // 水平角度 (弧度)
    this.phi = 0;         // 垂直角度 (弧度)
    this.fov = 75;        // 视场角
    this.targetTheta = 0;
    this.targetPhi = 0;
    this.targetFov = 75;

    // 自动旋转
    this.autoRotate = true;
    this.autoRotateSpeed = 0.3;
    this.autoRotateAccum = 0;        // 累计自动旋转角度
    this.autoRotateTarget = Math.PI * 2; // 目标：旋转一圈后停止
    this.autoRotateDecelerating = false;

    // 陀螺仪
    this.gyroscopeEnabled = false;
    this.gyroAlpha = 0;
    this.gyroBeta = 0;
    this.gyroGamma = 0;
    this._gyroHandler = null;

    // 交互状态
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.prevTouches = [];
    this.velocity = { theta: 0, phi: 0 };

    // 回调
    this.onLoadStart = null;
    this.onLoadProgress = null;
    this.onLoadComplete = null;

    this.init();
  }

  init() {
    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    // 场景
    this.scene = new THREE.Scene();

    // 相机（在球心）
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 0);

    // 创建默认球体
    this.createSphere(null);

    // 绑定事件
    this.bindEvents();

    // 启动渲染循环
    this.animate();
  }

  createSphere(texture) {
    if (this.sphere) {
      this.sphere.material.dispose();
      if (this.sphere.material.map) this.sphere.material.map.dispose();
      this.scene.remove(this.sphere);
    }

    const geometry = new THREE.SphereGeometry(100, 64, 32);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);
  }

  async loadPanorama(url, theme) {
    if (this.onLoadStart) this.onLoadStart();

    return new Promise((resolve) => {
      const fallback = () => {
        if (theme) {
          const procTexture = generateProceduralTexture(theme);
          this.createSphere(procTexture);
        }
        this.resetView();
        if (this.onLoadComplete) this.onLoadComplete();
        resolve(false);
      };

      if (!url) {
        fallback();
        return;
      }

      // 根据扩展名选择加载器：.hdr 用 RGBELoader，其他用 TextureLoader
      const isHDR = url.toLowerCase().endsWith('.hdr');

      if (isHDR) {
        const rgbeLoader = new RGBELoader();
        rgbeLoader.setDataType(THREE.HalfFloatType);
        rgbeLoader.load(
          url,
          (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            this.createSphere(texture);
            this.resetView();
            if (this.onLoadComplete) this.onLoadComplete();
            resolve(true);
          },
          (progress) => {
            if (this.onLoadProgress && progress.total > 0) {
              this.onLoadProgress(progress.loaded / progress.total);
            }
          },
          () => fallback()
        );
      } else {
        const loader = new THREE.TextureLoader();
        loader.load(
          url,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            this.createSphere(texture);
            this.resetView();
            if (this.onLoadComplete) this.onLoadComplete();
            resolve(true);
          },
          (progress) => {
            if (this.onLoadProgress && progress.total > 0) {
              this.onLoadProgress(progress.loaded / progress.total);
            }
          },
          () => fallback()
        );
      }
    });
  }

  resetView() {
    this.theta = 0;
    this.phi = 0;
    this.fov = 75;
    this.targetTheta = 0;
    this.targetPhi = 0;
    this.targetFov = 75;
    this.velocity.theta = 0;
    this.velocity.phi = 0;
    this.autoRotateAccum = 0;
    this.autoRotateDecelerating = false;
  }

  // ==================== 事件绑定 ====================

  bindEvents() {
    const el = this.renderer.domElement;

    // 鼠标事件
    el.addEventListener('mousedown', (e) => this.onMouseDown(e));
    el.addEventListener('mousemove', (e) => this.onMouseMove(e));
    el.addEventListener('mouseup', () => this.onMouseUp());
    el.addEventListener('mouseleave', () => this.onMouseUp());
    el.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // 触摸事件
    el.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    el.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    el.addEventListener('touchend', (e) => this.onTouchEnd(e));

    // 窗口大小变化
    window.addEventListener('resize', () => this.onResize());

    // 上下文菜单禁用（右键）
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  onMouseDown(e) {
    this.isDragging = true;
    this.prevMouse.x = e.clientX;
    this.prevMouse.y = e.clientY;
    this.velocity.theta = 0;
    this.velocity.phi = 0;
    if (this.autoRotate) {
      this.autoRotate = false;
      this.autoRotateAccum = 0;
      this.autoRotateDecelerating = false;
      if (this.onAutoRotateComplete) this.onAutoRotateComplete();
    }
  }

  onMouseMove(e) {
    if (!this.isDragging) return;

    const dx = e.clientX - this.prevMouse.x;
    const dy = e.clientY - this.prevMouse.y;

    this.velocity.theta = dx * 0.005;
    this.velocity.phi = dy * 0.005;

    this.targetTheta -= this.velocity.theta;
    this.targetPhi -= this.velocity.phi;
    this.targetPhi = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.targetPhi));

    this.prevMouse.x = e.clientX;
    this.prevMouse.y = e.clientY;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    this.targetFov += e.deltaY * 0.05;
    this.targetFov = Math.max(25, Math.min(120, this.targetFov));
  }

  onTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.prevMouse.x = e.touches[0].clientX;
      this.prevMouse.y = e.touches[0].clientY;
      this.velocity.theta = 0;
      this.velocity.phi = 0;
      if (this.autoRotate) {
        this.autoRotate = false;
        this.autoRotateAccum = 0;
        this.autoRotateDecelerating = false;
        if (this.onAutoRotateComplete) this.onAutoRotateComplete();
      }
    }
    this.prevTouches = [...e.touches];
  }

  onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1 && this.isDragging) {
      const dx = e.touches[0].clientX - this.prevMouse.x;
      const dy = e.touches[0].clientY - this.prevMouse.y;

      this.velocity.theta = dx * 0.005;
      this.velocity.phi = dy * 0.005;

      this.targetTheta -= this.velocity.theta;
      this.targetPhi -= this.velocity.phi;
      this.targetPhi = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.targetPhi));

      this.prevMouse.x = e.touches[0].clientX;
      this.prevMouse.y = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      // 双指缩放
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.sqrt(dx * dx + dy * dy);

      const prevDx = this.prevTouches[0]?.clientX - this.prevTouches[1]?.clientX || dx;
      const prevDy = this.prevTouches[0]?.clientY - this.prevTouches[1]?.clientY || dy;
      const prevDist = Math.sqrt(prevDx * prevDx + prevDy * prevDy);

      if (prevDist > 0) {
        const scale = prevDist / currentDist;
        this.targetFov *= scale;
        this.targetFov = Math.max(25, Math.min(120, this.targetFov));
      }
    }
    this.prevTouches = [...e.touches];
  }

  onTouchEnd(e) {
    if (e.touches.length === 0) {
      this.isDragging = false;
    }
    this.prevTouches = [...e.touches];
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ==================== 陀螺仪 ====================

  enableGyroscope() {
    if (typeof DeviceOrientationEvent !== 'undefined') {
      // iOS 13+ 需要权限请求
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === 'granted') {
              this._startGyro();
            }
          })
          .catch(() => {});
      } else {
        this._startGyro();
      }
    }
  }

  _startGyro() {
    this.gyroscopeEnabled = true;
    this._gyroHandler = (e) => {
      if (!this.gyroscopeEnabled || this.isDragging) return;
      // 将设备方向映射到全景视角
      // alpha: 罗盘方向 (0-360)
      // beta: 前后倾斜 (-180 to 180)
      // gamma: 左右倾斜 (-90 to 90)
      if (e.alpha !== null) {
        const alpha = THREE.MathUtils.degToRad(e.alpha);
        const beta = THREE.MathUtils.degToRad(e.beta || 0);
        this.targetTheta = alpha;
        this.targetPhi = -beta * 0.8;
        this.targetPhi = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.targetPhi));
      }
    };
    window.addEventListener('deviceorientation', this._gyroHandler);
  }

  disableGyroscope() {
    this.gyroscopeEnabled = false;
    if (this._gyroHandler) {
      window.removeEventListener('deviceorientation', this._gyroHandler);
      this._gyroHandler = null;
    }
  }

  // ==================== 渲染循环 ====================

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // 惯性/阻尼平滑
    if (!this.isDragging && !this.gyroscopeEnabled) {
      if (this.autoRotate) {
        // 减速阶段：逐渐降低速度
        let speed = this.autoRotateSpeed;
        if (this.autoRotateDecelerating) {
          const remaining = this.autoRotateTarget - this.autoRotateAccum;
          // 剩余角度越少，速度越慢
          speed = Math.max(0.02, this.autoRotateSpeed * Math.min(1, remaining / 1.5));
        }

        const step = speed * 0.01;
        this.targetTheta += step;
        this.autoRotateAccum += step;

        // 旋转达到目标角度，停止
        if (this.autoRotateAccum >= this.autoRotateTarget) {
          this.autoRotate = false;
          this.autoRotateAccum = 0;
          this.autoRotateDecelerating = false;
          if (this.onAutoRotateComplete) this.onAutoRotateComplete();
        }
        // 旋转超过 70% 时开始减速
        else if (this.autoRotateAccum > this.autoRotateTarget * 0.7 && !this.autoRotateDecelerating) {
          this.autoRotateDecelerating = true;
        }
      }

      // 惯性衰减
      if (Math.abs(this.velocity.theta) > 0.0001 || Math.abs(this.velocity.phi) > 0.0001) {
        this.targetTheta -= this.velocity.theta;
        this.targetPhi -= this.velocity.phi;
        this.targetPhi = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.targetPhi));
        this.velocity.theta *= 0.95;
        this.velocity.phi *= 0.95;
      }
    }

    // 平滑插值
    this.theta += (this.targetTheta - this.theta) * 0.1;
    this.phi += (this.targetPhi - this.phi) * 0.1;
    this.fov += (this.targetFov - this.fov) * 0.1;

    // 归一化 theta
    while (this.theta > Math.PI * 2) this.theta -= Math.PI * 2;
    while (this.theta < -Math.PI * 2) this.theta += Math.PI * 2;

    // 更新相机
    const euler = new THREE.Euler(this.phi, this.theta, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(euler);
    this.camera.fov = this.fov;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }

  setAutoRotate(enabled) {
    this.autoRotate = enabled;
    if (enabled) {
      this.autoRotateAccum = 0;
      this.autoRotateDecelerating = false;
    }
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.disableGyroscope();
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
    if (this.sphere) {
      this.sphere.material.dispose();
      if (this.sphere.material.map) this.sphere.material.map.dispose();
      this.sphere.geometry.dispose();
    }
  }
}
