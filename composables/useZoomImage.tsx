import { createApp, ref  } from "vue";
import ZoomImage from "~/components/zoom-image.vue";

export function useZoomImage(selector: string) {
  const images = document.querySelectorAll<HTMLImageElement>(selector)
  images.forEach(image => {
    image.addEventListener('click', () => showImageViewer(image))
  })

  function showImageViewer(image: HTMLImageElement) {
    const div = document.createElement('div')
    const zoomImageRef = ref<InstanceType<typeof ZoomImage> | null>(null)

    const props = {
      src: image.src,
      alt: image.alt,
      class: 'zoom-image',
      hideThumbnail: true,
      onClose: () => {
        console.log('onClose')
        app.unmount()
        div.remove()
      }
    }

    const app = createApp(() => h(ZoomImage, {
      ...props,
      ref: zoomImageRef
    }))

  
    document.body.appendChild(div)
    app.mount(div)
    zoomImageRef.value?.open(image)
  }

}