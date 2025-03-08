<script setup lang="ts">
  import DialogProvider from "@/components/DialogProvider.vue"
  import SnackbarProvider from "./components/SnackbarProvider.vue"
</script>

<template>
  <v-app>
    <v-app-bar flat>
      <v-container class="d-flex">
        <v-btn text="Home" to="/" />
      </v-container>
    </v-app-bar>
    <v-app-bar class="bg-grey-lighten-5" flat>
      <v-container>
        <v-breadcrumbs :rounded="true" :items="['Home', 'Blog']" />
      </v-container>
    </v-app-bar>
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
    <DialogProvider />
    <SnackbarProvider />
  </v-app>
</template>
