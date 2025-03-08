<script lang="ts" setup>
  import { useData } from "@/composables"
  import type { EditAuthorForm } from "@/types/form"
  import { computed, ref } from "vue"

  const { id } = defineProps<{ id?: number }>()
  const emits = defineEmits<{ close: [boolean?] }>()

  const data = useData()

  const form = ref<EditAuthorForm>({
    firstName: "",
    lastName: "",
  })

  const isNew = computed(() => id === undefined)

  const onSave = async (form: EditAuthorForm) => {
    await data.create("authors", { ...form })
    emits("close", true)
  }
</script>

<template>
  <v-dialog :width="400" persistent>
    <v-card>
      <v-card-item>
        <v-card-title>{{ isNew ? "Create" : "Edit" }} Author</v-card-title>
        <v-card-subtitle>Sub Title</v-card-subtitle>
        <v-form class="d-flex ga-4 flex-column">
          <v-text-field v-model="form.firstName" label="First Name" />
          <v-text-field v-model="form.lastName" label="Last Name" />
        </v-form>
        <v-divider />
        <v-card-actions class="justify-end">
          <v-btn @click="emits('close')" variant="text">Cancel</v-btn>
          <v-btn @click="onSave(form)" variant="flat" color="primary">{{ isNew ? "Add" : "Save" }}</v-btn>
        </v-card-actions>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
