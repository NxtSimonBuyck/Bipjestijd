<script lang="ts" setup>
import { computed, PropType, ref } from "vue";

const emits = defineEmits<{
  "update:modelValue": [value: string];
  "on-enter": [event: Event];
  onBlur: [event: Event];
  onFocus: [event: Event];
  onClickIcon: [event: Event];
}>();

const props = defineProps({
  type: { type: String, default: "text" },
  name: { type: String, default: null, required: true },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  minLength: { type: Number, default: null },
  maxLength: { type: Number, default: null },
  min: { type: Number, default: null },
  max: { type: Number, default: null },
  title: { type: String, default: "" },

  labelIconClass: { type: String, default: null },
  //   TODO: change to labelIconColor
  labelIconColor: { type: String, default: "#000" },
  labelIconHoverText: { type: String, default: "" },

  modelValue: { type: [String, Number], default: "" },
  modelModifiers: { type: Object, default: () => ({}) },

  errors: { type: Object, default: () => ({}) },
  description: { type: String, default: "" },

  mask: { type: [String, Object], default: null },
  mode: {
    type: String,
    default: "default",
    validator: (value: string) => ["default", "light"].includes(value),
  },

  iconClass: { type: String, default: null },
  //   TODO: change to iconColor
  iconColor: { type: String, default: "#000" },
  iconHoverText: { type: String, default: "" },

  tabindex: { type: [String, Number], default: 0 },
});

const error = computed(() => props.errors?.[props.name]);
const lastCursorPosition = ref(0);

function handleInput(event: Event) {
  if (props.modelModifiers?.lazy) return;
  emits("update:modelValue", (event?.target as HTMLInputElement)?.value);
}
function handleChange(event: Event) {
  if (!props.modelModifiers?.lazy) return;
  emits("update:modelValue", (event?.target as HTMLInputElement)?.value);
}
function setLastCursorPosition(event: Event) {
  if (typeof props.modelValue === "string") {
    lastCursorPosition.value =
      (event.target as HTMLInputElement)?.selectionStart ||
      props.modelValue.trimEnd().length + 1;
  }
  emits("onBlur", event);
}
</script>

<template>
  <div
    :class="[
      'group',
      { '-danger': !!error, '-required': required, '-disabled': disabled },
    ]"
  >
    <label v-if="label" :for="name" class="group__label">
      {{ label }}
      <slot name="icon">
        <i :class="labelIconClass" :style="{ color: labelIconColor }" />
      </slot>
    </label>

    <div class="nxt-input">
      <input
        :type="type"
        :class="[
          'group__input',
          'input__input',
          `-${mode}`,
          { '-danger': !!error, '-right-indented': $slots.icon || iconClass },
        ]"
        :name="name"
        :id="name"
        :value="modelValue"
        :placeholder="placeholder || label"
        :disabled="disabled"
        :required="required"
        :minlength="minLength"
        :maxlength="maxLength"
        :min="min"
        :max="max"
        :title="title"
        :tabindex="tabindex"
        autocomplete="off"
        @input="handleInput"
        @change="handleChange"
        @keydown.enter="(event) => $emit('on-enter', event)"
        @blur="setLastCursorPosition"
        @focus="$emit('onFocus', $event)"
      />
      <div v-if="iconClass" :class="['input__icon', `-${mode}`]">
        <slot name="icon">
          <i></i>
        </slot>
      </div>
    </div>

    <small v-if="error || description">
      <span v-if="error">{{ error }}</span>
      <span v-else-if="description">{{ description }}</span>
    </small>
  </div>
</template>

<style lang="scss">
.input {
  display: flex;
  position: relative;
  align-items: center;
}

.input__input {
  flex: 1;
  &.-right-indented {
    padding-right: calc(toRem(12) * 2 + toRem(16));
  }
}

.input__icon {
  position: absolute;
  right: 1px;
  border-radius: var(--nxt-radius);
  display: flex;
  align-items: center;
  background-color: var(--nxt-extralight-grey);
  padding: toRem(7) toRem(12);
  &.-light {
    background: #ffffff;
  }
}
</style>
