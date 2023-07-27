<script lang="ts" setup>
import { computed, inject, ref, watch } from "vue";
import Switch from "../../form/Switch.vue";
import Input from "../../form/Input.vue";

defineEmits<{
  updateFilters: [];
}>();

const switchOptions = [
  { id: 1, title: "Movies" },
  { id: 2, title: "Series" },
];

const filters = inject("filters", ref({ page: 1, search: "", genres: [] }));
const activePage = computed(() => switchOptions.find((option) => option.id === filters.value.page));

watch(
  () => filters.value.page,
  () => {
    console.log("filters.page", filters.value.page);
  }
);
</script>
<template>
  <div>
    <Switch
      v-model="filters.page"
      :name="'overview-page-switch'"
      :options="switchOptions"
    />
    <Input v-model="filters.search" name="overview-search-field" :placeholder="`Search for ${activePage?.title}`"></Input>
  </div>
  filters
</template>
