<script lang="ts" setup>
import { PropType, computed, ref, watch } from "vue";
import { Cinema, CoverTypeKey } from "../../../core/store/cinema/cinema.interface";
import Badges from "../Badges.vue";
import { useFirebaseStorage } from "vuefire";
import { ref as storageRef } from "@firebase/storage";
import { getDownloadURL } from "firebase/storage";

const props = defineProps({
  item: { type: Object as PropType<Cinema>, default: () => ({}) },
  liked: { type: Boolean, default: false },
  saved: { type: Boolean, default: false },
  seen: { type: Boolean, default: false },
});

const likedIcon = computed(() =>
  props.liked ? "fas fa-heart-crack" : "fas fa-heart"
);
const savedIcon = computed(() =>
  props.saved ? "fas fa-bookmark" : "far fa-bookmark"
);
const seenIcon = computed(() =>
  props.seen ? "fas fa-eye-slash" : "fas fa-eye"
);

// #region item cover
const storage = useFirebaseStorage();
const coverImage = ref<HTMLImageElement>();
watch(coverImage, (newValue) => {
  if(!newValue) return;
  if(props.item.coverTypeKey === CoverTypeKey.External){
    return newValue.src = props.item.cover;
  }
  getDownloadURL(
    storageRef(storage, "covers/Guardians_of_the_Galaxy_Vol_3_poster.jpeg")
  )
    .then((url) => {
      newValue.src = url;
    })
    .catch((error) => {
      console.log(error);
    });
});
// #endregion
</script>
<template>
  <li class="overview-list-item">
    <div class="overview-list-item-cover">
      <ul class="overview-list-item-cover-actions">
        <li :class="['icon', likedIcon]"></li>
        <li :class="['icon', savedIcon]"></li>
        <li :class="['icon', seenIcon]"></li>
      </ul>
      <img
      ref="coverImage"
        class="overview-list-item-cover-image"
        :alt="item.title"
        height="267"
        width="178"
      />
    </div>
    <div class="overview-list-item-content">
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
<style lang="scss" scoped>
.overview-list-item {
  display: grid;
  grid-template-columns: 178px 1fr;
  grid-template-rows: 1fr;

  width: 100%;
  height: 267px;

  border-radius: var(--border-radius);
  overflow: hidden;

  background-color: var(--background-color);
  filter: drop-shadow(var(--drop-shadow));

  &-cover {
    position: relative;
    width: 178px;
    height: 267px;
    overflow: hidden;

    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-actions {
      position: absolute;
      display: flex;
      gap: var(--spacing-large);

      bottom: var(--spacing-large);
      left: 50%;
      transform: translateX(-50%);

      & > .icon {
        background-color: var(--background-color);
      }
    }
  }
}
</style>
