<script lang="ts" setup>
import { getRedirectResult, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { onMounted, ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import { GoogleAuthProvider } from "firebase/auth";
import Input from "../components/form/Input.vue";
const googleAuthProvider = new GoogleAuthProvider();

const auth = useFirebaseAuth()!; // only exists on client side

// display errors if any
const error = ref(null);
function signinRedirect() {
  signInWithPopup(auth, googleAuthProvider)
    .then((user) => {
      console.log(user);
    })
    .catch((reason) => {
      console.error("Failed signinRedirect", reason);
      error.value = reason;
    });
}

// only on client side
onMounted(() => {
  getRedirectResult(auth)
    .then((test) => {
      console.log(test);
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
