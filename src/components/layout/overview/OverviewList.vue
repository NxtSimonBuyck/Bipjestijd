<script lang="ts" setup>
import { PropType } from "vue";
import { Cinema } from "../../../core/store/cinema/cinema.interface";

import OverviewListItem from "./OverviewListItem.vue";

defineProps({
  items: { type: Array as PropType<Array<Cinema>>, default: () => [] },
});
</script>
<template>
  <ul class="overview-list">
    <OverviewListItem v-for="item in items" :key="item.id" :item="item" />
  </ul>
</template>
<style lang="scss" scoped>
.overview-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spacing-xlarge);
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
