<script setup lang="ts">
import { useCurrentUser } from "vuefire";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const currentFirebaseUser = useCurrentUser();
const route = useRoute();
const router = useRouter();

watch(currentFirebaseUser, async (currenUser, previousUser) => {
  if (!currenUser && previousUser && route.meta.requiresAuth) {
    await router.push("/login");
  } else {
    if(!currenUser) return;
    await router.push("/");
  }
});
</script>
<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade">
      <KeepAlive>
        <Component :is="Component" />
      </KeepAlive>
    </transition>
  </RouterView>
</template>
<style scoped></style>
