<script lang="ts" setup>
import { PropType, computed, onMounted, reactive, ref, watch } from "vue";
import Modal from "../../../components/layout/Modal.vue";
import Input from "../../../components/form/Input.vue";
import Badge from "../../../components/layout/Badge.vue";
import { Genre } from "../../../core/store/genres/genre.interface";
import { Actor } from "../../../core/store/cinema/actors.interface";
import { Director } from "../../../core/store/cinema/directors.interface";
import SearchFormElement from "../../../components/form/SearchFormElement.vue";
import Switch from "../../../components/form/Switch.vue";
import { CoverTypeKey } from "../../../core/store/cinema/cinema.interface";
import { ref as storageRef } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";

defineProps({
  type: { type: String as PropType<"movies" | "series">, default: "movies" },
});
const emits = defineEmits<{
  close: [];
}>();

const cinemaType = ref("movies");

function handleAddGenre(genre: Genre) {
  if (!!state.genres.find((item) => item.key === genre.key)) {
    const index = state.genres.findIndex((item) => item.key === genre.key);
    state.genres.splice(index, 1);
    return;
  } else {
    state.genres.push(genre);
  }
}

function handleAddActor(actor: Actor) {
  if (!!state.actors.find((item) => item.key === actor.key)) {
    const index = state.actors.findIndex((item) => item.key === actor.key);
    state.actors.splice(index, 1);
    return;
  } else {
    state.actors.push(actor);
  }
}
// #endregion

// #region directors
function handleAddDirector(director: Director) {
  if (!!state.directors.find((item) => item.key === director.key)) {
    const index = state.directors.findIndex(
      (item) => item.key === director.key
    );
    state.directors.splice(index, 1);
    return;
  } else {
    state.directors.push(director);
  }
}
// #endregion

// #region form
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, numeric } from "@vuelidate/validators";
import { useCurrentUser, useFirebaseStorage, useStorageFile } from "vuefire";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import ActorModal from "../../../components/layout/modals/ActorModal.vue";

onMounted(async () => {
  state.userId = await useCurrentUser().value!.uid;
});
const state = reactive({
  title: "",
  releaseYear: "",
  genres: [] as Genre[],
  description: "",
  actors: [] as Actor[],
  directors: [] as Director[],
  file: null as File | null,
  cover: "",
  coverType: CoverTypeKey.Internal,
  userId: "",
});

const rules = computed(() => ({
  title: { required },
  releaseYear: { required, numeric, minLength: minLength(4) },
  genres: { required },
  description: { required },
  actors: {},
  directors: {},
  file: { required },
}));
// #endregion

// #region cover
function handleFileChange(e: Event) {
  e.preventDefault();
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  state.file = files[0];
}
// #endregion

// #region submit
const v$ = useVuelidate(rules, state);

const storage = useFirebaseStorage();
function handleUploadFile() {
  const fileName = uuidv4();
  const cinemaCoverRef = storageRef(storage, `covers/${fileName}`);
  const { upload } = useStorageFile(cinemaCoverRef);

  if (!state.file) return;
  upload(state.file);
  state.cover = fileName;
}

async function handleSubmit() {
  const isValid = await v$.value.$validate();

  if (!isValid) return;

  handleUploadFile();
  const newCinema = {
    title: state.title,
    releaseYear: +state.releaseYear,
    genres: (state.genres || []).map((genre) =>
      doc(collection(db, "genres"), genre.id)
    ),
    description: state.description,
    actors: (state.actors || []).map((actor) =>
      doc(collection(db, "actors"), actor.id)
    ),
    directors: (state.directors || []).map((director) =>
      doc(collection(db, "directors"), director.id)
    ),
    cover: state.cover,
    coverType: state.coverType,
    userId: state.userId,
  };

  addDoc(collection(db, cinemaType.value), newCinema)
    .then(() => {
      // TODO: add notification call
      console.log("Document successfully written!");
      emits("close");
    })
    .catch((error) => {
      // TODO: throw error notification
      console.error("Error writing document: ", error);
    });
}
// #endregion

const showActorModal = ref(false);
const showDirectorModal = ref(false);
</script>
<template>
  <Modal
    :title="`Add ${cinemaType === 'movies' ? 'movie' : 'serie'}`"
    @on-primary-action="handleSubmit"
    @on-secondary-action="emits('close')"
    @on-close="emits('close')"
  >
    <Input
      v-model="state.title"
      name="title"
      :required="true"
      label="Title"
      placeholder="Enter title"
      :errors="v$?.title?.$errors"
    />
    <Input
      v-model="state.releaseYear"
      :type="'number'"
      name="releaseYear"
      :required="true"
      label="Year"
      placeholder="Enter year"
      :errors="v$?.releaseYear?.$errors"
    />
    <!-- TODO: change input to new FileInput component -->
    <input
      v-on:change="handleFileChange"
      ref="coverInput"
      name="cover"
      type="file"
      :accept="'image/*'"
      :required="true"
      label="Image"
      placeholder="Enter image"
      :errors="v$?.cover?.$errors"
    />
    <!-- TODO: add  custom input for textarea -->
    <textarea
      v-model="state.description"
      name="description"
      :required="true"
      label="Description"
      placeholder="Enter description"
      :errors="v$?.description.$errors"
    />
    <Switch
      v-model="cinemaType"
      name="cinemaType"
      label="Type"
      :options="[
        { id: 'movies', title: 'Movies' },
        { id: 'series', title: 'Series' },
      ]"
      :required="true"
      :errors="v$?.cinemaType?.$errors"
    ></Switch>
    <Suspense>
      <SearchFormElement
        :title="`Genres: (${state.genres.length} selected)`"
        :collection-name="'genres'"
        :required="true"
        :selected-items="state.genres"
        :errors="v$?.genres.$errors"
      >
        <template #list="{ items }">
          <ul v-if="items.length" class="genres-list">
            <Badge
              v-for="genre in (items as Array<Genre>)"
              :key="genre.id"
              class="genre-badge"
              :active="!!state.genres.find((item) => item.key === genre.key)"
              @click="handleAddGenre(genre)"
            >
              <p>
                {{ genre.name }}
                <i class="fas fa-times"></i>
              </p>
            </Badge>
          </ul>
          <div v-else>
            <p>No results</p>
          </div>
        </template>
      </SearchFormElement>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </Suspense>
    <Suspense>
      <SearchFormElement
        :title="`Actors: (${state.actors.length} selected)`"
        :collection-name="'actors'"
        :selected-items="state.actors"
        :errors="v$?.actors?.$errors"
      >
        <template #list="{ items }">
          <ul v-if="items.length" class="genres-list">
            <Badge
              v-if="items.length"
              v-for="actor in (items as Array<Actor>)"
              :key="actor.id"
              class="genre-badge"
              :active="!!state.actors.find((item) => item.key === actor.key)"
              @click="handleAddActor(actor)"
            >
              <p>
                {{ actor.name }}
                <i class="fas fa-times"></i>
              </p>
            </Badge>
          </ul>
          <div v-else>No results</div>
          <p class="button--link" @click="showActorModal = true">
            <i class="fas fa-add"></i><span> Add actor</span>
          </p>
        </template>
      </SearchFormElement>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </Suspense>
    <Suspense>
      <SearchFormElement
        :title="`Directors: (${state.directors.length} selected)`"
        :collection-name="'directors'"
        :selected-items="state.directors"
        :errors="v$?.directors?.$errors"
      >
        <template #list="{ items }">
          <ul v-if="items.length" class="genres-list">
            <Badge
              v-if="items.length"
              v-for="director in (items as Array<Director>)"
              :key="director.id"
              class="genre-badge"
              :active="
                !!state.directors.find((item) => item.key === director.key)
              "
              @click="handleAddDirector(director)"
            >
              <p>
                {{ director.name }}
                <i class="fas fa-times"></i>
              </p>
            </Badge>
          </ul>
          <p v-else>No results</p>
          <p class="button--link" @click="showActorModal = true">
            <i class="fas fa-add"></i><span> Add director</span>
          </p>
        </template>
      </SearchFormElement>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </Suspense>
    <Transition name="fade">
      <ActorModal v-if="showActorModal" @on-close="showActorModal = false" />
    </Transition>
    <Transition name="fade">
      <DirectorModal
        v-if="showDirectorModal"
        @on-close="showDirectorModal = false"
      />
    </Transition>
  </Modal>
</template>
<style lang="scss" scoped>
.genres-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing);
}

.genre-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-small);

  &.-active > i:hover {
    color: var(--secondary-color);
  }

  i {
    cursor: pointer;

    &:hover {
      color: var(--accent-color);
    }
  }
}

.button--link {
  margin-top: var(--spacing);
}
</style>
