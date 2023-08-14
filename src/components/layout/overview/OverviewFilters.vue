<script lang="ts" setup>
import { computed, inject } from "vue";
import Switch from "../../form/Switch.vue";
import { useFirebaseAuth } from "vuefire";
import { useStore } from "../../../core/hooks/useStore";
import { User } from "../../../core/store/user/user.interface";

const { state } = useStore();

const switchOptions = [
  { id: "movies", title: "Movies" },
  { id: "series", title: "Series" },
];

// #region userinfo
const auth = useFirebaseAuth()!;

function logout() {
  auth.signOut();
}
// #endregion

const user = computed(() => state.user as User);

const activeCollection = inject("activeCollection", "movies");
</script>
<template>
  <div class="overview-page-filters">
    <div class="filters">
      <Switch
        v-model="activeCollection"
        :name="'overview-page-switch'"
        :options="switchOptions"
      />
    </div>
    <div class="account-settings">
      <i class="icon fas fa-bell"></i>
      <i class="icon fas fa-cog"></i>
      <div class="user-info-icon">
        <i class="icon fas fa-user"></i>
        <div class="user-info">
          <div class="user-info__header">
            <h2>{{ user.email }}</h2>
            <i class="icon fas fa-arrow-right-from-bracket" @click="logout"></i>
          </div>
          <!-- TODO: redesign so saved movie en series is shown -->
          <ul class="user-info__stats">
            <li
              class="user-info__stats-item"
              :title="`movies: ${user.saved?.movies.length || 0}, series: ${
                user.saved?.series.length || 0
              }`"
            >
              <i class="icon fas fa-bookmark"></i>
              <span>{{
                (user.saved?.movies.length || 0) +
                (user.saved?.series.length || 0)
              }}</span>
            </li>
            <li
              class="user-info__stats-item"
              :title="`movies: ${user.liked?.movies.length || 0}, series: ${
                user.liked?.series.length || 0
              }`"
            >
              <i class="icon fas fa-heart"></i>
              <span>{{
                (user.liked?.movies.length || 0) +
                (user.liked?.series.length || 0)
              }}</span>
            </li>
            <li
              class="user-info__stats-item"
              :title="`movies: ${user.seen?.movies.length || 0}, series: ${
                user.seen?.series.length || 0
              }`"
            >
              <i class="icon fas fa-eye"></i>
              <span>{{
                (user.seen?.movies.length || 0) +
                (user.seen?.series.length || 0)
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.overview-page-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filters {
  display: flex;
  align-items: center;
  gap: var(--spacing);
}

.account-settings {
  display: flex;
}

.user-info-icon {
  position: relative;

  &:hover > .user-info {
    display: inline-block;
  }
}

.user-info {
  display: none;
  position: absolute;
  transform-origin: top left;
  z-index: 10;
  top: 32px;
  right: 0;

  background-color: var(--background-color);
  filter: drop-shadow(var(--drop-shadow));

  padding: var(--spacing-large);
  border-radius: var(--border-radius);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-small);

    margin-bottom: var(--spacing);

    & > h2 {
      font-size: var(--font-size-large);
      font-weight: bold;
    }
  }

  &__stats {
    display: flex;
    gap: var(--spacing);

    width: max-content;
    margin: 0 auto;
    margin-top: var(--spacing-small);

    &-item {
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-small);

      & > .icon:hover {
        background-color: inherit;
      }
    }
  }
}
</style>
