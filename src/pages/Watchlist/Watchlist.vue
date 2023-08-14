<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStore } from '../../core/hooks/useStore';
import { User } from '../../core/store/user/user.interface';
import OverviewPage from '../../components/layout/overview/OverviewPage.vue';

const { state } = useStore();
const user = computed(() => state.user as User);
const partner = computed(() => state.partner as User);

const items = computed(() => {
  const items = user.value.saved.movies;
  const partnerItems = partner.value?.saved?.movies || [];
  const result = items.filter((item) => {
    return !partnerItems.find((i) => i.id === item.id);
  });
  return result;
});
</script>
<template>
  <OverviewPage :slug="'watchlist'" :items="items">
    <template #content>
      <div>
        <h2 class="title">Select Partner</h2>
      </div>
    </template>

  </OverviewPage>
</template>
<style lang="css" scoped>
</style>
