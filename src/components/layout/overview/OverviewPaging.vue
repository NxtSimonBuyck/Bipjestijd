<script lang="ts" setup>
import { computed, inject, ref } from "vue";

const perPage = inject("perPage", ref("10"));
const currentPage = inject("currentPage", ref("1"));
const lastPage = inject("lastPage", ref("1"));

const pages = computed(() => {
  const pages = [];
  const currentPageNumber = parseInt(currentPage.value);
  const lastPageNumber = parseInt(lastPage.value);

  if (currentPageNumber === 1) {
    // check if current page is 1 and render pages not bigger than last page
    for (let i = 1; i <= Math.min(3, lastPageNumber); i++) {
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
  <div class="pages-options">
    <ul class="pages">
      <li
        :class="['page-item', { '-active': currentPage === `${page}` }]"
        v-for="page in pages"
        @click="currentPage = `${page}`"
      >
        {{ page }}
      </li>
    </ul>
    <div class="dropdown">
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
<style lang="scss" scoped>
.pages-options {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--spacing);

  width: 100%;

  position: relative;
}

.pages {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;

  gap: var(--spacing-small);
}

.page-item {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: var(--border-radius);

  &.-active {
    background-color: #ccc;
  }
}

.dropdown {
  position: absolute;
  right: 0;
  top: 0;
}

select {
  width: 100px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  cursor: pointer;

  &:focus {
    outline: none;
  }

  option {
    cursor: pointer;

    &:hover {
      background-color: #ccc;
    }
  }


}
</style>
