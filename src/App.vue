<script setup lang="ts">
import { useCurrentUser } from "vuefire";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useStore } from "./core/store/store";

const currentFirebaseUser = useCurrentUser();
const route = useRoute();
const router = useRouter();
const { commit } = useStore();

watch(currentFirebaseUser, async (currenUser, previousUser) => {
  console.log("currenUser", currenUser);
  if (currenUser?.uid) {
    getDoc(doc(collection(db, "users"), currenUser.uid))
      .then((doc) => {
        if (doc.exists()) {
          console.log("doc", { id: currenUser.uid, ...doc.data() });
          commit("SET_USER", { id: currenUser.uid, ...doc.data() });
        } else {
          console.log("doc not exists");
        }
      })
      .catch((error) => console.log("error", error));
  }

  if (!currenUser && previousUser && route.meta.requiresAuth) {
    await router.push("/login");
  } else {
    if (!currenUser) return;
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
