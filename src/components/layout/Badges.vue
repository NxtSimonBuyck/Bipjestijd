<script lang="ts" setup>
import { PropType, inject, ref } from 'vue';
import Badge from '../layout/Badge.vue';
import { Genre } from '../../core/store/genres/genre.interface';


defineProps({
  items: { type: Array as PropType<Array<Genre>>, default: () => [] },
});

const filters = inject("filters", ref({ genres: [] as Array<Genre> }));

function handleBadgeClick(item: Genre) {
  if(!!filters.value.genres.find(genre => genre.key === item.key)){
    const index = filters.value.genres.findIndex(genre => genre.key === item.key);
    filters.value.genres.splice(index, 1);
  } else {
    filters.value.genres.push(item);
  }
}
</script>
<template>
  <ul class="badges">
    <Badge v-for="item in items" :key="item.id" :active="!!filters.genres.find(genre => genre.key === item.key)" @click="handleBadgeClick(item)">
      {{ item.name }}
    </Badge>
  </ul>
</template>
<style lang="css" scoped>
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing);
}
</style>
