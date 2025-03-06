<script lang="ts" setup>
  import { computed, ref } from "vue"

  const {
    size = "sm",
    confirmLabel = "Yes",
    dismissLabel = "No",
    color = "info",
    ...props
  } = defineProps<{
    size?: "sm" | "md" | "lg"
    color?: "info" | "success" | "warning" | "error"
    title?: string
    message?: string
    confirmLabel?: string
    dismissLabel?: string
    onConfirm?: (() => void) | (() => Promise<void>)
    onDismiss?: () => void
  }>()

  const emits = defineEmits<{ close: [] }>()

  const width = computed(() => {
    switch (size) {
      case "md":
        return 600
      case "lg":
        return 800
      case "sm":
      default:
        return 400
    }
  })

  const copmutedColor = computed(() => {
    switch (color) {
      case "info":
        return "blue"
      case "success":
        return "green"
      case "warning":
        return "yellow"
      case "error":
        return "red"
      default:
        return "blue"
    }
  })

  const isConfirming = ref(false)

  const confirm = async () => {
    try {
      isConfirming.value = true
      await Promise.resolve(props.onConfirm?.())
      emits("close")
    } catch (_err) {
      isConfirming.value = false
    }
  }
</script>

<template>
  <v-dialog :width="width" variant="elevated" persistent>
    <v-card :color="copmutedColor">
      <v-card-item>
        <v-card-title class="d-flex align-center ga-2"> {{ props.title }} </v-card-title>
        <v-card-subtitle>{{ props.message }}</v-card-subtitle>
        <v-card-actions class="justify-end">
          <v-btn @click="onDismiss" :text="dismissLabel" />
          <v-btn @click="confirm" :text="confirmLabel" :loading="isConfirming" />
        </v-card-actions>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
