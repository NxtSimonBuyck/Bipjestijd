<script lang="ts" setup>
import Badge from '../layout/badge.vue';

const props = defineProps({
  badges: {
    type: Array,
    required: true,
  },
});
</script>
<template>
  <ul>
    <Badge v-for="badge in badges" :key="badge.id">
      {{ badge.name }}
    </Badge>
  </ul>
</template>
<style lang="css" scoped></style>
