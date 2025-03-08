import { ref } from "vue"

interface SnackbarOptions {
  message: string
  duration?: number
  type?: "success" | "error" | "warning" | "info"
}

interface SnackbarInstance {
  modelValue: boolean
  options: SnackbarOptions
}

// Default options
const defaultOptions: SnackbarOptions = {
  message: "",
  duration: 5000,
  type: "info",
}

const instance = ref<SnackbarInstance>({ modelValue: false, options: defaultOptions })

export const useSnackbar = () => {
  const show = (options: SnackbarOptions) => {
    // Merge options
    const mergedOptions = { ...defaultOptions, ...options }

    instance.value = {
      ...instance.value,
      options: mergedOptions,
      modelValue: true,
    }
  }

  return { show, instance }
}
