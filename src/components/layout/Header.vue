<script lang="ts" setup>
import { reactive, ref } from "vue";

const isDark = ref(false);
</script>
<template>
  <header>
    <div class="header__nav">
      <h1>Bipjestijd</h1>
      <nav>
        <ul>
          <li>
            <router-link to="/">
              <i class="icon fas fa-film"></i>Cinema
            </router-link>
          </li>
          <li>
            <router-link to="/watchlist">
              <i class="icon fas fa-shield-heart"></i>Watchlist
            </router-link>
          </li>
          <li>
            <router-link to="/my-partner">
              <i class="icon fas fa-ring"></i>My Partner
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    <!-- <div class="nav__links__item">
      <i :class="['icon', !isDark ? 'fas fa-moon' : 'fas fa-sun']"></i
      >{{ isDark ? "Go Light" : "Go Dark" }}
    </div> -->
  </header>
</template>
