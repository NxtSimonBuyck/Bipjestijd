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
import OverviewPaging from "./OverviewPaging.vue";

onMounted(async () => {
  await getItems();
  await getPageAmount();
});

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

async function getPageAmount() {
  const snapshot = await getCountFromServer(activeCollectionRef.value);
  console.log(
    "snapshot",
    `${Math.ceil(snapshot.data().count / (+perPage.value || 20))}`
  );
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

  const mappedItems = await Promise.all(
    data.docs.map(async (doc) => {
      const item = doc.data();
      const genres = await Promise.all(
        item.genres.map(async (doc) => {
          const genre = await getDoc(doc);
          return { id: doc.id, ...genre.data() };
        })
      );
      const actors = await Promise.all(
        item.actors.map(async (doc) => {
          const actor = await getDoc(doc); 
          return { ...actor.data(), id: doc.id };
        })
      );
      const directors = await Promise.all(
        item.directors.map(async (doc) => {
          const director = await getDoc(doc);
          return { ...director.data(), id: doc.id };
        })
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
