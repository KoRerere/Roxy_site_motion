/**
 * 平滑滚动到页面顶部
 * @param {number} delay - 滚动前的延迟时间（毫秒）
 */
export function scrollToTop(delay = 100) {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, delay)
}

/**
 * 平滑滚动到指定位置
 * @param {number} top - 滚动到的位置（像素）
 * @param {number} delay - 滚动前的延迟时间（毫秒）
 */
export function scrollTo(top, delay = 0) {
  setTimeout(() => {
    window.scrollTo({
      top,
      behavior: 'smooth',
    })
  }, delay)
}

/**
 * 平滑滚动到指定元素
 * @param {string|Element} element - 元素选择器或元素本身
 * @param {number} delay - 滚动前的延迟时间（毫秒）
 */
export function scrollToElement(element, delay = 0) {
  setTimeout(() => {
    const targetElement = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, delay)
}
