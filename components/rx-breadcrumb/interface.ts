export interface RxBreadcrumbProps {
  items: {
    title?: string
    path?: string
    disabled?: boolean
    type?: 'separator',
    separator?: string
  }[]
}