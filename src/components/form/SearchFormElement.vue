<script lang="ts" setup>
import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { PropType, computed, onMounted, ref, watch } from "vue";
import { db } from "../../firebase";
import { ErrorObject } from "@vuelidate/core";

const props = defineProps({
  selectedItems: { type: Array, default: () => [] },

  name: { type: String, default: "" },
  title: { type: String, default: "" },
  required: { type: Boolean, default: false },
  errors: { type: Array as PropType<ErrorObject[]>, default: () => [] },

  collectionName: { type: String, default: "" },
  orderBy: { type: String, default: "name" },
});

const error = computed(() => props.errors?.[0]?.$message);
const letters = ref([
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]);
const items = ref([]);
const activeLetterIndex = ref(0);
const disabledLetters = ref([] as Array<string>);

async function checkDisabledItems() {
  letters.value.forEach(async (letter, index) => {
    let q = query(
      collection(db, props.collectionName),
      orderBy(props.orderBy),
      startAt(letter)
    );
    if (index !== letters.value.length - 1) {
      q = query(
        collection(db, props.collectionName),
        orderBy(props.orderBy),
        startAt(letter),
        endBefore(letters.value[index + 1])
      );
    }
    const countSnapshot = await getCountFromServer(q);
    if (countSnapshot.data().count === 0) {
      disabledLetters.value.push(letter);
    }
  });
}

onMounted(async () => {
  await checkDisabledItems();
  // TODO: check first available letter
  const q = query(
    collection(db, props.collectionName),
    orderBy(props.orderBy),
    startAt(letters.value[0]),
    endBefore(letters.value[1])
  );
  getDocs(q).then((data) => {
    items.value = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  });
});

watch(activeLetterIndex, (newValue) => {
  let q = query(
    collection(db, props.collectionName),
    orderBy(props.orderBy),
    startAt(letters.value[newValue])
  );
  if (newValue !== letters.value.length - 1)
    q = query(
      collection(db, props.collectionName),
      orderBy(props.orderBy),
      startAt(letters.value[newValue]),
      endBefore(letters.value[newValue + 1])
    );
  getDocs(q).then((data) => {
    items.value = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  });
});
</script>
<template>
  <div
    :class="[
      'search-form-element',
      { '-danger': error, '-required': required },
    ]"
  >
    <input
      class="visually-hidden"
      type="text"
      :required="required"
      :name="name"
      :value="selectedItems.map((i) => i?.name)"
    />
    <h2>
      <span class="label">{{ title }}</span>
      <span v-if="error" class="error">{{ error }}</span>
    </h2>
    <div class="search-form-element-content">
      <ul class="letter-list">
        <li
          v-for="(letter, index) in letters"
          :key="letter"
          :class="[
            'letter',
            {
              '-active': activeLetterIndex === index,
              '-disabled': disabledLetters.includes(letter),
            },
          ]"
          @click="activeLetterIndex = index"
        >
          {{ letter }}
        </li>
      </ul>
      <div class="search-form-element-content-slot">
        <KeepAlive :max="26">
          <slot name="list" v-bind="{ items }"></slot>
        </KeepAlive>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.search-form-element {
  margin-top: var(--spacing-large);

  &.-required {
    .label::after {
      margin-right: var(--spacing-small);
      content: "*";
      color: var(--error-color);
    }
  }

  &-content-slot {
    margin-top: var(--spacing-small);
  }
}

.letter-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-small);

  margin-top: var(--spacing-small);
}

.letter {
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all 0.2s ease-in-out;

  text-align: center;
  font-size: var(--font-size-xsmall);

  &.-active {
    color: var(--accent-color);
    text-decoration: underline;

    &:hover {
      color: var(--accent-color-dark);
    }
  }

  &.-disabled {
    opacity: 0.3;
    cursor: not-allowed;

    &:hover {
      color: var(--text-color);
    }
  }

  &:hover {
    color: var(--accent-color-light);
  }
}
</style>
