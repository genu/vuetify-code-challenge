<script lang="ts" setup>
  import { useData } from "@/composables"
  import { useOverlay, useSnackbar } from "@/composables/ui"
  import { computed, ref } from "vue"
  import { VDateInput } from "vuetify/labs/VDateInput"
  import EditAuthorDialog from "@/components/dialogs/EditAuthor.vue"
  import type { EditPostForm } from "@/types/form"

  const { id } = defineProps<{ id?: number }>()
  const emits = defineEmits<{ close: [boolean?] }>()
  const data = useData()
  const overlay = useOverlay()
  const snackbar = useSnackbar()

  const editAuthorDialog = overlay.create(EditAuthorDialog)

  const { data: authors, refetch: refetchAuthors } = data.all("authors")
  const { setPaused, refetch } = data.one("posts", id, { paused: true })

  // Default data
  const form = ref<EditPostForm>({
    authorId: -1,
    content: "",
    title: "",
    postedAt: new Date(),
  })

  // If we're editing a post, fetch the data and populate the form
  if (id) {
    setPaused(false)
    refetch().then((data) => {
      if (!data) return

      form.value = {
        authorId: data.authorId!,
        content: data.content!,
        title: data.title!,
        postedAt: new Date(data.postedAt!),
      }
    })
  }

  const isNew = computed(() => id === undefined)
  const availableAuthors = computed(() => {
    const items = [{ title: "No Author", value: -1 }]

    if (authors.value) {
      items.push(
        ...authors.value.map((author) => ({
          title: `${author.firstName} ${author.lastName}`,
          value: author.id,
        })),
      )
    }
    return items
  })

  const onAddAuthor = async () => {
    const createdAuthor = await editAuthorDialog.open()

    if (createdAuthor) {
      snackbar.show({ message: "Author created successfully", type: "success" })

      // Update the form with the new author
      form.value = {
        ...form.value,
        authorId: Number(createdAuthor),
      }
      await refetchAuthors()
    }
  }

  const onDismiss = () => {
    emits("close")
  }

  const onSave = async (form: EditPostForm) => {
    if (isNew.value) {
      await data.create("posts", { ...form })
    } else {
      await data.update("posts", { ...form, id })
    }

    emits("close", true)
  }
</script>

<template>
  <v-dialog :width="900" persistent>
    <v-form>
      <v-card>
        <v-card-item>
          <v-card-title>{{ isNew ? "Create" : "Edit" }} Post</v-card-title>
          <v-card-subtitle>Enter post details</v-card-subtitle>
          <div class="d-flex ga-4">
            <div class="flex-1-1">
              <v-text-field v-model="form.title" label="Title" />
              <v-textarea v-model="form.content" label="Content" />
            </div>
            <v-divider vertical />
            <div class="w-33">
              <v-date-input v-model="form.postedAt" label="Post Date" />
              <v-select v-model="form.authorId" :items="availableAuthors" prepend-icon="mdi-account" label="Author" />
              <div class="d-flex justify-end">
                <v-btn variant="text" text="New Author" @click="onAddAuthor" />
              </div>
            </div>
          </div>
          <v-divider />
          <v-card-actions class="justify-end">
            <v-btn @click="onDismiss" variant="text">Close</v-btn>
            <v-btn @click="onSave(form)" variant="flat" color="primary">{{ isNew ? "Create" : "Save" }}</v-btn>
          </v-card-actions>
        </v-card-item>
      </v-card>
    </v-form>
  </v-dialog>
</template>
