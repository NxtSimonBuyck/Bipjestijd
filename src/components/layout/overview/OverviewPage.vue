<script lang="ts" setup>
import { PropType, computed, onMounted, provide, ref, toRef, watch } from "vue";
import OverviewFilters from "./OverviewFilters.vue";
import OverviewList from "./OverviewList.vue";
import { db } from "../../../firebase";
import {
  Query,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Cinema } from "../../../core/store/cinema/cinema.interface";
import { watchDebounced } from "@vueuse/core";
import CinemaForm from "../../../pages/Cinema/cinema-form/CinemaForm.vue";
import OverviewPaging from "./OverviewPaging.vue";
import { useStore } from "../../../core/hooks/useStore";
import { SlugTypes } from "../../../core/store/slug.interface";
import { User } from "../../../core/store/user/user.interface";
import { Filter } from "../../../core/store/filter.interface";

const emits = defineEmits<{
  onGetOverviewData: [filters: Filter];
}>();

const props = defineProps({
  slug: { type: String as PropType<SlugTypes>, default: "" },
  items: { type: Array as PropType<Cinema[]>, default: [] },
  firebaseQuery: { type: Object as PropType<Query>, default: () => ({}) },
});
const slug = toRef(props, "slug");
provide("slug", slug);

onMounted(async () => {
  await getItems();
  await getPageAmount();
});

const { state } = useStore();
const user = computed(() => state.user as User);

// #region filters
const activeCollection = ref<"movies" | "series">("movies");
provide("activeCollection", activeCollection);

const currentPage = ref("1");
provide("currentPage", currentPage);
const lastPage = ref("1");
provide("lastPage", lastPage);
const perPage = ref("10");
provide("perPage", perPage);
const filters = ref({
  genres: [],
});
provide("filters", filters);

watch(
  () => perPage.value,
  async () => {
    await getItems(true);
  }
);

watch(filters.value, async () => {
  await getItems(true);
});
// #endregion

// #region pagination
const activeCollectionRef = computed(() => {
  return activeCollection.value === "movies"
    ? collection(db, "movies")
    : collection(db, "series");
});

async function getPageAmount() {
  console.log("props.firebaseQuery", props.firebaseQuery);
  if (Object.keys(props.firebaseQuery).length) {
    const snapshot = await getCountFromServer(props.firebaseQuery);
    lastPage.value = `${Math.ceil(
      snapshot.data().count / (+perPage.value || 20)
    )}`;
  } else {
    const snapshot = await getCountFromServer(activeCollectionRef.value);
    lastPage.value = `${Math.ceil(
      snapshot.data().count / (+perPage.value || 20)
    )}`;
  }
}

watch(activeCollection, async () => {
  await getItems(true);
  await getPageAmount();
});

// TODO: refactor paging to use cursor instead of page number (https://firebase.google.com/docs/firestore/query-data/query-cursors)

const getItems = async (resetPage?: boolean) => {
  await getPageAmount();
  const filter = {
    ...filters.value,
    currentPage: +currentPage.value,
    perPage: +perPage.value,
    collection: activeCollection.value,
  } as Filter;

  if (resetPage) {
    filter.currentPage = 1;
    currentPage.value = "1";
  }
  emits("onGetOverviewData", filter);
};
// #endregion

// #region CREATE cinema
const showCreateForm = ref(false);
function openCreateForm() {
  showCreateForm.value = !showCreateForm.value;
}
// #endregion

// #region handle save cinema to user
async function handleSaveItem(item: Cinema) {
  const userSavedDocRef = doc(
    db,
    `users/${user.value.id}/saved`,
    user.value.savedCollectionId
  );
  const userSavedDoc = await getDoc(userSavedDocRef);

  switch (activeCollection.value) {
    case "movies":
      if (!!userSavedDoc.data()?.movies.find((m: any) => m.id === item.id)) {
        state.user.saved.movies = state.user.saved.movies.filter(
          (m: any) => m.id !== item.id
        );
        await updateDoc(userSavedDocRef, {
          movies: [
            ...userSavedDoc.data()?.movies.filter((m: any) => m.id !== item.id),
          ],
        });
      } else {
        state.user.saved.movies.push(item);
        await updateDoc(userSavedDocRef, {
          movies: [
            ...userSavedDoc.data()?.movies,
            doc(activeCollectionRef.value, item.id),
          ],
        });
      }
      break;
    case "series":
      if (!!userSavedDoc.data()?.series.find((m: any) => m.id === item.id)) {
        state.user.saved.series = state.user.saved.series.filter(
          (m: any) => m.id !== item.id
        );
        await updateDoc(userSavedDocRef, {
          series: [
            ...userSavedDoc.data()?.series.filter((m: any) => m.id !== item.id),
          ],
        });
      } else {
        state.user.saved.series.push(item);
        await updateDoc(userSavedDocRef, {
          series: [
            ...userSavedDoc.data()?.series,
            doc(activeCollectionRef.value, item.id),
          ],
        });
      }
      break;
  }
}
// #endregion
// #region handle like cinema to user
async function handleLikeItem(item: Cinema) {
  const userLikedDocRef = doc(
    db,
    `users/${user.value.id}/liked`,
    user.value.likedCollectionId
  );
  const userLikedDoc = await getDoc(userLikedDocRef);

  switch (activeCollection.value) {
    case "movies":
      if (!!userLikedDoc.data()?.movies.find((m: any) => m.id === item.id)) {
        state.user.liked.movies = state.user.liked.movies.filter(
          (m: any) => m.id !== item.id
        );
        await updateDoc(userLikedDocRef, {
          movies: [
            ...userLikedDoc.data()?.movies.filter((m: any) => m.id !== item.id),
          ],
        });
      } else {
        state.user.liked.movies.push(item);
        await updateDoc(userLikedDocRef, {
          movies: [
            ...userLikedDoc.data()?.movies,
            doc(activeCollectionRef.value, item.id),
          ],
        });
      }
      break;
    case "series":
      if (!!userLikedDoc.data()?.series.find((m: any) => m.id === item.id)) {
        state.user.liked.series = state.user.liked.series.filter(
          (m: any) => m.id !== item.id
        );
        await updateDoc(userLikedDocRef, {
          series: [
            ...userLikedDoc.data()?.series.filter((m: any) => m.id !== item.id),
          ],
        });
      } else {
        state.user.liked.series.push(item);
        await updateDoc(userLikedDocRef, {
          series: [
            ...userLikedDoc.data()?.series,
            doc(activeCollectionRef.value, item.id),
          ],
        });
      }
      break;
  }
}
// #endregion
// #region handle seen cinema to user
async function handleSeenItem(item: Cinema) {
  const userSeenDocRef = doc(
    db,
    `users/${user.value.id}/seen`,
    user.value.seenCollectionId
  );
  const userSeenDoc = await getDoc(userSeenDocRef);

  switch (activeCollection.value) {
    case "movies":
      if (!!userSeenDoc.data()?.movies.find((m: any) => m.id === item.id)) {
        state.user.seen.movies = state.user.seen.movies.filter(
          (m: any) => m.id !== item.id
        );
        await updateDoc(userSeenDocRef, {
          movies: [
            ...userSeenDoc.data()?.movies.filter((m: any) => m.id !== item.id),
          ],
        });
      } else {
        state.user.seen.movies.push(item);
        await updateDoc(userSeenDocRef, {
          movies: [
            ...userSeenDoc.data()?.movies,
            doc(activeCollectionRef.value, item.id),
          ],
        });
      }
      break;
    case "series":
      if (!!userSeenDoc.data()?.series.find((m: any) => m.id === item.id)) {
        state.user.seen.series = state.user.seen.series.filter(
          (m: any) => m.id !== item.id
        );
        await updateDoc(userSeenDocRef, {
          series: [
            ...userSeenDoc.data()?.series.filter((m: any) => m.id !== item.id),
          ],
        });
      } else {
        state.user.seen.series.push(item);
        await updateDoc(userSeenDocRef, {
          series: [
            ...userSeenDoc.data()?.series,
            doc(activeCollectionRef.value, item.id),
          ],
        });
      }
      break;
  }
}
// #endregion
</script>
<template>
  <div class="overview-page">
    <OverviewFilters :active-collection="activeCollection" />

    <div class="overview-page__content">
      <slot name="content">
        <OverviewList
          :items="items"
          :active-collection="activeCollection"
          @on-seen-item="handleSeenItem"
          @on-like-item="handleLikeItem"
          @on-save-item="handleSaveItem"
        />
      </slot>
    </div>
    <OverviewPaging />
    <i v-if="slug !== 'watchlist'" class="add-button icon -active fas fa-add" @click="openCreateForm"></i>
    <CinemaForm
      v-if="showCreateForm"
      :type="activeCollection"
      @close="openCreateForm"
    />
  </div>
</template>
<style lang="css" scoped>
.overview-page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 98px 1fr 64px;
  height: 100vh;
  padding-right: var(--spacing-xlarge);
}

.add-button {
  position: absolute;
  z-index: 10;
  bottom: calc(64px + 16px);
  right: var(--spacing-large);
}
</style>
