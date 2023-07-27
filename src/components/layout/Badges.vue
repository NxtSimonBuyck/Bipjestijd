<script lang="ts" setup>
import { PropType } from 'vue';
import Badge from '../layout/Badge.vue';


defineProps({
  items: { type: Array as PropType<Array<any>>, default: () => [] },
});

const emits = defineEmits<{
  click: [genre: any]
}>()
</script>
<template>
  <ul>
    <Badge v-for="item in items" :key="item.id" @click="emits('click', item)">
      {{ item.name }}
    </Badge>
  </ul>
</template>
<style lang="css" scoped></style>
