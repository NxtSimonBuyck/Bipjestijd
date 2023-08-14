<script lang="ts" setup>
import {
  UserCredential,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { computed, onMounted, reactive, ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import { GoogleAuthProvider } from "firebase/auth";
import Input from "../components/form/Input.vue";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
const googleAuthProvider = new GoogleAuthProvider();

const auth = useFirebaseAuth()!; // only exists on client side

async function getUserData(user: UserCredential) {
  const docRef = doc(db, "users", user.user.uid);
  const docSnap = await getDoc(docRef);

  console.log("docSnap", docSnap);

  if (!docSnap.exists()) {
  }
}

// display errors if any
const error = ref();
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

const tempUser = reactive({ email: "", password: "" });
const rules = computed(() => ({
  email: { required, email },
  password: { required },
}));
const v$ = useVuelidate(rules, tempUser);

async function handleSignIn() {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  // sign in with email and password
  signInWithEmailAndPassword(auth, tempUser.email, tempUser.password)
    .then(async (user) => {
      console.log("user", user);
      await getUserData(user);
    })
    .catch((reason) => {
      switch (reason.code) {
        case "auth/invalid-email":
          error.value = "Invalid email";
          break;
        case "auth/user-disabled":
          error.value = "User disabled";
          break;
        case "auth/user-not-found":
          error.value = "User not found";
          break;
        case "auth/wrong-password":
          error.value = "Wrong password";
          break;
        default:
          error.value = "Something went wrong";
      }
    });
}

async function handleSignUp() {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  createUserWithEmailAndPassword(auth, tempUser.email, tempUser.password)
    .then(async (user) => {
      console.log("user", user);
      await getUserData(user);
    })
    .catch((reason) => {
      switch (reason.code) {
        case "auth/email-already-in-use":
          error.value = "Email already in use";
          break;
        case "auth/invalid-email":
          error.value = "Invalid email";
          break;
        case "auth/operation-not-allowed":
          error.value = "Operation not allowed";
          break;
        case "auth/weak-password":
          error.value = "Weak password";
          break;
        default:
          error.value = "Something went wrong";
      }
    });
}

const mode = ref<"signin" | "signup">("signin");
</script>
<template>
  <section class="login-page">
    <article class="login-page-wrapper">
      <div class="login-form">
        <h1 class="title">{{ mode === "signin" ? "Login" : "Register" }}</h1>
        <Input
          v-model="tempUser.email"
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          :errors="v$.email.$errors"
        />
        <Input
          v-model="tempUser.password"
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          :errors="v$.password.$errors"
        />

        <span v-if="error" class="error">{{ error }}</span>
        <div class="login-actions">
          <button
            v-if="mode === 'signin'"
            class="button button--primary"
            @click="handleSignIn"
          >
            Sign in
          </button>
          <button
            v-if="mode === 'signup'"
            class="button button--primary"
            @click="handleSignUp"
          >
            Sign up
          </button>
          <p class="button--link" @click="mode = 'signup'">Forgot password?</p>
        </div>
      </div>
      <!-- TODO: add facebook functionality -->
      <div class="other-logins">
        <p>Other login options:</p>
        <ul class="login-options">
          <li>
            <i class="icon fab fa-google" @click="signinRedirect"></i>
          </li>
          <!-- <li>
            <i class="icon fab fa-facebook" @click="signinRedirect"></i>
          </li> -->
        </ul>
      </div>
      <p v-if="mode === 'signin'">
        No account yet?
        <span class="button--link" @click="mode = 'signup'">Register</span>
      </p>
      <p v-if="mode === 'signup'">
        Already have an account?
        <span class="button--link" @click="mode = 'signin'">Sign in</span>
      </p>
    </article>
    <!-- random img -->
    <img class="cover-img" src="http://placekitten.com/400/400" alt="kitten" />
  </section>
  <span>{{ error }}</span>
</template>
<style lang="scss" scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr 2fr;
  height: 100vh;

  &-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.cover-img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 300px;
  gap: var(--spacing-large);

  margin-bottom: var(--spacing-xlarge);

  .title {
    font-size: var(--font-size-large);
    font-weight: 700;
  }
}

.login-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.other-logins {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-large);

  margin-bottom: var(--spacing-xlarge);
}

.login-options {
  display: flex;
  gap: var(--spacing-large);
}
</style>
