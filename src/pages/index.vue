<script lang="ts" setup>
  import { useData } from "@/composables"
  import { useDialog, useOverlay } from "@/composables/ui"
  import EditPostDialog from "@/components/dialogs/EditPost.vue"
  import { computed } from "vue"

  const { all, remove } = useData()
  const { create: createOverlay } = useOverlay()
  const { confirm } = useDialog()

  const { data: posts, refetch } = all("posts")
  const { data: authors } = all("authors")

  const editPostDialog = createOverlay(EditPostDialog)

  /**
   * Combine posts with authors usnig 'authorId'. If author is not found, display 'No Author'
   *
   * Normally, this expantion would be done in the backend, but for the sake of this example, we are doing it here.
   */

  const postsWithAuthors = computed(() => {
    if (!posts.value || !authors.value) return []

    return posts.value.map((post) => {
      const author = authors.value.find((author) => author.id === post.authorId)

      return { ...post, author: author ? `${author.firstName} ${author.lastName}` : "No Author" }
    })
  })

  const onCreate = async () => {
    const createdPost = await editPostDialog.open()

    if (createdPost) await refetch()
  }

  const onDelete = async (id: number) => {
    confirm({ title: "Are you sure you want to delete this post?", size: "md", color: "error" })
      .onConfirm(async () => {
        await remove("posts", id)
        await refetch()
      })
      .open()
  }

  const onEdit = async (id: number) => {
    const editedPost = await editPostDialog.open({ id })

    if (editedPost) await refetch()
  }
</script>

<template>
  <v-container fluid>
    <div class="d-flex justify-space-between py-3">
      <h6 class="text-h6">Latest Posts</h6>
      <v-btn @click="onCreate" prepend-icon="mdi-plus" variant="text" text="New Post" />
    </div>
    <v-divider />

    <v-container class="px-0 py-5" fluid v-for="post in postsWithAuthors" :key="post.id">
      <p class="font-weight-medium text-primary">{{ post.author }}</p>
      <div class="d-flex justify-space-between align-center">
        <p class="mt-2 text-h5 font-weight-bold text-sm-h4">{{ post.title }}</p>
        <div class="d-flex ga-2 px-2">
          <v-btn
            @click="onEdit(post.id!)"
            v-tooltip="{ text: 'Edit', location: 'top' }"
            size="x-small"
            icon="mdi-pencil"
            variant="flat" />
          <v-btn
            @click="onDelete(post.id!)"
            v-tooltip="{ text: 'Delete', location: 'top' }"
            size="x-small"
            icon="mdi-trash-can"
            color="red"
            variant="text" />
        </div>
      </div>
      <p class="mt-4 mb-6 text-body-1">{{ post.content }}</p>
    </v-container>
  </v-container>
</template>
