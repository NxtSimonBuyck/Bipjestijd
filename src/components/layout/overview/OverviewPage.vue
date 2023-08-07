<script lang="ts" setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import OverviewFilters from "./OverviewFilters.vue";
import OverviewList from "./OverviewList.vue";
import { db } from "../../../firebase";
import {
  collection,
  endAt,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { Cinema } from "../../../core/store/cinema/cinema.interface";
import { watchDebounced } from "@vueuse/core";
import CinemaForm from "../../../pages/Cinema/cinema-form/CinemaForm.vue";

onMounted(async () => {
  await getItems();
});

// #region filters
const activeCollection = ref<"movies" | "series">("movies");
provide("activeCollection", activeCollection);

const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(2);
const filters = ref({
  search: "",
  genres: [],
});
provide("filters", filters);

watch(currentPage, async (newValue, oldValue) => {
  const type = newValue > oldValue ? "next" : "prev";
  await getItems(false, type);
});

watch(perPage, async () => {
  await getItems(true);
});

watchDebounced(
  filters.value,
  async () => {
    console.log("debounced", filters.value);
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

watch(activeCollection, async () => {
  await getItems(true);

  const snapshot = await getCountFromServer(activeCollectionRef.value);
  lastPage.value = Math.ceil(snapshot.data().count / (perPage.value || 25));
});

const getItems = async (resetPage?: boolean, type?: "prev" | "next") => {
  let q = query(
    activeCollectionRef.value,
    orderBy("releaseYear", "desc"),
    limit(perPage.value || 25)
  );
  if (!!lastVisibleItem.value && !resetPage && type === "next") {
    q = query(
      activeCollectionRef.value,
      orderBy("releaseYear", "desc"),
      startAfter(lastVisibleItem.value),
      limit(perPage.value || 25)
    );
  }
  if (!!firstVisibleItem.value && !resetPage && type === "prev") {
    q = query(
      activeCollectionRef.value,
      orderBy("releaseYear", "desc"),
      endAt(firstVisibleItem.value),
      limit(perPage.value || 25)
    );
  }

  const data = await getDocs(q);
  lastVisibleItem.value = data.docs[data.docs.length - 1];
  firstVisibleItem.value = data.docs[0];

  const mappedItems = await Promise.all(
    data.docs.map(async (doc) => {
      const item = doc.data();
      const genres = await Promise.all(
        item.genres.map(async (doc) => {
          const genre = await getDoc(doc);
          return genre.data();
        })
      );
      const actors = await Promise.all(
        item.actors.map(async (doc) => {
          const actor = await getDoc(doc);
          return actor.data();
        })
      );
      const directors = await Promise.all(
        item.directors.map(async (doc) => {
          const director = await getDoc(doc);
          return director.data();
        })
      );
      return {
        ...item,
        genres,
        actors,
        directors,
      };
    })
  );

  items.value = mappedItems;
};

function setPage(page: number) {
  currentPage.value = page;
}
// #endregion

// #region CREATE cinema
const showCreateForm = ref(false);
function openCreateForm() {
  console.log("openCreateForm");
  showCreateForm.value = !showCreateForm.value;
}
// #endregion
</script>
<template>
  <div class="overview-page">
    <OverviewFilters :active-collection="activeCollection" />

    <div class="overview-page__content">
      <OverviewList :items="items"></OverviewList>
    </div>
    <div>
      <p @click="setPage(1)">1</p>
      <p @click="setPage(2)">2</p>
    </div>
    <span @click="openCreateForm"><i class="fas fa-add"></i></span>
    <CinemaForm v-if="showCreateForm" :type="activeCollection" @close="openCreateForm" />
  </div>
</template>
<style lang="css" scoped>
.overview-page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto 1fr;
  max-height: 100vh;
}
</style>
