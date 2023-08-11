<script lang="ts" setup>
import { ref } from "vue";

const isDark = ref(false);
</script>
<template>
  <header class="header">
    <div class="header-nav">
      <h1 class="header-nav__title">Bipjestijd</h1>
      <nav>
        <ul class="header-nav__list">
          <li>
            <router-link
              to="/"
              class="header-nav__list-item"
              :exact-active-class="'-active'"
            >
              <i class="icon fas fa-film"></i><span>Cinema</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/watchlist"
              :exact-active-class="'-active'"
              class="header-nav__list-item"
            >
              <i class="icon fas fa-shield-heart"></i><span>Watchlist</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/my-partner"
              :exact-active-class="'-active'"
              class="header-nav__list-item"
            >
              <i class="icon fas fa-ring"></i><span>My Partner</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <div class="header-nav__list-item" @click="isDark = !isDark">
      <i :class="['icon', !isDark ? 'fas fa-moon' : 'fas fa-sun']"></i
      >{{ isDark ? "Go Light" : "Go Dark" }}
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  padding: var(--spacing-xlarge);
}

.header-nav {
  &__title {
    font-size: var(--font-size-xlarge);
    font-weight: bold;
    margin-bottom: var(--spacing-xlarge);
  }

  &__list {
    display: flex;
    flex-flow: column;
    gap: var(--spacing);

    &-item {
      display: flex;
      gap: var(--spacing);
      align-items: center;
      justify-content: flex-start;

      padding-left: 100px;
      padding-right: var(--spacing-large);
      transform: translateX(-100px);

      white-space: nowrap;
      width: max-content;

      text-decoration: none;
      color: inherit;
      border-radius: var(--border-radius);

      &:hover {
        background-color: var(--primary-color-dark);

        & > .icon {
          background-color: var(--primary-color-dark);
        }
      }

      &.-active {
        background-color: var(--accent-color-light);
        color: var(--primary-color);

        & > .icon {
          background-color: var(--accent-color-light);
        }

        &:hover {
          background-color: var(--accent-color-dark);

          & > .icon {
            background-color: var(--accent-color-dark);
          }
        }
      }
    }
  }
}
</style>
