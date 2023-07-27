<script lang="ts" setup>
const props = defineProps({
  label: { type: String, default: "" },
  placeholder: { type: String, default: "Zoeken" },
  modelValue: { type: String, default: "" },
});
const emits = defineEmits<{
  "update:modelValue": [value: string];
}>();

function handleInput(event: Event) {
  emits("update:modelValue", (event?.target as HTMLInputElement)?.value);
}
function handleChange(event: Event) {
  emits("update:modelValue", (event?.target as HTMLInputElement)?.value);
}
</script>
<template>
  <!-- create a input field with label and placeholder -->
  <div class="input">
    <label for="input" class="input__label">{{ label }}</label>
    <input
      type="text"
      id="input"
      class="input__field"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @change="handleChange"
    />
  </div>
</template>
<style lang="scss" scoped></style>
