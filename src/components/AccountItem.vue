<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {useAccountStore} from "../stores/useAccountStore.ts";
import type {Account, RecordType} from "../models/account.model.ts";
import {z} from 'zod';

type RecordTypeModel = {
  name: string,
  value: RecordType
};

type AccountModel = {
  marks: string,
  recordType: RecordTypeModel,
  login: string,
  password: string | null
};

const props = defineProps<{
  account: Account,
}>();

const {remove: removeAccount, update: updateAccount} = useAccountStore();

const recordTypes = [
  {name: 'Локальная', value: 'local'},
  {name: 'LDAP', value: 'ldap'}
] as RecordTypeModel[];

const model = ref<AccountModel>({
  marks: props.account.marks.map(m => m.text).join('; '),
  recordType: recordTypes.find(rt => rt.value == props.account.recordType)!,
  login: props.account.login,
  password: props.account.password,
});

watchEffect(() => {
  if (model.value.recordType.value === 'ldap') {
    model.value.password = null;
  }
});

const errors = ref<Partial<Record<keyof AccountModel, string>>>({});

const accountSchema = z.object({
  login: z.string().min(1).max(100),
  password: z.string().min(1).max(100).nullable()
});

function validateAll(): boolean {
  const result = accountSchema.safeParse(model.value);

  errors.value = {};

  if (result.success) {
    return true;
  }

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof AccountModel;
    errors.value[field] = issue.message;
  }

  return false;
}

function validateAllAndSubmit() {
  if (validateAll()) {
    submit();
  }
}

function submit() {
  const account: Account = {
    id: props.account.id,
    marks: model.value.marks.split(';').map(m => m.trim()).filter(m => !!m).map(m => {
      return {
        text: m
      }
    }),
    recordType: model.value.recordType.value,
    login: model.value.login,
    password: model.value.recordType.value === 'local' ? model.value.password : null
  }

  updateAccount(props.account.id, account);
}

defineExpose({
  model
});
</script>

<template>
  <Textarea name="marks"
            autoResize
            rows="1"
            placeholder="Значение"
            maxlength="50"
            fluid
            v-model="model.marks"
            @blur="validateAllAndSubmit"/>

  <Select name="recordType"
          :options="recordTypes"
          optionLabel="name"
          fluid
          v-model="model.recordType"
          @change="validateAllAndSubmit"/>

  <InputText name="login"
             placeholder="Значение"
             :class="{wide: model.recordType.value === 'ldap'}"
             fluid
             @blur="validateAllAndSubmit"
             v-model="model.login"
             :invalid="!!errors.login"/>

  <Password v-if="model.recordType.value === 'local'"
            name="password"
            :feedback="false"
            placeholder="Значение"
            fluid
            toggleMask
            v-model="model.password"
            @blur="validateAllAndSubmit"
            :invalid="!!errors.password"/>
  <Button icon="pi pi-trash" variant="text" @click="removeAccount(account.id)"/>
</template>

<style scoped>
.wide {
  grid-column: span 2;
}
</style>