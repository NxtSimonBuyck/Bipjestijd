<script lang="ts" setup>
import { PropType } from "vue";
import { Cinema } from "../../../core/store/cinema/cinema.interface";
import Badges from "../Badges.vue";

defineProps({
  items: { type: Array as PropType<Array<Cinema>>, default: () => [] },
});
</script>
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <div class="overview-item-cover">
        <img :src="item.cover" :alt="item.title" height="267" width="178" />
        <ul class="overview-item-cover-actions">
          <li></li>
        </ul>
      </div>
      <div class="overview-item-content">
        <h2>{{ item.title }} ({{ item.releaseYear }})</h2>
        <Badges :items="item.genres"></Badges>
        <p>{{ item.description }}</p>
        <p>
          actor(s):
          <span v-for="(actor, index) in item.actors" :key="actor.id"
            >{{ actor.name
            }}{{ index + 1 < item.actors.length ? ", " : "" }}</span
          >
        </p>
        <p>
          director(s):
          <span v-for="(director, index) in item.directors" :key="director.id"
            >{{ director.name
            }}{{ index + 1 < item.directors.length ? ", " : "" }}</span
          >
        </p>
      </div>
    </li>
  </ul>
</template>
<style lang="scss" scoped></style>
