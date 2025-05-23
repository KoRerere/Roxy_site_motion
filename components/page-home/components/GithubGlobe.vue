<template>
  <canvas ref="githubGlobeRef" :class="cn('w-96 h-96', props.class)"></canvas>
</template>

<script lang="ts" setup>
// Download globe json file from https://geojson-maps.kyd.au/ and save in the same folder
import ThreeGlobe from "three-globe";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
  Clock
} from "three";
import contries from "./globe.json";
import { cn } from "@/utils/basic";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useIntersectionObserver, useWindowFocus, useDocumentVisibility } from "@vueuse/core";

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

interface GlobeData {
  size: number | undefined;
  order: number;
  color: (t: number) => string;
  lat: number;
  lng: number;
}

interface GlobeConfig {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

interface Props {
  globeConfig?: GlobeConfig;
  data?: Position[];
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  globeConfig: () => {
    return {};
  },
  data: () => [],
});

const defaultGlobeConfig: GlobeConfig = {
  pointSize: 1,
  atmosphereColor: "#ffffff",
  showAtmosphere: false,
  atmosphereAltitude: 0.1,
  polygonColor: "rgba(255,255,255,0.7)",
  globeColor: "#1d072e",
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  ...props.globeConfig,
};

const githubGlobeRef = ref<HTMLCanvasElement>();
const globeData = ref<GlobeData[]>();
const isVisible = ref(false);
const isIntersecting = ref(false);
const isWindowFocused = useWindowFocus();
const documentVisibility = useDocumentVisibility();
const shouldRender = ref(false);

let numberOfRings: number[] = [];

let renderer: WebGLRenderer;
let scene: Scene;
let camera: PerspectiveCamera;
// let controls: OrbitControls;
let animationFrameId: number | null = null;

let globe: ThreeGlobe;

// 监视可见性相关的所有状态
watch(
  [isIntersecting, isWindowFocused, documentVisibility],
  ([intersecting, focused, visibility]) => {
    const newShouldRender = intersecting && focused && visibility === 'visible';
    
    if (newShouldRender !== shouldRender.value) {
      shouldRender.value = newShouldRender;
      
      if (shouldRender.value) {
        // 如果未初始化且应该渲染，则初始化
        if (!isVisible.value) {
          isVisible.value = true;
          initGlobe();
          startAnimation();
        }
        // 恢复动画
        startAnimationLoop();
      } else if (animationFrameId !== null) {
        // 暂停动画
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }
);

onMounted(() => {
  // 设置场景，但不立即初始化地球
  if (githubGlobeRef.value) {
    setupScene();
    
    // 监听组件是否在视口内
    useIntersectionObserver(githubGlobeRef, ([entry]) => {
      isIntersecting.value = entry.isIntersecting;
    });
    
    // 响应窗口大小变化
    import.meta.client && window.addEventListener("resize", onWindowResize, false);
    
    // watch(globeData, () => {
    //   if (!globe || !globeData.value || !shouldRender.value) return;
      
    //   try {
    //     // 过滤掉无效数据点
    //     const validGlobeData = globeData.value.filter(item => 
    //       !isNaN(item.lat) && !isNaN(item.lng) && item.color && typeof item.color === 'function'
    //     );

    //     if (validGlobeData.length === 0) {
    //       console.warn('No valid globe data points found');
    //       return;
    //     }

    //     numberOfRings = genRandomNumbers(
    //       0,
    //       validGlobeData.length,
    //       Math.min(Math.floor((validGlobeData.length * 4) / 5), validGlobeData.length)
    //     );

    //     globe.ringsData(
    //       validGlobeData.filter((d, i) => numberOfRings.includes(i))
    //     );
    //   } catch (error) {
    //     console.error('Error updating globe rings:', error);
    //   }
    // });
  }
});

onBeforeUnmount(() => {
  try {
    // 停止动画
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    window.removeEventListener("resize", onWindowResize);
    
    // 清理资源
    if (renderer) {
      renderer.dispose();
    }
    if (globe && scene) {
      scene.remove(globe);
    }
  } catch (error) {
    console.error('Error cleaning up globe resources:', error);
  }
});

function setupScene() {
  if (!githubGlobeRef.value) {
    throw new Error("Canvas not initialized");
  }

  const width = githubGlobeRef.value.clientWidth;
  const height = githubGlobeRef.value.clientHeight;

  renderer = new WebGLRenderer({
    canvas: githubGlobeRef.value,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer.setPixelRatio(window.devicePixelRatio / 2)
  renderer.setSize(width, height);
  renderer.autoClear = false;

  scene = new Scene();

  camera = new PerspectiveCamera();
  camera.aspect = width / height;
  camera.position.setX(0);
  camera.position.setY(0);
  camera.position.setZ(400);

  const ambientLight = new AmbientLight(
    defaultGlobeConfig.ambientLight || "#ffffff",
    0.6
  );
  scene.add(ambientLight);

  const dLight1 = new DirectionalLight(
    defaultGlobeConfig.directionalLeftLight || "#ffffff",
    1
  );
  dLight1.position.set(-400, 100, 400);
  camera.add(dLight1);

  const dLight2 = new DirectionalLight(
    defaultGlobeConfig.directionalTopLight || "#ffffff",
    1
  );
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  const pLight = new PointLight(
    defaultGlobeConfig.pointLight || "#ffffff",
    0.8
  );
  pLight.position.set(-200, 500, 200);
  camera.add(pLight);

  camera.updateProjectionMatrix();
  scene.add(camera);

  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableZoom = false;
  // controls.enablePan = false;
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.01;
  // controls.minDistance = 200;
  // controls.maxDistance = 500;
  // controls.rotateSpeed = defaultGlobeConfig.autoRotateSpeed || 0.8;
  // controls.zoomSpeed = 1;
  // controls.autoRotate = defaultGlobeConfig.autoRotate || false;

  // controls.minPolarAngle = Math.PI / 3.5;
  // controls.maxPolarAngle = Math.PI - Math.PI / 3;
}

function initGlobe() {
  buildData();

  globe = new ThreeGlobe({
    waitForGlobeReady: false,
    animateIn: false
  })
    .hexPolygonsData(contries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(defaultGlobeConfig.showAtmosphere!)
    .atmosphereColor(defaultGlobeConfig.atmosphereColor!)
    .atmosphereAltitude(defaultGlobeConfig.atmosphereAltitude!)
    .showGraticules(false)
    // .showGlobe(false)
    .hexPolygonColor((e) => defaultGlobeConfig.polygonColor!);

  globe.rotateY(-Math.PI * (5 / 9));
  globe.rotateZ(-Math.PI / 6);

  const globeMaterial = globe.globeMaterial() as unknown as {
    color: Color;
    emissive: Color;
    emissiveIntensity: number;
    shininess: number;
  };

  globeMaterial.color = new Color(defaultGlobeConfig.globeColor!);
  globeMaterial.emissive = new Color(defaultGlobeConfig.emissive!);
  globeMaterial.emissiveIntensity = defaultGlobeConfig.emissiveIntensity || 0.1;
  globeMaterial.shininess = defaultGlobeConfig.shininess || 0.9;

  scene.add(globe);
}

function onWindowResize() {
  if (!githubGlobeRef.value) {
    return;
  }

  const width = githubGlobeRef.value.clientWidth;
  const height = githubGlobeRef.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}
function startAnimation() {
  if (!globe || !globeData.value!) return;
  
  // 过滤掉可能含有NaN值的数据
  const validData = props.data.filter(d => {
    const isValid = !isNaN(d.startLat) && !isNaN(d.startLng) && 
                    !isNaN(d.endLat) && !isNaN(d.endLng) && 
                    !isNaN(d.arcAlt);
    if (!isValid) {
      console.warn('Invalid city connection data:', d);
    }
    return isValid;
  });
  
  globe
    .arcsData(validData)
    .arcStartLat((d: any) => d.startLat * 1)
    .arcStartLng((d: any) => d.startLng * 1)
    .arcEndLat((d: any) => d.endLat * 1)
    .arcEndLng((d: any) => d.endLng * 1)
    .arcColor((e: any) => e.color)
    .arcAltitude((e: any) => e.arcAlt * 1)
    .arcStroke((e: any) => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
    .arcDashLength(defaultGlobeConfig.arcLength!)
    .arcDashInitialGap((e: any) => e.order * 1)
    .arcDashGap(15)
    .arcDashAnimateTime(defaultGlobeConfig.arcTime!)

    .pointsData(props.data)
    .pointColor((e: any) => e.color)
    .pointsMerge(true)
    .pointAltitude(0.0)
    .pointRadius(2)

    .ringsData([])
    .ringColor((e: any) => (t: any) => e.color(t))
    .ringMaxRadius(defaultGlobeConfig.maxRings!)
    .ringPropagationSpeed(3)
    .ringRepeatPeriod(
      (defaultGlobeConfig.arcTime! * defaultGlobeConfig.arcLength!) /
        defaultGlobeConfig.rings!
    );
}

const clock = new Clock();
const fpsLimit = 30; // 目标帧率

function animate() {
  if (!shouldRender.value) return;

  animationFrameId = requestAnimationFrame(animate);

  if (clock.getElapsedTime() < 1 / fpsLimit) return; // 未达到间隔，不渲染
  clock.start();
  
  if (globe) {
    globe.rotation.y += 0.001;
  }

  renderer.render(scene, camera);
}

function startAnimationLoop() {
  if (animationFrameId === null) {
    animate();
  }
}

function buildData() {
  const arcs = props.data;
  let points = [];
  
  // 在处理点数据前检查每个弧的有效性
  for (let i = 0; i < arcs.length; i++) {
    const arc = arcs[i];
    
    // 检查点的坐标是否有效
    if (isNaN(arc.startLat) || isNaN(arc.startLng) || 
        isNaN(arc.endLat) || isNaN(arc.endLng)) {
      console.warn('Skipping arc with invalid coordinates:', arc);
      continue;
    }
    
    try {
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: defaultGlobeConfig.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultGlobeConfig.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    } catch (error) {
      console.error('Error processing arc:', arc, error);
    }
  }

  // remove duplicates for same lat and lng
  const filteredPoints = points.filter(
    (v, i, a) =>
      a.findIndex((v2) =>
        ["lat", "lng"].every(
          (k) => !isNaN(v2[k as "lat" | "lng"]) && 
                !isNaN(v[k as "lat" | "lng"]) &&
                v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
        )
      ) === i
  );

  globeData.value = filteredPoints;
}

function hexToRgb(color: string) {
  try {
    // 确保color是有效的十六进制颜色值
    if (!color || typeof color !== 'string') {
      console.warn('Invalid color value:', color);
      return { r: 0, g: 0, b: 0 };
    }
    
    // 如果不是十六进制格式，直接返回默认值
    if (!color.startsWith('#')) {
      console.warn('Color is not hex format:', color);
      return { r: 0, g: 0, b: 0 };
    }

    let hex = color.replace(/^#/, "");

    // If the hex code is 3 characters, expand it to 6 characters
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    // 验证十六进制值的有效性
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      console.warn('Invalid hex format:', color);
      return { r: 0, g: 0, b: 0 };
    }

    // Parse the r, g, b values from the hex string
    const bigint = parseInt(hex, 16);
    if (isNaN(bigint)) {
      console.warn('Invalid hex parsing result for:', color);
      return { r: 0, g: 0, b: 0 };
    }
    
    const r = (bigint >> 16) & 255; // Extract the red component
    const g = (bigint >> 8) & 255; // Extract the green component
    const b = bigint & 255; // Extract the blue component

    return {
      r,
      g,
      b,
    };
  } catch (error) {
    console.error('Error parsing color:', color, error);
    return { r: 0, g: 0, b: 0 };
  }
}

function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
</script>
