<script lang="ts" setup>
defineProps({
  active: { type: Boolean, default: false },
});
</script>
<template>
  <li :class="['badge', { '-active': active }]">
    <slot></slot>
  </li>
</template>
<style lang="scss" scoped>
.badge {
  background-color: var(--grey-color);
  border-radius: var(--border-radius);
  width: max-content;
  font-size: var(--font-size-xsmall);

  padding: var(--spacing) var(--spacing-large);

  &.-active {
    background-color: var(--accent-color);

    &:hover {
      background-color: var(--accent-color-dark);
    }
  }

  &:hover {
    cursor: pointer;
    background-color: var(--grey-color-dark);
  }
}
</style>
