<script lang="ts" setup>
import { inject } from "vue";
import Switch from "../../form/Switch.vue";
import Input from "../../form/Input.vue";
import { useFirebaseAuth } from "vuefire";

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

const activeCollection = inject("activeCollection", "movies");
const filters = inject("filters", { search: "", genres: [] });
</script>
<template>
  <div class="overview-page-filters">
    <div class="filters">
      <Switch
        v-model="activeCollection"
        :name="'overview-page-switch'"
        :options="switchOptions"
      />
      <Input
        v-model="filters.search"
        :name="'overview-page-search'"
        :disabled="true"
        :placeholder="'Search'"
      />
    </div>
    <div class="account-settings">
      <i class="icon fas fa-bell"></i>
      <i class="icon fas fa-cog"></i>
      <div class="user-info-icon">
        <i class="icon fas fa-user"></i>
        <div class="user-info">
          <div class="user-info__header">
            <h2>Siejemaan</h2>
            <i class="icon fas fa-arrow-right-from-bracket" @click="logout"></i>
          </div>
          <span>simonbuyck1@outlook.com</span>
          <ul class="user-info__stats">
            <li class="user-info__stats-item">
              <i class="icon fas fa-bookmark"></i>
              <span>15</span>
            </li>
            <li class="user-info__stats-item">
              <i class="icon fas fa-heart"></i>
              <span>85</span>
            </li>
            <li class="user-info__stats-item">
              <i class="icon fas fa-eye"></i>
              <span>53</span>
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
