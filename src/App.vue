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
  if (!currenUser && previousUser && route.meta.requiresAuth) {
    await router.push("/login");
  } else {
    // get user data from firestore
    // const userRef = doc(db, "users", currenUser?.uid);
    // const userSnap = await getDoc(userRef);
    // if (userSnap.exists()) {
    //   console.log("Document data:", userSnap.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }
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
