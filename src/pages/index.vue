<script lang="ts" setup>
  import { useDate } from "vuetify"
  import { useBreadcrumbs, useData } from "@/composables"
  import { useDialog, useOverlay, useSnackbar, useStringUtils } from "@/composables/ui"
  import EditPostDialog from "@/components/dialogs/EditPost.vue"
  import { computed } from "vue"

  const data = useData()
  const overlay = useOverlay()
  const dialog = useDialog()
  const snackbar = useSnackbar()
  const stringUtils = useStringUtils()
  const breadcrumbs = useBreadcrumbs()
  const date = useDate()

  breadcrumbs.value = [{ title: "Blog Home", href: "/", disabled: false }]
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

    if (createdPost) {
      snackbar.show({ message: "Post created successfully", type: "success" })

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

    if (editedPost) {
      snackbar.show({ message: "Post updated successfully", type: "success" })

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
        <v-btn color="primary" @click="onCreate" prepend-icon="mdi-plus" variant="tonal" text="New Post" />
      </div>
      <v-divider />

      <v-container class="px-0 py-5" fluid v-for="post in postsWithAuthors" :key="post.id">
        <v-card class="rounded-lg">
          <v-card-item>
            <p class="font-weight-medium text-primary text-body-2">
              {{ date.format(post.postedAt, "fullDateWithWeekday") }}
            </p>
            <v-card-title>
              <div class="d-flex justify-space-between align-center">
                <span>{{ post.title }} </span>
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
            </v-card-title>
            <v-card-text class="pa-0 my-1 text-medium-emphasis">
              {{ stringUtils.truncate(post.content, 150) }}
            </v-card-text>

            <v-card-actions class="d-flex justify-end justify-space-between">
              <div>
                <v-list-item class="px-0 my-2" v-if="post.authorId !== -1">
                  <template #prepend>
                    <v-avatar color="primary" :text="stringUtils.getInitials(post.author)" />
                  </template>
                  <v-list-item-title>{{ post.author }}</v-list-item-title>
                  <v-list-item-subtitle>Author</v-list-item-subtitle>
                </v-list-item>
              </div>
              <v-btn
                v-if="stringUtils.wordCount(post.content) > 150"
                :to="{ name: 'detail', params: { id: post.id } }"
                text="Read more"
                append-icon="mdi-arrow-right" />
            </v-card-actions>
          </v-card-item>
        </v-card>
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
