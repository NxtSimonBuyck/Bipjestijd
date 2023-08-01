<script lang="ts" setup>
import { inject } from "vue";
import Switch from "../../form/Switch.vue";
import Input from "../../form/Input.vue";

const switchOptions = [
  { id: 'movies', title: "Movies" },
  { id: 'series', title: "Series" },
];

const activeCollection = inject("activeCollection", 'movies');
const filters = inject("filters", { search: "", genres: [] });
</script>
<template>
  <div>
    <Switch
      v-model="activeCollection"
      :name="'overview-page-switch'"
      :options="switchOptions"
    />
    <Input
      v-model="filters.search"
      :name="'overview-page-search'"
      :placeholder="'Search'"
    />
  </div>
</template>
