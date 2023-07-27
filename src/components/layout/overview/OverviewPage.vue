<script lang="ts" setup>
import { provide, ref, watch } from "vue";
import OverviewFilters from "./OverviewFilters.vue";

function updateFilter() {
  console.log("updateFilter");
}

const filters = ref({ page: 1, search: "", genres: [] });
provide("filters", filters);

watch(
  () => filters.value,
  () => {
    console.log("filters", filters.value);
  }
);
</script>
<template>
  <div class="overview-page">
    <OverviewFilters @update-filters="updateFilter"></OverviewFilters>

    <div class="overview-page__content">
      {{  }}
    </div>
  </div>
</template>
<style lang="css" scoped>
.overview-page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto 1fr;
  height: 100%;
}
</style>
