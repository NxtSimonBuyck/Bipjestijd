<script lang="ts" setup>
import { PropType } from "vue";
import { Cinema } from "../../../core/store/cinema/cinema.interface";

import OverviewListItem from "./OverviewListItem.vue";

defineProps({
  items: { type: Array as PropType<Array<Cinema>>, default: () => [] },
});
</script>
<template>
  <ul>
    <OverviewListItem v-for="item in items" :key="item.id" :item="item" />
  </ul>
</template>
<style lang="scss" scoped></style>
