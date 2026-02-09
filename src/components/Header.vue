<script setup lang="ts">
import {useAccountStore} from "../stores/useAccountStore.ts";

const {create: createUser} = useAccountStore();

</script>

<template>
  <header>
    <h3>Учетные записи</h3>
    <Button
      @click="createUser"
      icon="pi pi-plus"
      variant="outlined"/>
  </header>
</template>

<style scoped>
header {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>