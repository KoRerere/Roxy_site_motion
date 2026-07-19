export const avif = import.meta.glob('../../assets/images/**/*.png', {
  query: '?format=avif',
  eager: false,
})

export const webp = import.meta.glob('../../assets/images/**/*.png', {
  query: '?format=webp',
  eager: false,
})

export const png = import.meta.glob('../../assets/images/**/*.png', {
  eager: false,
})

// export const modules = import.meta.glob('../../assets/images/**/*.png', {
//   query: '?w=original&format=avif;webp&as=picture',
//   eager: true
// })

// w=640;768;1024;1280;original
// export const lazyModules = import.meta.glob('../../assets/images/**/*.png', {
//   query: '?format=avif;webp&as=src',
//   eager: true
// })

// type Image = {
//   default: any,
//   img: { w: number, h: number, src: string },
//   sources: { webp: string, avif: string }
// }

// export const Images = Object.entries(modules).reduce((acc, [key, value]) => {
//   acc[key] = value as Image;
//   return acc
// }, {} as Record<string, Image>)

// console.log('modules', modules)
