<script setup lang="ts">
// import { db } from "./firebase";

// import { useCollection } from "vuefire";
// import { collection } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// const movies = useCollection(collection(db, "movies"));

const currentFirebaseUser = useCurrentUser();
const route = useRoute();
const router = useRouter();

watch(currentFirebaseUser, async (currenUser, previousUser) => {
  if(!currenUser && previousUser && route.meta.requiresAuth) {
    await router.push("/login");
  }
});
</script>
<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade">
      <Component :is="Component" />
    </transition>
  </RouterView>
</template>
<style scoped></style>
