<script lang="ts" setup>
import { ref, watch } from "vue";
import Switch from "../../form/Switch.vue";

defineEmits<{
  updateFilters: [];
}>();

const filters = ref({
  page: 1,
});

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
      :options="[
        { id: 1, title: 'Movies' },
        { id: 2, title: 'Series' },
      ]"
    />
  </div>
  filters
</template>
