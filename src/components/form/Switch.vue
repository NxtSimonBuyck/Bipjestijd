<script lang="ts" setup>
import { PropType } from "vue";

const props = defineProps({
  name: { type: String, default: "switch" },
  label: { type: String, default: "" },
  labelIconClass: { type: String, default: "" },
  labelIconColor: { type: String, default: "" },
  modelValue: { type: [Number, String], default: false },
  options: {
    type: Array as PropType<
      Array<{ id: number | string; title: string; disabled?: boolean }>
    >,
    default: () => [],
  },

  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  uniqueKey: { type: String, default: "id" },
  displayKey: { type: String, default: "title" },
});

const emits = defineEmits<{
  "update:modelValue": [value: number | string];
}>();

function getUniqueKey(option: any) {
  if (!option) return null;
  return props.uniqueKey.split(".").reduce((acc, cur) => acc?.[cur], option);
}
function getDisplayKey(option: any) {
  if (!option) return null;
  return props.displayKey.split(".").reduce((acc, cur) => acc?.[cur], option);
}
function setValue(option: any) {
  emits("update:modelValue", getUniqueKey(option));
}
</script>
<template>
  <div :class="['switch', { '-danger': !!error }]">
    <input
      type="checkbox"
      :name="name"
      :id="name"
      :checked="!!modelValue"
      :disabled="disabled"
      :required="required"
    />

    <label v-if="label" :for="name" class="group__label">
      {{ label }}
      <slot name="icon">
        <i :class="labelIconClass" :style="{ color: labelIconColor }" />
      </slot>
    </label>
    <div class="switch__buttons">
      <button
        v-for="(option, index) in options"
        :key="getUniqueKey(option)"
        :disabled="disabled || option.disabled"
        type="button"
        :class="[
          'switch__button button',
          { 'button--primary': getUniqueKey(option) === modelValue },
        ]"
        :title="option.title"
        @click.stop="setValue(option)"
      >
        <slot name="option" v-bind="{ option, index }">
          <span> {{ getDisplayKey(option) }} </span>
        </slot>
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.switch {
  input {
    height: 0;
    width: 0;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    position: absolute;
  }

  &.-danger {
    .switch__buttons {
      border: 1px solid var(--nxt-red);
    }
  }
}

.switch__buttons {
  background-color: var(--background-color);
  box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: var(--border-radius);
  display: flex;
}

.switch__button {
  border: none;
  outline: none;
  width: 100%;
  height: auto;
  background-color: transparent;
  padding: var(--spacing) var(--spacing-large);
  border-radius: var(--border-radius);
  &:focus,
  &:hover {
    &:not(.nxt-button--primary) {
      background-color: var(--accent-color-dark);
      color: var(--primary-color);
      filter: none;
    }
  }
}

.button {
  

  &:hover:not(.nxt-button--primary) {
    filter: brightness(0.9);
  }
  &:active:not(.nxt-button--primary) {
    filter: brightness(0.8);
  }

  &--primary {
    background-color: var(--accent-color);
    color: var(--primary-color);
    &:hover {
      background-color: var(--accent-color-dark);
    }
  }
}
</style>
