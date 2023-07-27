<script lang="ts" setup>
import Header from "../components/layout/Header.vue";
</script>
<template>
  <Header />
  <KeepAlive :max="10">
    <RouterView></RouterView>
  </KeepAlive>
</template>
<style lang="css" scoped></style>
