<script lang="ts" setup>
import { PropType, computed, inject, ref, watch } from "vue";
import {
  Cinema,
  CoverTypeKey,
} from "../../../core/store/cinema/cinema.interface";
import Badges from "../Badges.vue";
import { useCurrentUser, useFirebaseStorage } from "vuefire";
import { ref as storageRef } from "@firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { SlugTypes } from "../../../core/store/slug.interface";

const props = defineProps({
  item: { type: Object as PropType<Cinema>, default: () => ({}) },
  liked: { type: Boolean, default: false },
  saved: { type: Boolean, default: false },
  seen: { type: Boolean, default: false },
  partnerSaved: { type: Boolean, default: false },
  partnerLiked: { type: Boolean, default: false },
  partnerSeen: { type: Boolean, default: false },
});
const emits = defineEmits<{
  onSaveItem: [];
  onLikeItem: [];
  onSeenItem: [];
}>();

const slug = inject("slug", 'cinema' as SlugTypes);

const likedIcon = computed(() =>
  props.liked ? "fas fa-heart-crack" : "fas fa-heart"
);
const savedIcon = computed(() =>
  props.saved ? "fas fa-bookmark" : "far fa-bookmark"
);
const seenIcon = computed(() =>
  props.seen ? "fas fa-eye-slash" : "fas fa-eye"
);

const currentUser = await useCurrentUser();

// #region item cover
const storage = useFirebaseStorage();
const coverImage = ref<HTMLImageElement>();
watch([coverImage, () => props.item], ([newValue]) => {
  if (!newValue) return;
  if (props.item.coverTypeKey === CoverTypeKey.External) {
    return (newValue.src = props.item.cover);
  }
  if (!props.item.cover) return (newValue.src = "");
  getDownloadURL(storageRef(storage, `covers/${props.item.cover}`)).then(
    (url) => {
      newValue.src = url;
    }
  );
});
// #endregion
</script>
<template>
  <li class="overview-list-item">
    <div class="overview-list-item-cover">
      <ul class="overview-list-item-cover-actions">
        <!-- <li>
          <i
            :class="[
              'icon',
              likedIcon,
              {
                '-liked': props.partnerLiked && slug === 'watchlist',
              },
            ]"
            @click="emits('onLikeItem')"
          ></i>
        </li> -->
        <li>
          <i
            :class="[
              'icon',
              savedIcon,
              {
                '-saved': props.partnerSaved && slug === 'watchlist',
              },
            ]"
            @click="emits('onSaveItem')"
          ></i>
        </li>
        <!-- <li>
          <i
            :class="[
              'icon',
              seenIcon,
              {
                '-seen': props.partnerSeen && slug === 'watchlist',
              },
            ]"
            @click="emits('onSeenItem')"
          ></i>
        </li> -->
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
      <div class="overview-list-item-content__header">
        <span class="overview-list-item-content__header-title">{{ item.title }} ({{ item.releaseYear }})</span>
        <i v-if="item.userId === currentUser?.uid" class="icon fas fa-pen"></i>
      </div>
      <Badges
        class="overview-list-item-content__badges"
        :items="item.genres.slice(0, 3)"
      ></Badges>
      <p class="overview-list-item-content__description">
        {{ item.description }}
      </p>
      <p class="overview-list-item-content__actors">
        actor(s):
        <span v-for="(actor, index) in item.actors" :key="actor.id"
          >{{ actor.name
          }}{{ index + 1 < item.actors.length ? ", " : "" }}</span
        >
      </p>
      <p class="overview-list-item-content__directors">
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
.-liked {
  background-color: var(--liked-color);

  &:hover {
    background-color: var(--liked-color-dark);
  }
}

.-saved {
  background-color: var(--saved-color);

  &:hover {
    background-color: var(--saved-color-dark);
  }
}

.-seen {
  background-color: var(--seen-color);

  &:hover {
    background-color: var(--seen-color-dark);
  }
}

.overview-list-item {
  display: grid;
  grid-template-columns: 178px 1fr;
  grid-template-rows: 1fr;

  width: 100%;
  height: 267px;
  z-index: 1;
  position: relative;

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

  &-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-small);

    padding: var(--spacing-xlarge);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-title {
        font-family: 'Poppins', sans-serif;
        font-weight: bold;
        font-size: var(--font-size-large);
      }

      font-family: 'Poppins', sans-serif;
      font-weight: bold;
      font-size: var(--font-size-large);

      & > i {
        font-size: var(--font-size);
      }
    }

    &__description {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__badges,
    &__description {
      margin-bottom: var(--spacing);
    }

    &__actors,
    &__directors {
      font-family: 'Poppins', sans-serif;
      font-style: normal;
      font-size: var(--font-size-small);

      & > span {
        font-style: italic;
      }
    }
  }
}
</style>
