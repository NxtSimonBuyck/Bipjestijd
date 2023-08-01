<script lang="ts" setup>
import { PropType } from "vue";
import { Cinema } from "../../../core/store/cinema/cinema.interface";
import Badges from "../Badges.vue";

defineProps({
  item: { type: Object as PropType<Cinema>, default: () => ({}) },
  liked: { type: Boolean, default: false },
  saved: { type: Boolean, default: false },
  seen: { type: Boolean, default: false },
});
</script>
<template>
  <li class="overview-list-item">
    <div class="overview-item-cover">
      <!-- TODO: replace the temp url -->
      <img
        src="https://picsum.photos/178/267"
        :alt="item.title"
        height="267"
        width="178"
      />
      <ul class="overview-item-cover-actions">
        <li class="far fa-bookmark"></li>
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
</template>
<style lang="scss" scoped></style>
