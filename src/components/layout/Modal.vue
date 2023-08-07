<script lang="ts" setup>
defineProps({
  title: { type: String, default: "Modal title" },

  primaryButtonText: { type: String, default: "Save" },
  secondaryButtonText: { type: String, default: "Cancel" },
});

const emits = defineEmits<{
  onClose: [];
  onPrimaryAction: [];
}>();
</script>
<template>
  <div class="modal-overlay">
    <div class="modal">
      <slot name="header">
        <div>
          <header>
            <h2>{{ title }}</h2>
            <i class="icon fas fa-times" @click="emits('onClose')"></i>
          </header>
        </div>
      </slot>
      <div class="content">
        <slot></slot>
      </div>
      <slot name="footer">
          <footer>
            <p class="button button--secondary" @click="emits('onClose')">Cancel</p>
            <p class="button button--primary" @click="emits('onPrimaryAction')">Save</p>
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
  justify-content: center;
  background-color: #000000da;
  color: var(--text-color);
}

.modal {
  background-color: var(--background-color);
  height: 75vh;
  width: 60vw;
  margin: auto;
  border-radius: var(--border-radius);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 60vw;
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
  height: calc(75vh - 5rem - 5rem);
  margin-top: 5rem;
}
</style>
