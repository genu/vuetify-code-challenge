<script lang="ts" setup>
  import { useRoute } from "vue-router"

  import { useStringUtils } from "@/composables/ui"
  import { useData } from "@/composables"
  import { computed, watchEffect } from "vue"

  const data = useData()
  const route = useRoute()
  const stringUtils = useStringUtils()

  const postId = route.params.id

  const { data: post, isLoading } = data.one("posts", Number(postId))
  const { data: author, refetch: refetchAuthor } = data.one("authors")

  watchEffect(() => {
    if (post.value && post.value.authorId !== -1) {
      refetchAuthor(post.value.authorId)
    }
  })

  const postWithAuthor = computed(() => {
    if (!post.value) return null

    let authorName = "No Author"

    if (author.value) {
      authorName = `${author.value.firstName} ${author.value.lastName}`
    }

    return {
      ...post.value,
      author: authorName,
    }
  })
</script>

<template>
  <div>
    <v-skeleton-loader type="article" v-if="isLoading" />
    <template v-else-if="postWithAuthor && !isLoading">
      <h2>{{ postWithAuthor.title }}</h2>
      <v-list-item class="px-0 my-2" v-if="postWithAuthor.authorId !== -1">
        <template #prepend>
          <v-avatar color="primary" :text="stringUtils.getInitials(postWithAuthor.author)" />
        </template>
        <v-list-item-title>{{ postWithAuthor.author }}</v-list-item-title>
        <v-list-item-subtitle>Author</v-list-item-subtitle>
      </v-list-item>
      <p>{{ postWithAuthor.content }}</p>
    </template>
  </div>
</template>
