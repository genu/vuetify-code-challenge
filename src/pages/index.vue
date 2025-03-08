<script lang="ts" setup>
  import { useDate } from "vuetify"
  import { useData } from "@/composables"
  import { useDialog, useOverlay, useSnackbar, useStringUtils } from "@/composables/ui"
  import EditPostDialog from "@/components/dialogs/EditPost.vue"
  import { computed } from "vue"

  const data = useData()
  const overlay = useOverlay()
  const dialog = useDialog()
  const snackbar = useSnackbar()
  const stringUtils = useStringUtils()
  const date = useDate()

  const { data: posts, refetch: refetchPosts } = data.all("posts")
  const { data: authors, refetch: refetchAuthors } = data.all("authors")

  const editPostDialog = overlay.create(EditPostDialog)

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

    snackbar.show({ message: "Post created successfully", type: "success" })

    if (createdPost) {
      await refetchPosts()
      await refetchAuthors() // Refetch authors since user might have added a new author
    }
  }

  const onDelete = async (id: number) => {
    dialog
      .confirm({ title: "Are you sure you want to delete this post?", size: "md", color: "error" })
      .onConfirm(async () => {
        snackbar.show({ message: "Post deleted successfully", type: "info" })

        await data.remove("posts", id)
        await refetchPosts()
      })
      .open()
  }

  const onEdit = async (id: number) => {
    const editedPost = await editPostDialog.open({ id })

    snackbar.show({ message: "Post updated successfully", type: "success" })

    if (editedPost) {
      await refetchPosts()
      await refetchAuthors() // Refetch authors since user might have added a new author
    }
  }
</script>

<template>
  <v-container fluid>
    <template v-if="postsWithAuthors.length">
      <div class="d-flex justify-space-between py-3">
        <h6 class="text-h6">Latest Posts</h6>
        <v-btn @click="onCreate" prepend-icon="mdi-plus" variant="text" text="New Post" />
      </div>
      <v-divider />

      <v-container class="px-0 py-5" fluid v-for="post in postsWithAuthors" :key="post.id">
        <p class="font-weight-medium text-primary">{{ date.format(post.postedAt, "fullDateWithWeekday") }}</p>
        <div class="d-flex justify-space-between align-center">
          <p class="mt-2 text-h5 font-weight-bold text-sm-h4">{{ post.title }}</p>
          <div class="d-flex ga-2 px-2">
            <v-btn
              @click="onDelete(post.id!)"
              size="small"
              prepend-icon="mdi-trash-can"
              color="red"
              text="Delete"
              variant="text" />
            <v-btn @click="onEdit(post.id!)" size="small" prepend-icon="mdi-pencil" text="Edit" variant="flat" />
          </div>
        </div>
        <p class="mt-4 mb-0 text-body-1">{{ post.content }}</p>
        <v-list-item class="px-0 my-2" v-if="post.authorId !== -1">
          <template #prepend>
            <v-avatar color="primary" :text="stringUtils.getInitials(post.author)" />
          </template>
          <v-list-item-title>{{ post.author }}</v-list-item-title>
          <v-list-item-subtitle>Author</v-list-item-subtitle>
        </v-list-item>
      </v-container>
    </template>
    <v-empty-state
      color="primary"
      v-else
      title="No Blog posts"
      text="Get started by creating a new post"
      @click:action="onCreate"
      action-text="Create Post">
      <template #media>
        <v-icon size="large" icon="mdi-card-plus" />
      </template>
    </v-empty-state>
  </v-container>
</template>
