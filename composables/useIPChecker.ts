import { computed, onMounted, ref } from 'vue'
import { getCurrentIP, searchIP } from '~/utils/ipService'
import { isValidIP } from '../utils/ipValidation.js'
import { scrollToTop } from '../utils/scrollUtils.js'

/**
 * IP查询相关的状态管理和业务逻辑
 */
export function useIPChecker() {
  const { $t, locale } = useRxI18n()
  
  // 响应式状态
  const queryStatus = ref('idle') // 'idle' | 'loading' | 'result' | 'error'
  const ipResult = ref({
    ip: '',
    city: '',
    region: '',
    country: '',
    country_code: '',
    latitude: '',
    longitude: '',
    organization: '',
    asn: '',
    continent: '',
    continent_code: '',
    postal: '-',
    timezone: '',
    metro_code: '',
    network: '',
  })
  const errorMessage = ref('')
  const ipInput = ref('')

  // HyperText 动画状态计算 - 将 error 状态映射为 idle
  const animationStatus = computed(() => {
    return queryStatus.value === 'error' ? 'idle' : queryStatus.value
  })

  // 计算属性：是否正在加载
  const isLoading = computed(() => queryStatus.value === 'loading')

  // 计算属性：是否有查询结果
  const hasResult = computed(() => queryStatus.value === 'result')

  // 计算属性：是否有错误
  const hasError = computed(() => queryStatus.value === 'error')

  /**
   * 手动IP查询
   * @param {string} ip - 要查询的IP地址
   */
  const handleSearch = async (ip) => {
    const inputValue = ip?.trim()
    if (!inputValue || !isValidIP(inputValue)) {
      alert($t('请输入有效的IP地址'))
      return
    }

    queryStatus.value = 'loading'
    errorMessage.value = ''

    try {
      const result = await searchIP(inputValue)
      ipResult.value = result
      queryStatus.value = 'result'

      // 在手机端搜索完成后自动平滑滚动到顶部
      scrollToTop(100)
    }
    catch (error) {
      console.error('IP查询失败:', error)
      errorMessage.value = error.message || $t('网络请求失败，请检查网络连接')
      queryStatus.value = 'error'
    }
  }

  /**
   * 初始化函数 - 获取本地IP数据
   */
  const initializeLocalIP = async () => {
    queryStatus.value = 'loading'

    try {
      const result = await getCurrentIP()
      ipResult.value = result
      queryStatus.value = 'result'
    }
    catch (error) {
      console.error('获取本地IP数据失败:', error)
      // 初始化失败时保持空状态，不显示错误信息
      queryStatus.value = 'idle'
    }
  }

  /**
   * 重置状态
   */
  const resetStatus = () => {
    queryStatus.value = 'idle'
    errorMessage.value = ''
    ipInput.value = ''
  }

  /**
   * 更新IP输入值
   * @param {string} value - 新的IP输入值
   */
  const updateIpInput = (value) => {
    ipInput.value = value
  }

  // 页面挂载时初始化
  onMounted(() => {
    initializeLocalIP()
  })

  return {
    // 状态
    queryStatus,
    ipResult,
    errorMessage,
    ipInput,

    // 计算属性
    animationStatus,
    isLoading,
    hasResult,
    hasError,

    // 方法
    handleSearch,
    initializeLocalIP,
    resetStatus,
    updateIpInput,
  }
}
