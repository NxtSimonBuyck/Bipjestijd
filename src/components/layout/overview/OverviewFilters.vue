<script lang="ts" setup>
import { inject } from "vue";
import Switch from "../../form/Switch.vue";

const switchOptions = [
  { id: 'movies', title: "Movies" },
  { id: 'series', title: "Series" },
];

const activeCollection = inject("activeCollection", 'movies');
</script>
<template>
  <div>
    <Switch
      v-model="activeCollection"
      :name="'overview-page-switch'"
      :options="switchOptions"
    />
  </div>
</template>
