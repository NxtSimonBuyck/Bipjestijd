<script lang="ts" setup>
import OverviewPage from "../../components/layout/overview/OverviewPage.vue";

// TODO: get overview data from firebase use filters and paging

// write the function getOverviewData here
// the function should be called when the OverviewPage component emits the event "on-get-overview-data"
// it should get the data from firebase and set the data to the property "items"\
// the query should be paginated using the "limit" and "startAfter" methods of firebase, the paging should also work if the user selects a page +2 higher than the current page
// the query should be filtered using the "where" method of firebase, the filter should be applied if the user selects a filter
// the query should be sorted using the "orderBy" method of firebase, the sorting should be applied on the "releaseYear" field
// start writing
import { ref } from "vue";
import { Cinema } from "../../core/store/cinema/cinema.interface";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Filter } from "../../core/store/filter.interface";
import { db } from "../../firebase";
import { CinemaMapper } from "../../core/helpers/mapper.helper";

const items = ref([] as Cinema[]);
const firebaseQuery = ref();

const getOverviewData = async (filters: Filter) => {
  const activeCollection =
    filters.collection === "movies"
      ? collection(db, "movies")
      : collection(db, "series");

  const searchQueries = [];
  if (filters.genres.length) {
    searchQueries.push(
      where(
        "genres",
        "array-contains-any",
        filters.genres.map((genre) => doc(db, "genres", genre.id))
      )
    );
  }
  searchQueries.push(orderBy("releaseYear", "desc"));
  searchQueries.push(limit(filters.perPage));

  limit(filters.perPage);
  firebaseQuery.value = query(activeCollection, ...searchQueries);

  const snapshot = await getDocs(firebaseQuery.value);

  const data = await Promise.all(
    snapshot.docs.map(async (doc) => await CinemaMapper(doc))
  );
  items.value = data.filter((item) => !!item) as Cinema[];
};
</script>
<template>
  <OverviewPage
    :slug="'cinema'"
    :items="items"
    :firebase-query="firebaseQuery"
    @on-get-overview-data="getOverviewData"
  />
</template>
<style lang="css" scoped></style>
