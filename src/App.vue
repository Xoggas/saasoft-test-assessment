<script setup lang="ts">
import Header from "./components/Header.vue";
import Hint from "./components/Hint.vue";
import AccountsList from "./components/AccountsList.vue";
</script>

<template>
  <div class="container">
    <Header/>
    <Hint/>
    <AccountsList/>
  </div>
</template>

<style scoped>
.container {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  gap: 1rem;
  flex-direction: column;
}
</style>