<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 纬度，支持 number 或 API 返回的 string */
    latitude?: number | string | null
    /** 经度，支持 number 或 API 返回的 string */
    longitude?: number | string | null
    /** 国家代码，如 CN、US，用于判断是否使用高德地图（中国） */
    countryCode?: string | null
    /** 地图容器高度，默认 373px */
    height?: string
  }>(),
  { height: '373px' },
)

/** IP 地理位置地图展示：首次有坐标时若为中国则整页用高德，否则整页用 Leaflet，后续搜索 IP 不切换地图类型 */

const config = useRuntimeConfig()
const AMAP_KEY = (config.public.amapKey as string) || 'd17c6ed16e98e5237cc1b36ae4252e77'
const AMAP_SECURITY_CODE = config.public.amapSecurityCode as string | undefined

const mapContainerRef = ref<HTMLElement | null>(null)
const mapError = ref<string | null>(null)
const isLoading = ref(true)

/** 是否使用高德：仅首次有坐标时根据当时国家决定，之后整页会话不再切换地图类型 */
const useAmapLocked = ref<boolean | null>(null)

/** 当前是否用高德（已锁定时用锁定值，否则按当前国家） */
const useAmap = computed(() => {
  if (useAmapLocked.value !== null)
    return useAmapLocked.value
  return (props.countryCode ?? '').toUpperCase() === 'CN'
})

/** 地图实例：Leaflet 为 Map，高德为 AMap.Map，统一用 remove/destroy 清理 */
let mapInstance: { remove?: () => void, destroy?: () => void } | null = null

const coords = computed(() => {
  const lat = Number(props.latitude)
  const lng = Number(props.longitude)
  if (Number.isNaN(lat) || Number.isNaN(lng))
    return null
  return { lat, lng }
})

const hasValidCoords = computed(() => coords.value != null)

function destroyMap() {
  if (!mapInstance)
    return
  if ('remove' in mapInstance && typeof mapInstance.remove === 'function')
    mapInstance.remove()
  else if ('destroy' in mapInstance && typeof mapInstance.destroy === 'function')
    mapInstance.destroy()
  mapInstance = null
}

/** 使用 @amap/amap-jsapi-loader 加载高德 JS API 2.0，返回 AMap */
async function loadAmap(): Promise<any> {
  if (typeof window !== 'undefined' && AMAP_SECURITY_CODE) {
    (window as any)._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }
  }
  const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
  return AMapLoader.load({
    key: AMAP_KEY,
    version: '2.0',
    plugins: [],
  })
}

async function initMap() {
  if (!hasValidCoords.value) {
    isLoading.value = false
    return
  }

  const coord = coords.value
  if (!coord || !mapContainerRef.value)
    return

  const { lat, lng } = coord
  mapError.value = null

  try {
    destroyMap()

    const container = mapContainerRef.value
    if (!container)
      return

    // 首次有坐标时锁定地图类型，后续搜索 IP 不再切换高德/Leaflet
    if (useAmapLocked.value === null)
      useAmapLocked.value = (props.countryCode ?? '').toUpperCase() === 'CN'

    if (useAmap.value) {
      const AMap = await loadAmap()
      const map = new AMap.Map(container, {
        center: [lng, lat],
        zoom: 10,
        viewMode: '2D',
      })
      const marker = new AMap.Marker({ position: [lng, lat], title: 'IP 位置' })
      map.add(marker)
      mapInstance = map
    }
    else {
      const [L] = await Promise.all([
        import('leaflet').then(m => m.default),
        import('leaflet/dist/leaflet.css'),
      ])
      // 使用 DivIcon 纯 CSS 圆点标记，不依赖任何图片，避免打包或 CDN 导致不显示
      const markerIcon = L.divIcon({
        className: 'ip-location-leaflet-marker',
        html: '<span class="ip-location-pin"></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
      const map = L.map(container, {
        center: [lat, lng],
        zoom: 10,
        zoomControl: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)
      L.marker([lat, lng], { icon: markerIcon, title: 'IP 位置' }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      mapInstance = map
      await nextTick()
      map.invalidateSize()
    }
  }
  catch (e) {
    mapError.value = e instanceof Error ? e.message : '地图加载失败'
  }
  finally {
    isLoading.value = false
  }
}

watch(coords, () => {
  initMap()
})

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  destroyMap()
})
</script>

<template>
  <div class="rounded-4 bg-[#1a1a2e] h-full w-full relative overflow-hidden">
    <template v-if="!hasValidCoords">
      <div class="text-[#7D8387] flex h-full w-full items-center justify-center">
        {{ $t('暂无位置信息') }}
      </div>
    </template>
    <template v-else-if="mapError">
      <div class="text-[#7D8387] flex flex-col gap-2 h-full w-full items-center justify-center">
        <p>{{ mapError }}</p>
      </div>
    </template>
    <template v-else>
      <div ref="mapContainerRef" class="ip-location-map-container h-full min-h-0 w-full" />
      <div
        v-if="isLoading"
        class="bg-[#1a1a2e]/80 flex items-center inset-0 justify-center absolute"
      >
        <span class="text-[#7D8387]">{{ $t('地图加载中...') }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ip-location-map-container :deep(.ip-location-pin) {
  display: block;
  width: 20px;
  height: 20px;
  background: #e74c3c;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}
</style>
