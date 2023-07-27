<script lang="ts" setup>
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { onMounted, ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import { GoogleAuthProvider } from "firebase/auth";
const googleAuthProvider = new GoogleAuthProvider();

const auth = useFirebaseAuth()!; // only exists on client side

// display errors if any
const error = ref(null);
function signinRedirect() {
  signInWithRedirect(auth, googleAuthProvider).catch((reason) => {
    console.error("Failed signinRedirect", reason);
    error.value = reason;
  });
}

// only on client side
onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    console.error("Failed redirect result", reason);
    error.value = reason;
  });
});
</script>
<template>
  Login/register
  <span>{{ error }}</span>
  <button @click="signinRedirect()">SignIn with Google</button>
</template>
<style lang="css" scoped></style>
