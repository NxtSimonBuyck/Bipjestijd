<script lang="ts" setup>
import { PropType, computed, onMounted, provide, ref, toRef, watch } from "vue";
import OverviewFilters from "./OverviewFilters.vue";
import OverviewList from "./OverviewList.vue";
import { db } from "../../../firebase";
import {
  DocumentData,
  DocumentReference,
  collection,
  doc,
  endAt,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { Cinema } from "../../../core/store/cinema/cinema.interface";
import { watchDebounced } from "@vueuse/core";
import CinemaForm from "../../../pages/Cinema/cinema-form/CinemaForm.vue";
import OverviewPaging from "./OverviewPaging.vue";
import { useStore } from "../../../core/hooks/useStore";
import { Genre } from "../../../core/store/genres/genre.interface";
import { Actor } from "../../../core/store/cinema/actors.interface";
import { Director } from "../../../core/store/cinema/directors.interface";
import { SlugTypes } from "../../../core/store/slug.interface";
import { User } from "../../../core/store/user/user.interface";

const props = defineProps({
  slug: { type: String as PropType<SlugTypes>, default: "" },
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
  search: "",
  genres: [],
});
provide("filters", filters);

watch(currentPage, async (newValue, oldValue) => {
  const type = newValue > oldValue ? "next" : "prev";
  await getItems(false, type);
});

watch(
  () => perPage.value,
  async () => {
    await getItems(true);
  }
);

watchDebounced(filters.value, async () => {
  await getItems(true);
});

watchDebounced(
  filters.value,
  async () => {
    await getItems(true);
  },
  { debounce: 500 }
);
// #endregion

// #region pagination
const activeCollectionRef = computed(() => {
  return activeCollection.value === "movies"
    ? collection(db, "movies")
    : collection(db, "series");
});

const items = ref([] as Cinema[]);
const lastVisibleItem = ref();
const firstVisibleItem = ref();

async function getPageAmount() {
  const snapshot = await getCountFromServer(activeCollectionRef.value);
  lastPage.value = `${Math.ceil(
    snapshot.data().count / (+perPage.value || 20)
  )}`;
}

watch(activeCollection, async () => {
  await getItems(true);
  await getPageAmount();
});

// TODO: refactor paging to use cursor instead of page number (https://firebase.google.com/docs/firestore/query-data/query-cursors)

const getItems = async (resetPage?: boolean, type?: "prev" | "next") => {
  let q = query(
    activeCollectionRef.value,
    orderBy("releaseYear", "desc"),
    limit(+perPage.value || 20)
  );
  if (!!lastVisibleItem.value && !resetPage && type === "next") {
    q = query(
      activeCollectionRef.value,
      orderBy("releaseYear", "desc"),
      startAfter(lastVisibleItem.value),
      limit(+perPage.value || 20)
    );
  }
  if (!!firstVisibleItem.value && !resetPage && type === "prev") {
    q = query(
      activeCollectionRef.value,
      orderBy("releaseYear", "desc"),
      endAt(firstVisibleItem.value),
      limit(+perPage.value || 20)
    );
  }

  const data = await getDocs(q);
  lastVisibleItem.value = data.docs[data.docs.length - 1];
  firstVisibleItem.value = data.docs[0];

  // TODO: refactor to use batch get (https://firebase.google.com/docs/firestore/query-data/queries#batched-queries)
  const mappedItems = await Promise.all(
    data.docs.map(async (doc) => {
      const item = doc.data();
      const genres = await Promise.all<Genre>(
        item.genres.map(async (doc: DocumentReference<Genre, DocumentData>) => {
          const genre = await getDoc(doc);
          return { id: doc.id, ...genre.data() };
        })
      );
      const actors = await Promise.all<Actor>(
        item.actors.map(async (doc: DocumentReference<Actor, DocumentData>) => {
          const actor = await getDoc(doc);
          return { ...actor.data(), id: doc.id };
        })
      );
      const directors = await Promise.all<Director>(
        item.directors.map(
          async (doc: DocumentReference<Director, DocumentData>) => {
            const director = await getDoc(doc);
            return { ...director.data(), id: doc.id };
          }
        )
      );
      return {
        ...item,
        id: doc.id,
        genres,
        actors,
        directors,
      };
    })
  );

  items.value = mappedItems;
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
      <OverviewList
        :items="items"
        :active-collection="activeCollection"
        @on-seen-item="handleSeenItem"
        @on-like-item="handleLikeItem"
        @on-save-item="handleSaveItem"
      />
    </div>
    <OverviewPaging />
    <i class="add-button icon -active fas fa-add" @click="openCreateForm"></i>
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
  bottom: calc(64px + 16px);
  right: var(--spacing-large);
}
</style>
