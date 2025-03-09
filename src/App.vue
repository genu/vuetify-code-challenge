<script setup lang="ts">
  import { useBreadcrumbs } from "./composables"

  const breadcrumbs = useBreadcrumbs()
</script>

<template>
  <v-app>
    <v-app-bar flat>
      <v-container class="d-flex">
        <v-btn prepend-icon="$vuetify" text="Vlogify" to="/" />
      </v-container>
    </v-app-bar>
    <v-app-bar class="bg-grey-lighten-5" flat>
      <v-container>
        <v-breadcrumbs :items="breadcrumbs" />
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
