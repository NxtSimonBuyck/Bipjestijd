<script setup lang="ts">
import { db } from "./firebase";

import { useCollection } from "vuefire";
import { collection } from "firebase/firestore";

const movies = useCollection(collection(db, "cinema"));
const users = useCollection(collection(db, "users"));
</script>
<template>
  <div id="app">
    movies:
    <ul>
      <li v-for="movie in movies" :key="movie.id">
        <span>{{ movie.title || "-" }}</span>
        <ul>
          <li v-for="genre in movie.genres" :key="genre.id">
            {{ genre.name }}
          </li>
        </ul>
      </li>
    </ul>
    users:
    <ul>
      <li v-for="user in users" :key="user.id">
        <span>{{ user.name || "-" }}</span>
        <ul>
          <li v-for="movie in user.movies" :key="movie.id">
            {{ movie.title }}
          </li>
        </ul>
      </li>
  </div>
</template>
<style scoped></style>
