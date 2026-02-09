import {defineStore} from "pinia";
import type {Account} from "../models/account.model.ts";
import {onMounted, ref, watch} from "vue";

const STORAGE_KEY = 'accounts';

export const useAccountStore = defineStore('accounts', () => {
  let counter = 0;
  const accounts = ref<Account[]>([]);

  function create(): Account {
    const newAccount = {
      id: ++counter,
      marks: [],
      recordType: 'local',
      login: '',
      password: ''
    } as Account;
    accounts.value.push(newAccount);
    return newAccount;
  }

  function remove(id: number) {
    const existingAccount = accounts.value.findIndex(a => a.id === id);
    if (existingAccount > -1) {
      accounts.value.splice(existingAccount, 1);
    }
  }

  function update(id: number, newAccount: Account) {
    const existingAccount = accounts.value.findIndex(a => a.id === id);
    if (existingAccount > -1) {
      accounts.value[existingAccount] = newAccount;
    }
  }

  watch(accounts, (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }, {deep: true});

  onMounted(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Account[];
      accounts.value = parsed;
      counter = parsed.reduce((max, a) => Math.max(max, a.id), 0);
    }
    catch (e) {
      console.warn('Failed to load accounts from localStorage', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  });

  return {
    accounts,
    create,
    update,
    remove,
  };
});