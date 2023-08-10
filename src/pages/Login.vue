<script lang="ts" setup>
import {
  UserCredential,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import { onMounted, ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import { GoogleAuthProvider } from "firebase/auth";
import Input from "../components/form/Input.vue";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
const googleAuthProvider = new GoogleAuthProvider();

const auth = useFirebaseAuth()!; // only exists on client side

async function getUserData(user: UserCredential) {
  const docRef = doc(db, "users", user.user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // TODO: update user data in store
    console.log("Document data:", docSnap.data());
  } else {
    await setDoc(doc(db, "users", user.user.uid), {
      name: user.user.displayName,
      email: user.user.email,
      photoURL: user.user.photoURL,
      
    });
  }
}

// display errors if any
const error = ref(null);
function signinRedirect() {
  signInWithPopup(auth, googleAuthProvider)
    .then(async (user) => {
      await getUserData(user);
    })
    .catch((reason) => {
      console.error("Failed signinRedirect", reason);
      error.value = reason;
    });
}

// only on client side
onMounted(() => {
  getRedirectResult(auth)
    .then(async (user) => {
      if (!user) return;
      await getUserData(user);
    })
    .catch((reason) => {
      console.error("Failed redirect result", reason);
      error.value = reason;
    });
});

const tempUser = ref({ email: "", password: "" });
</script>
<template>
  <section class="login-page">
    <article class="login-page-wrapper">
      <h1 class="title">login</h1>
      <Input
        v-model="tempUser.email"
        type="email"
        name="email"
        label="Email"
        placeholder="Email"
        :errors="{ email: 'Email is required' }"
      />
      <Input
        v-model="tempUser.password"
        type="password"
        name="password"
        label="Password"
        placeholder="Password"
        :errors="{ password: 'Password is required' }"
      />
      <button @click="signinRedirect()">SignIn with Google</button>
    </article>
    <img src="htts://placekitten.com/400/400" alt="kitten" />
  </section>
  <span>{{ error }}</span>
</template>
<style lang="scss" scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr 2fr;
  height: 100vh;
}
</style>
