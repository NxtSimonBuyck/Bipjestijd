<script lang="ts" setup>
defineProps({
  title: { type: String, default: "Modal title" },

  primaryButtonText: { type: String, default: "Save" },
  secondaryButtonText: { type: String, default: "Cancel" },
  width: { type: String, default: "60vw" },
  height: { type: String, default: "75vh" },
});

const emits = defineEmits<{
  onClose: [];
  onPrimaryAction: [];
}>();
</script>
<template>
  <div class="modal-overlay">
    <div class="modal" :style="{ width, height }">
      <slot name="header">
        <header :style="{ width }">
          <h2>{{ title }}</h2>
          <i class="icon fas fa-times" @click="emits('onClose')"></i>
        </header>
      </slot>
      <div class="content">
        <slot></slot>
      </div>
      <slot name="footer">
        <footer>
          <button class="button button--secondary" @click="emits('onClose')">
            {{ secondaryButtonText || "Cancel" }}
          </button>
          <button
            class="button button--primary"
            @click="emits('onPrimaryAction')"
          >
            {{ primaryButtonText || "Save" }}
          </button>
        </footer>
      </slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  z-index: 1000;
  justify-content: center;
  background-color: #00000085;
  color: var(--text-color);
}

.modal {
  background-color: var(--background-color);
  margin: auto;
  border-radius: var(--border-radius);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 5rem;

  padding: var(--spacing) var(--spacing-large);
  position: fixed;

  background-color: var(--background-color);
  border-radius: var(--border-radius) var(--border-radius) 0 0;

  & > h2 {
    font-size: var(--font-size-large);
    font-weight: bold;
  }
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing) var(--spacing-large);
}

.content {
  padding: var(--spacing) var(--spacing-large);
  overflow-y: scroll;
  height: calc(100% - 10rem);
  margin-top: 5rem;
}
</style>
