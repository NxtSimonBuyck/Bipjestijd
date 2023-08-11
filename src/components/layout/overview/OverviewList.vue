<script lang="ts" setup>
import { PropType, computed } from "vue";
import { Cinema } from "../../../core/store/cinema/cinema.interface";

import OverviewListItem from "./OverviewListItem.vue";
import { useStore } from "../../../core/hooks/useStore";
import { User } from "../../../core/store/user/user.interface";
import { SlugTypes } from "../../../core/store/slug.interface";

defineProps({
  items: { type: Array as PropType<Array<Cinema>>, default: () => [] },
  activeCollection: { type: String as PropType<'movies' | 'series'>, default: "movies" },
  slug: { type: String as PropType<SlugTypes>, default: "" },
});

const emits = defineEmits<{
  onSaveItem: [item: Cinema];
  onLikeItem: [item: Cinema];
  onSeenItem: [item: Cinema];
}>();

const { state } = useStore();
const user = computed(() => state.user as User);
const partner = computed(() => state.user as User);
</script>
<template>
  <ul class="overview-list">
    <OverviewListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :liked="!!user.liked?.[activeCollection].find((i) => i.id === item.id)"
      :saved="!!user.saved?.[activeCollection].find((i) => i.id === item.id)"
      :seen="!!user.seen?.[activeCollection].find((i) => i.id === item.id)"
      :partner-liked="!!partner.liked?.[activeCollection].find((i) => i.id === item.id)"
      :partner-saved="!!partner.saved?.[activeCollection].find((i) => i.id === item.id)"
      :partner-seen="!!partner.seen?.[activeCollection].find((i) => i.id === item.id)"
      :slug="slug"
      @on-save-item="emits('onSaveItem', item)"
      @on-like-item="emits('onLikeItem', item)"
      @on-seen-item="emits('onSeenItem', item)"
    />
  </ul>
</template>
<style lang="scss" scoped>
.overview-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spacing-xlarge);
  list-style: none;
  padding:  5px;
  margin: -5px;
  padding-bottom: var(--spacing-xlarge);
  height: calc(100vh - (98px + 64px));
  overflow-y: scroll;
}
</style>
