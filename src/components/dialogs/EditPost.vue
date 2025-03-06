<script lang="ts" setup>
  import { computed } from "vue"

  const { id } = defineProps<{ id?: number }>()
  const emits = defineEmits<{ close: [] }>()

  const isNew = computed(() => id === undefined)
</script>

<template>
  <v-dialog :width="800" persistent>
    <v-card>
      <v-card-item>
        <v-card-title>{{ isNew ? "Create" : "Edit" }} Post</v-card-title>
        <v-card-subtitle>Sub Title</v-card-subtitle>
        <v-card-actions>
          <v-btn @click="emits('close')">Dismiss</v-btn>
          <v-btn @click="emits('close')">Close</v-btn>
        </v-card-actions>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
