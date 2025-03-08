<script langs="ts" setup>
  import { useSnackbar } from "@/composables/ui"
  import { computed } from "vue"

  const { instance } = useSnackbar()

  const color = computed(() => {
    switch (instance.value.options.type) {
      case "success":
        return "green"
      case "error":
        return "red"
      case "warning":
        return "orange-darken-4"
      case "info":
        return "blue"
      default:
        return "gray-darken-1"
    }
  })
</script>

<template>
  <div>
    <v-snackbar
      :text="instance.options.message"
      v-model="instance.modelValue"
      :timeout="instance.timeout"
      location="right bottom"
      :color="color" />
  </div>
</template>
