export interface ArcInput {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  color?: string
}

const colors = [
  "#33A9FF",
  "#9A7AF9",
  "#73BB81",
  "#4574F9",
  "#F7943D",
  "#EE78ED",
  "#EBA93F",
]

const CITY_CONNECTIONS_BASE = [
  {
    order: 1,
    startLat: 39.9042, // 北京
    startLng: 116.4074,
    endLat: 35.6762, // 东京
    endLng: 139.6503,
  },
  {
    order: 2,
    startLat: 51.5074, // 伦敦
    startLng: -0.1278,
    endLat: 40.7128, // 纽约
    endLng: -74.006,
  },
  {
    order: 3,
    startLat: 22.3193, // 上海
    startLng: 114.1694,
    endLat: 1.3521, // 新加坡
    endLng: 103.8198,
  },
  // 可以添加更多城市连接
  {
    order: 4,
    startLat: 48.8566, // 巴黎
    startLng: 2.3522,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 5,
    startLat: -33.8688, // 悉尼
    startLng: 151.2093,
    endLat: -23.5505, // 圣保罗
    endLng: -46.6333,
  },
  {
    order: 6,
    startLat: 37.7749, // 旧金山
    startLng: -122.4194,
    endLat: 34.0522, // 洛杉矶
    endLng: -118.2437,
  },
  {
    order: 7,
    startLat: 19.4326, // 墨西哥城
    startLng: -99.1332,
    endLat: 4.2105, // 吉隆坡
    endLng: 101.9758,
  },
  {
    order: 8,
    startLat: 55.9533, // 爱丁堡
    startLng: -3.1883,
    endLat: 41.9028, // 罗马
    endLng: 12.4964,
  },
  {
    order: 9,
    startLat: 35.6895, // 东京
    startLng: 139.6917,
    endLat: 37.5665, // 首尔
    endLng: 126.978,
  },
  {
    order: 10,
    startLat: 52.5200, // 柏林
    startLng: 13.4050,
    endLat: 60.1695, // 赫尔辛基
    endLng: 24.9354,
  },
  {
    order: 11,
    startLat: 28.6139, // 新德里
    startLng: 77.2090,
    endLat: 30.0444, // 开罗
    endLng: 31.2357,
  },
  {
    order: 12,
    startLat: 40.4168, // 马德里
    startLng: -3.7038,
    endLat: 35.6895, // 东京
    endLng: 139.6917,
  },
  {
    order: 13,
    startLat: 34.0522, // 洛杉矶
    startLng: -118.2437,
    endLat: 51.1657, // 柏林
    endLng: 10.4515,
  },
  {
    order: 14,
    startLat: -26.2041, // 约翰内斯堡
    startLng: 28.0473,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 15,
    startLat: 41.0082, // 伊斯坦布尔
    startLng: 28.9784,
    endLat: 39.9042, // 北京
    endLng: 116.4074,
  },
  // 可以添加更多城市连接
  {
    order: 16,
    startLat: 34.0522, // 洛杉矶
    startLng: -118.2437,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 17,
    startLat: -33.9249, // 开普敦
    startLng: 18.4241,
    endLat: 35.6895, // 东京
    endLng: 139.6917,
  },
  {
    order: 18,
    startLat: 40.7128, // 纽约
    startLng: -74.0060,
    endLat: -23.5505, // 圣保罗
    endLng: -46.6333,
  },
  {
    order: 19,
    startLat: 51.5074, // 伦敦
    startLng: -0.1278,
    endLat: 35.6762, // 东京
    endLng: 139.6503,
  },
  {
    order: 20,
    startLat: 37.7749, // 旧金山
    startLng: -122.4194,
    endLat: 1.3521, // 新加坡
    endLng: 103.8198,
  },
  {
    order: 21,
    startLat: 43.651070, // 多伦多
    startLng: -79.347015,
    endLat: 48.8566, // 巴黎
    endLng: 2.3522,
  },
  {
    order: 22,
    startLat: 55.7558, // 莫斯科
    startLng: 37.6173,
    endLat: 35.6895, // 东京
    endLng: 139.6917,
  },
  {
    order: 23,
    startLat: 13.7563, // 曼谷
    startLng: 100.5018,
    endLat: 28.6139, // 新德里
    endLng: 77.2090,
  },
  {
    order: 24,
    startLat: 31.2304, // 上海
    startLng: 121.4737,
    endLat: 37.7749, // 旧金山
    endLng: -122.4194,
  },
  {
    order: 25,
    startLat: 35.6895, // 东京
    startLng: 139.6917,
    endLat: -33.8688, // 悉尼
    endLng: 151.2093,
  },
  {
    order: 26,
    startLat: 40.7128, // 纽约
    startLng: -74.0060,
    endLat: 48.8566, // 巴黎
    endLng: 2.3522,
  },
  {
    order: 27,
    startLat: 35.6762, // 东京
    startLng: 139.6503,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 28,
    startLat: 19.0760, // 孟买
    startLng: 72.8777,
    endLat: 51.5074, // 伦敦
    endLng: -0.1278,
  },
  {
    order: 29,
    startLat: -34.6037, // 布宜诺斯艾利斯
    startLng: -58.3816,
    endLat: 40.4168, // 马德里
    endLng: -3.7038,
  },
  {
    order: 30,
    startLat: 37.5665, // 首尔
    startLng: 126.9780,
    endLat: 1.3521, // 新加坡
    endLng: 103.8198,
  },
  {
    order: 31,
    startLat: 25.276987, // 迪拜
    startLng: 55.296249,
    endLat: 35.6895, // 东京
    endLng: 139.6917,
  },
  {
    order: 32,
    startLat: 41.3851, // 巴塞罗那
    startLng: 2.1734,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 33,
    startLat: 39.9042, // 北京
    startLng: 116.4074,
    endLat: 34.0522, // 洛杉矶
    endLng: -118.2437,
  },
  {
    order: 34,
    startLat: 48.8566, // 巴黎
    startLng: 2.3522,
    endLat: 35.6762, // 东京
    endLng: 139.6503,
  },
  {
    order: 35,
    startLat: 55.9533, // 爱丁堡
    startLng: -3.1883,
    endLat: 40.7128, // 纽约
    endLng: -74.0060,
  },
  {
    order: 36,
    startLat: 60.1695, // 赫尔辛基
    startLng: 24.9354,
    endLat: 28.6139, // 新德里
    endLng: 77.2090,
  },
  {
    order: 37,
    startLat: 1.3521, // 新加坡
    startLng: 103.8198,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 38,
    startLat: 40.4168, // 马德里
    startLng: -3.7038,
    endLat: 19.0760, // 孟买
    endLng: 72.8777,
  },
  {
    order: 39,
    startLat: 34.0522, // 洛杉矶
    startLng: -118.2437,
    endLat: 25.276987, // 迪拜
    endLng: 55.296249,
  },
  {
    order: 40,
    startLat: 51.1657, // 柏林
    startLng: 10.4515,
    endLat: 13.7563, // 曼谷
    endLng: 100.5018,
  },
  {
    order: 41,
    startLat: 33.8688, // 悉尼
    startLng: 151.2093,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 42,
    startLat: 19.4326, // 墨西哥城
    startLng: -99.1332,
    endLat: 51.5074, // 伦敦
    endLng: -0.1278,
  },
  {
    order: 43,
    startLat: 35.6895, // 东京
    startLng: 139.6917,
    endLat: 40.7128, // 纽约
    endLng: -74.0060,
  },
  {
    order: 44,
    startLat: 37.7749, // 旧金山
    startLng: -122.4194,
    endLat: 48.8566, // 巴黎
    endLng: 2.3522,
  },
  {
    order: 45,
    startLat: 28.6139, // 新德里
    startLng: 77.2090,
    endLat: 34.0522, // 洛杉矶
    endLng: -118.2437,
  },
  {
    order: 46,
    startLat: 55.7558, // 莫斯科
    startLng: 37.6173,
    endLat: 35.6895, // 东京
    endLng: 139.6917,
  },
  {
    order: 47,
    startLat: 13.7563, // 曼谷
    startLng: 100.5018,
    endLat: 28.6139, // 新德里
    endLng: 77.2090,
  },
  {
    order: 48,
    startLat: 31.2304, // 上海
    startLng: 121.4737,
    endLat: 37.7749, // 旧金山
    endLng: -122.4194,
  },
  {
    order: 49,
    startLat: 35.6895, // 东京
    startLng: 139.6917,
    endLat: -33.8688, // 悉尼
    endLng: 151.2093,
  },
  {
    order: 50,
    startLat: 40.7128, // 纽约
    startLng: -74.0060,
    endLat: 48.8566, // 巴黎
    endLng: 2.3522,
  },
  {
    order: 51,
    startLat: 41.9028, // 罗马
    startLng: 12.4964,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 52,
    startLat: 35.6762, // 东京
    startLng: 139.6503,
    endLat: 1.3521, // 新加坡
    endLng: 103.8198,
  },
  {
    order: 53,
    startLat: 40.4168, // 马德里
    startLng: -3.7038,
    endLat: 34.0522, // 洛杉矶
    endLng: -118.2437,
  },
  {
    order: 54,
    startLat: 48.8566, // 巴黎
    startLng: 2.3522,
    endLat: 19.0760, // 孟买
    endLng: 72.8777,
  },
  {
    order: 55,
    startLat: 51.5074, // 伦敦
    startLng: -0.1278,
    endLat: 28.6139, // 新德里
    endLng: 77.2090,
  },
  {
    order: 56,
    startLat: 37.7749, // 旧金山
    startLng: -122.4194,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 57,
    startLat: 19.4326, // 墨西哥城
    startLng: -99.1332,
    endLat: 35.6895, // 东京
    endLng: 139.6917,
  },
  {
    order: 58,
    startLat: 34.0522, // 洛杉矶
    startLng: -118.2437,
    endLat: 51.5074, // 伦敦
    endLng: -0.1278,
  },
  {
    order: 59,
    startLat: 55.9533, // 爱丁堡
    startLng: -3.1883,
    endLat: 48.8566, // 巴黎
    endLng: 2.3522,
  },
  {
    order: 60,
    startLat: 13.7563, // 曼谷
    startLng: 100.5018,
    endLat: 40.7128, // 纽约
    endLng: -74.0060,
  },
  {
    order: 61,
    startLat: 31.2304, // 上海
    startLng: 121.4737,
    endLat: 19.0760, // 孟买
    endLng: 72.8777,
  },
  {
    order: 62,
    startLat: 41.3851, // 巴塞罗那
    startLng: 2.1734,
    endLat: 37.7749, // 旧金山
    endLng: -122.4194,
  },
  {
    order: 63,
    startLat: 25.276987, // 迪拜
    startLng: 55.296249,
    endLat: 40.4168, // 马德里
    endLng: -3.7038,
  },
  {
    order: 64,
    startLat: 60.1695, // 赫尔辛基
    startLng: 24.9354,
    endLat: 34.0522, // 洛杉矶
    endLng: -118.2437,
  },
  {
    order: 65,
    startLat: 1.3521, // 新加坡
    startLng: 103.8198,
    endLat: 51.1657, // 柏林
    endLng: 10.4515,
  },
  {
    order: 66,
    startLat: 55.7558, // 莫斯科
    startLng: 37.6173,
    endLat: 13.7563, // 曼谷
    endLng: 100.5018,
  },
  {
    order: 67,
    startLat: 40.7128, // 纽约
    startLng: -74.0060,
    endLat: 31.2304, // 上海
    endLng: 121.4737,
  },
  {
    order: 68,
    startLat: 35.6895, // 东京
    startLng: 139.6917,
    endLat: 41.9028, // 罗马
    endLng: 12.4964,
  },
  {
    order: 69,
    startLat: 48.8566, // 巴黎
    startLng: 2.3522,
    endLat: 37.5665, // 首尔
    endLng: 126.9780,
  },
  {
    order: 70,
    startLat: 51.5074, // 伦敦
    startLng: -0.1278,
    endLat: 19.4326, // 墨西哥城
    endLng: -99.1332,
  },
  {
    order: 71,
    startLat: 37.7749, // 旧金山
    startLng: -122.4194,
    endLat: 13.7563, // 曼谷
    endLng: 100.5018,
  },
  {
    order: 72,
    startLat: 19.0760, // 孟买
    startLng: 72.8777,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 73,
    startLat: 34.0522, // 洛杉矶
    startLng: -118.2437,
    endLat: 41.3851, // 巴塞罗那
    endLng: 2.1734,
  },
  {
    order: 74,
    startLat: 28.6139, // 新德里
    startLng: 77.2090,
    endLat: 40.4168, // 马德里
    endLng: -3.7038,
  },
  {
    order: 75,
    startLat: 55.9533, // 爱丁堡
    startLng: -3.1883,
    endLat: 25.276987, // 迪拜
    endLng: 55.296249,
  },
  {
    order: 76,
    startLat: 60.1695, // 赫尔辛基
    startLng: 24.9354,
    endLat: 35.6762, // 东京
    endLng: 139.6503,
  },
  {
    order: 77,
    startLat: 1.3521, // 新加坡
    startLng: 103.8198,
    endLat: 40.7128, // 纽约
    endLng: -74.0060,
  },
  {
    order: 78,
    startLat: 41.9028, // 罗马
    startLng: 12.4964,
    endLat: 34.0522, // 洛杉矶
    endLng: -118.2437,
  },
  {
    order: 79,
    startLat: 48.8566, // 巴黎
    startLng: 2.3522,
    endLat: 31.2304, // 上海
    endLng: 121.4737,
  },
  {
    order: 80,
    startLat: 51.5074, // 伦敦
    startLng: -0.1278,
    endLat: 37.7749, // 旧金山
    endLng: -122.4194,
  },
  {
    order: 81,
    startLat: -1.2921, // 内罗毕
    startLng: 36.8219,
    endLat: 48.8566, // 巴黎
    endLng: 2.3522,
  },
  {
    order: 82,
    startLat: -26.2041, // 约翰内斯堡
    startLng: 28.0473,
    endLat: 51.5074, // 伦敦
    endLng: -0.1278,
  },
  {
    order: 83,
    startLat: 30.0444, // 开罗
    startLng: 31.2357,
    endLat: 41.9028, // 罗马
    endLng: 12.4964,
  },
  {
    order: 84,
    startLat: 6.5244, // 拉各斯
    startLng: 3.3792,
    endLat: 40.4168, // 马德里
    endLng: -3.7038,
  },
  {
    order: 85,
    startLat: 33.5731, // 卡萨布兰卡
    startLng: -7.5898,
    endLat: 48.8566, // 巴黎
    endLng: 2.3522,
  },
  {
    order: 86,
    startLat: 9.0578, // 阿布贾
    startLng: 7.4951,
    endLat: 55.7558, // 莫斯科
    endLng: 37.6173,
  },
  {
    order: 87,
    startLat: -29.8587, // 德班
    startLng: 31.0218,
    endLat: 50.8503, // 布鲁塞尔
    endLng: 4.3517,
  },
  {
    order: 88,
    startLat: 15.5007, // 亚的斯亚贝巴
    startLng: 32.5599,
    endLat: 52.5200, // 柏林
    endLng: 13.4050,
  },
  {
    order: 89,
    startLat: -34.9285, // 开普敦
    startLng: 18.4241,
    endLat: 59.3293, // 斯德哥尔摩
    endLng: 18.0686,
  },
  {
    order: 90,
    startLat: 5.6037, // 阿克拉
    startLng: -0.1870,
    endLat: 60.1695, // 赫尔辛基
    endLng: 24.9354,
  },
  {
    order: 91,
    startLat: 40.7128, // 纽约
    startLng: -74.0060,
    endLat: 39.9042, // 北京
    endLng: 116.4074,
  },
  {
    order: 92,
    startLat: 34.0522, // 洛杉矶
    startLng: -118.2437,
    endLat: 31.2304, // 上海
    endLng: 121.4737,
  },
  {
    order: 93,
    startLat: 41.8781, // 芝加哥
    startLng: -87.6298,
    endLat: 22.3964, // 香港
    endLng: 114.1095,
  },
  {
    order: 94,
    startLat: 29.7604, // 休斯顿
    startLng: -95.3698,
    endLat: 23.1291, // 广州
    endLng: 113.2644,
  },
  {
    order: 95,
    startLat: 37.7749, // 旧金山
    startLng: -122.4194,
    endLat: 30.5728, // 成都
    endLng: 104.0668,
  },
  {
    order: 96,
    startLat: 25.7617, // 迈阿密
    startLng: -80.1918,
    endLat: 36.0671, // 青岛
    endLng: 120.3826,
  },
  {
    order: 97,
    startLat: 39.7392, // 丹佛
    startLng: -104.9903,
    endLat: 34.3416, // 西安
    endLng: 108.9398,
  },
  {
    order: 98,
    startLat: 47.6062, // 西雅图
    startLng: -122.3321,
    endLat: 32.0603, // 南京
    endLng: 118.7969,
  },
  {
    order: 99,
    startLat: 33.4484, // 菲尼克斯
    startLng: -112.0740,
    endLat: 29.5630, // 武汉
    endLng: 106.5516,
  },
  {
    order: 100,
    startLat: 32.7767, // 达拉斯
    startLng: -96.7970,
    endLat: 26.0722, // 厦门
    endLng: 119.2965,
  },
]

export function rangRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let cityConnectionsCache: ArcInput[] | null = null

export function getCityConnections(): ArcInput[] {
  if (cityConnectionsCache)
    return cityConnectionsCache
  cityConnectionsCache = CITY_CONNECTIONS_BASE.map(item => ({
    ...item,
    color: colors[rangRandom(0, colors.length - 1)],
  }))
  return cityConnectionsCache
}
