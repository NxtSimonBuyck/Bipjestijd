<script setup lang="ts">
import { useCurrentUser } from "vuefire";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useStore } from "./core/hooks/useStore";
import { userMapper } from "./core/helpers/mapper.helper";

const currentFirebaseUser = useCurrentUser();
const route = useRoute();
const router = useRouter();
const { commit } = useStore();

watch(currentFirebaseUser, async (currenUser, previousUser) => {
  if (currenUser?.uid) {
    getDoc(doc(collection(db, "users"), currenUser.uid))
      .then(async (document) => {
        if (document.exists()) {
          const user = await userMapper(document);
          commit("SET_USER", user);
        } else {
          const newUser = await setDoc(doc(db, "users", currenUser.uid), {
            name: currenUser.displayName,
            email: currenUser.email,
            photoURL: currenUser.photoURL,
          });
          console.log("Document written with ID: ", newUser);
          await addDoc(collection(db, `users/${currenUser.uid}/liked`), {
            movies: [],
            series: [],
          }).then((docRef) => {
            console.log(
              "Document liked collection written with ID: ",
              docRef.id
            );
            updateDoc(doc(db, "users", currenUser.uid), {
              likedCollection: docRef,
            });
          });
          await addDoc(collection(db, `users/${currenUser.uid}/seen`), {
            movies: [],
            series: [],
          }).then((docRef) => {
            console.log("Document seencollection written with ID: ", docRef.id);
            updateDoc(doc(db, "users", currenUser.uid), {
              seenCollection: docRef,
            });
          });
          await addDoc(collection(db, `users/${currenUser.uid}/saved`), {
            movies: [],
            series: [],
          }).then((docRef) => {
            console.log(
              "Document saved collection written with ID: ",
              docRef.id
            );
            updateDoc(doc(db, "users", currenUser.uid), {
              savedCollection: docRef,
            });
          });

          const newUserRef = doc(db, "users", currenUser.uid);
          const newUserDoc = await getDoc(newUserRef);
          const user = await userMapper(newUserDoc);
          commit("SET_USER", user);
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
