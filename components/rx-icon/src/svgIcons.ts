export const svgIcons = import.meta.glob<Component>('../../../assets/svgs/**/*.svg', {
  query: '?component',
  eager: false,
})

// import "../../../assets/svgs"