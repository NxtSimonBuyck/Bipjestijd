<script lang="ts" setup>
import { PropType } from "vue";
import { useCollection } from "vuefire";
import { db } from "../../../firebase";
import { collection } from "firebase/firestore";
import Modal from "../../layout/Modal.vue";

const genres = useCollection(collection(db, "genres"));

const props = defineProps({
  type: { type: String as PropType<"movies" | "series">, default: "movies" },
});
</script>
<template>
  <Modal>
    {{ genres }}
  </Modal>
</template>
<style lang="scss" scoped></style>
