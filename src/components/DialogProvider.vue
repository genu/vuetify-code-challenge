<script lang="ts" setup>
  import { useOverlay } from "@/composables/ui"
  import { computed } from "vue"

  const { overlays, close, unMount } = useOverlay()

  const mountedOverlays = computed(() => overlays.filter((overlay) => overlay.isMounted))

  const onAfterLeave = (id: symbol) => {
    close(id)
    unMount(id)
  }

  const onClose = (id: symbol, value: unknown) => {
    close(id, value)
  }
</script>

<template>
  <component
    @after-leave="onAfterLeave(overlay.id)"
    @close="onClose(overlay.id, $event)"
    :model-value="overlay.modelValue"
    v-for="overlay in mountedOverlays"
    :key="overlay.id"
    :is="overlay.component"
    v-bind="overlay.props" />
</template>
