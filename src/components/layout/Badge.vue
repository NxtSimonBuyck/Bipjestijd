<script lang="ts" setup></script>
<template>
  <li class="badge">
    <slot></slot>
  </li>
</template>
<style lang="css" scoped>
.badge {
  background-color: rgb(232, 250, 255);
  border-radius: var(--border-radius);
  width: max-content;

  padding: var(--spacing) var(--spacing-large);
}
</style>