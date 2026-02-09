<script setup lang="ts">
import {useAccountStore} from "../stores/useAccountStore.ts";
import {storeToRefs} from "pinia";
import AccountItem from "./AccountItem.vue";

const accountsStore = useAccountStore();
const {accounts} = storeToRefs(accountsStore);
</script>

<template>
  <div class="account-list">
    <div class="account-row">
      <p class="header-text">Метки</p>
      <p class="header-text">Тип записи</p>
      <p class="header-text">Логин</p>
      <p class="header-text">Пароль</p>
    </div>
    <div v-for="account in accounts" :key="account.id" class="account-row">
      <AccountItem :account="account"/>
    </div>
  </div>
</template>

<style scoped>
.account-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 3rem;
  gap: 1rem;
  margin-bottom: 1rem;
}

.header-text {
  opacity: 50%;
}
</style>