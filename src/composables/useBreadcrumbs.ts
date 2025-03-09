import { ref } from "vue"

interface BreadcrumbItem {
  title: string
  href?: string
  disabled?: boolean
}

const breadcrumbs = ref<BreadcrumbItem[]>([])

export const useBreadcrumbs = () => breadcrumbs
