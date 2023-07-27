<script lang="ts" setup>
import OverviewFilters from './OverviewFilters.vue'
</script>
<template>
  <div class="overview-page">
    <OverviewFilters></OverviewFilters>
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
