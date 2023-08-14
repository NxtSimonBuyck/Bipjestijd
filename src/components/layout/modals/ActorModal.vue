<script lang="ts" setup>
import Modal from "../Modal.vue";
import Input from "../../form/Input.vue";
import { reactive } from "vue";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const emits = defineEmits<{
  onClose: [];
}>();

const state = reactive({
  actorName: "",
});
const rules = {
  actorName: { required },
};
const v$ = useVuelidate(rules, state);

async function handleCreateActor() {
  console.log(state.actorName);
  const isValid = await v$.value.$validate();

  if (!isValid) {
    return;
  }

  const actorKey = state.actorName.toLowerCase().replace(/\s/g, "-");
  console.log(actorKey);

  const actor = {
    key: actorKey,
    name: state.actorName,
  };

  addDoc(collection(db, "actors"), actor)
    .then((actor) => {
      console.log("Document successfully written!", actor);
      state.actorName = "";
      emits("onClose");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}
</script>
<template>
  <Modal
    :title="'Add actor'"
    :width="'30vw'"
    :height="'25vh'"
    :primary-button-text="'Add'"
    @on-primary-action="handleCreateActor"
    @on-close="emits('onClose')"
  >
    <template #default>
      <Input
        v-model="state.actorName"
        :name="'actor-name'"
        :label="'Actor name'"
        :required="true"
        :errors="v$?.actorName?.$errors"
      />
    </template>
  </Modal>
</template>
<style lang="scss" scoped></style>
