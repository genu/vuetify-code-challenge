<template>
  <v-app>
    <v-app-bar flat>
      <v-container class="">
        <v-btn text="yo" />
      </v-container>
    </v-app-bar>
    <v-main>
      <v-breadcrumbs :items="['Foo', 'Bar', 'Fizz']" />
      yo dawg
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  const test = "test"

  console.log(test)
</script>
