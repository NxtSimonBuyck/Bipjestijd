<script lang="ts">
import { maska } from 'maska';
import { defineComponent, PropType } from 'vue';
import NxtHoverCard from '../layout-elements/NxtHoverCard.vue';

export default defineComponent({
   name: 'NxtInput',

   components: { NxtHoverCard },

   emits: ['update:modelValue', 'on-enter', 'onBlur', 'onFocus', 'onClickIcon'],

   directives: { maska },

   props: {
      type: { type: String, default: 'text' },
      name: { type: String, default: null, required: true },
      label: { type: String, default: '' },
      placeholder: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      minLength: { type: Number, default: null },
      maxLength: { type: Number, default: null },
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      title: { type: String, default: '' },

      labelIconClass: { type: String, default: null },
      labelIconColor: { type: String, default: 'var(--nxt-dark)' },
      labelIconHoverText: { type: String, default: '' },

      modelValue: { type: [String, Number], default: '' },
      modelModifiers: { type: Object, default: () => ({}) },

      errors: { type: Object, default: () => ({}) },
      description: { type: String, default: '' },

      mask: { type: [String, Object], default: null },
      mode: { type: String, default: 'default', validator: (value: string) => ['default', 'light'].includes(value) },

      variables: { type: Array as PropType<Array<{ id: number; name: string; description: string }>>, default: () => [] },

      iconClass: { type: String, default: null },
      iconColor: { type: String, default: 'var(--nxt-dark)' },
      iconHoverText: { type: String, default: '' },

      tabindex: { type: [String, Number], default: 0 },
   },

   data() {
      return {
         lastCursorPosition: 0,
      };
   },

   computed: {
      error() {
         return this.errors?.[this.name];
      },
   },

   methods: {
      handleInput(event: Event) {
         if (this.modelModifiers?.lazy) return;
         this.$emit('update:modelValue', (event?.target as HTMLInputElement)?.value);
      },
      handleChange(event: Event) {
         if (!this.modelModifiers?.lazy) return;
         this.$emit('update:modelValue', (event?.target as HTMLInputElement)?.value);
      },
      insertVariable(variable: { id: number; name: string; description: string }) {
         if (typeof this.modelValue === 'string') {
            const newModelValue = `${this.modelValue.slice(0, this.lastCursorPosition).trimEnd()} ${variable.name} ${this.modelValue
               .slice(this.lastCursorPosition)
               .trimStart()}`;
            this.$emit('update:modelValue', newModelValue);
            this.$nextTick(() => {
               let inputElement = document.getElementById(this.name) as HTMLInputElement;
               this.lastCursorPosition = this.lastCursorPosition + variable.name.length + 1;
               inputElement?.setSelectionRange(this.lastCursorPosition, this.lastCursorPosition);
               inputElement?.focus();
            });
         }
      },
      setLastCursorPosition(event: Event) {
         if (typeof this.modelValue === 'string') {
            this.lastCursorPosition = (event.target as HTMLInputElement)?.selectionStart || this.modelValue.trimEnd().length + 1;
         }
         this.$emit('onBlur', event);
      },
   },
});
</script>

<template>
   <div :class="['nxt-form-group', { '-danger': !!error, '-required': required, '-disabled': disabled }]">
      <label v-if="label" :for="name" class="nxt-form-group__label">
         {{ label }}
         <slot name="icon">
            <NxtHoverCard v-if="labelIconHoverText" :with-triangle="false" :is-card-hoverable="true">
               <template #hover-item>
                  <i :class="labelIconClass" :style="{ color: labelIconColor }" />
               </template>

               <span>
                  {{ labelIconHoverText }}
               </span>
            </NxtHoverCard>
            <i v-else :class="labelIconClass" :style="{ color: labelIconColor }" />
         </slot>
      </label>

      <div class="nxt-input">
         <input
            v-maska="mask"
            :type="type"
            :class="[
               'nxt-form-group__input',
               'nxt-input__input',
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
         <div v-if="iconClass" :class="['nxt-input__icon', `-${mode}`]">
            <slot name="icon">
               <i></i>
            </slot>
         </div>
      </div>

      <div v-if="variables.length > 0" class="nxt-input__variables">
         <NxtHoverCard v-for="variable in variables" :key="variable.id" :align="'center'" :clickable="false">
            <template #hover-item>
               <button class="nxt-input__variable" @click="insertVariable(variable)">
                  <small>{{ variable.name }}</small>
               </button>
            </template>
            {{ variable.description }}
         </NxtHoverCard>
      </div>

      <small v-if="error || description" :class="['nxt-form-group__info', { '-danger': !!error }]">
         <span v-if="error">{{ error }}</span>
         <span v-else-if="description">{{ description }}</span>
      </small>
   </div>
</template>

<style lang="scss">
.nxt-input {
   display: flex;
   position: relative;
   align-items: center;
}

.nxt-input__input {
   flex: 1;
   &.-right-indented {
      padding-right: calc(toRem(12) * 2 + toRem(16));
   }
}

.nxt-input__icon {
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

.nxt-input__variables {
   display: flex;
   flex-wrap: wrap;
   gap: var(--nxt-gutter-small);
}

.nxt-input__variable {
   padding: 0.5rem;
   background-color: var(--nxt-extralight-grey);
   height: toRem(25);
   color: var(--nxt-dark);
}
</style>
