// import Scrollbar from 'smooth-scrollbar'
// import { scrollYProgress, scrollbarOffsetY } from '@/store'

// const scrollbarRef = ref<Scrollbar | null>(null)
// export const useScrollbar = () => {
//   const change = (e) => {
//     scrollYProgress.value = e.offset.y / e.limit.y
//     scrollbarOffsetY.value = e.offset.y
//   }

//   const init = (el: string) => {
//     if (scrollbarRef.value) scrollbarRef.value.destroy();
//     const container = document.getElementById(el) as HTMLElement

//     container.style.height = '100vh'

//     scrollbarRef.value = Scrollbar.init(container);
//     scrollbarRef.value!.addListener(change)
//   }
  
//   const destroy = () => {
//     scrollbarRef.value!.removeListener(change)
//     scrollbarRef.value!.destroy()
//     scrollbarRef.value = null;
//   }

//   return {
//     scrollbarRef,
//     init,
//     destroy
//   }
// }