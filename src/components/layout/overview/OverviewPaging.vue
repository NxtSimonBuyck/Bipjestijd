<script lang="ts" setup>
import { computed, inject, ref } from "vue";

const perPage = inject("perPage", ref("10"));
const currentPage = inject("currentPage", ref("1"));
const lastPage = inject("lastPage", ref("1"));

// give me current page and next 2 page numbers and previous 2 page numbers if they exist
// if current page is 1, then give me 1, 2, 3, 4
// if current page is 6, then give me 3, 4, 5, 6, 7, 8, 9
// if last page, then give me lastpage -3, lastpage -2, lastpage -1, lastpage
const pages = computed(() => {
  const pages = [];
  const currentPageNumber = parseInt(currentPage.value);
  const lastPageNumber = parseInt(lastPage.value);

  if (currentPageNumber === 1) {
    for (let i = 1; i <= 4; i++) {
      pages.push(i);
    }
  } else if (currentPageNumber === lastPageNumber) {
    for (let i = lastPageNumber - 3; i <= lastPageNumber; i++) {
      pages.push(i);
    }
  } else {
    for (let i = currentPageNumber - 2; i <= currentPageNumber + 2; i++) {
      pages.push(i);
    }
  }

  return pages;
});


</script>
<template>
  <div>
    <ul>
      <li v-for="page in pages" @click="currentPage = `${page}`">{{ page }}</li>
    </ul>
    <div>
      <select v-model="perPage">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
