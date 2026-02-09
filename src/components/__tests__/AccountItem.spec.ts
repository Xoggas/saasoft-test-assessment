import type {Account} from "../../models/account.model.ts";
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from "@vue/test-utils";
import AccountItem from "../AccountItem.vue";
import {setActivePinia} from "pinia";
import {useAccountStore} from "../../stores/useAccountStore.ts";
import {createTestingPinia} from "@pinia/testing";
import stubs from '../../tests/stubs/primevue.ts';
import {nextTick} from "vue";

const accountMock: Account = {
  id: 1,
  marks: [
    {text: 'XXXX'},
    {text: 'YYYY'},
  ],
  recordType: 'local',
  login: 'admin',
  password: '12345678',
};

describe('AccountItem.vue Test', () => {
  let wrapper: any = null;

  beforeEach(async () => {
    vi.clearAllMocks();

    setActivePinia(createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    }));

    wrapper = mount(AccountItem, {
      props: {account: accountMock},
      global: {
        stubs: stubs,
      }
    });

    await nextTick();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Корректно инициализирует данные аккаунта', async () => {
    expect(wrapper.vm.model.marks).toBe('XXXX; YYYY');
    expect(wrapper.vm.model.recordType.value).toBe('local');
    expect(wrapper.vm.model.login).toBe('admin');
    expect(wrapper.vm.model.password).toBe('12345678');

    expect(wrapper.get('textarea[name="marks"]').attributes('value')).toBe('XXXX; YYYY');
    expect(wrapper.get('input[name="login"]').attributes('value')).toBe('admin');
    expect(wrapper.find('input[name="password"]').exists()).toBeTruthy();
    expect(wrapper.get('input[name="password"]').attributes('value')).toBe('12345678');
  });

  it('Скрывает поле с паролем и обнуляет его при записи типа LDAP', async () => {
    expect(wrapper.vm.model.recordType.value).toBe('local');
    expect(wrapper.vm.model.password).toBe('12345678');
    expect(wrapper.find('input[name="password"]').exists()).toBeTruthy();

    await wrapper.get('select[name="recordType"]').setValue('ldap');

    expect(wrapper.vm.model.recordType.value).toBe('ldap');
    expect(wrapper.vm.model.password).toBe(null);
    expect(wrapper.find('input[name="password"]').exists()).toBeFalsy();
  });

  const markCases = [
    {
      value: '1;2;3',
      marks: [
        {text: '1'},
        {text: '2'},
        {text: '3'},
      ]
    },
    {
      value: '',
      marks: []
    }
  ]

  it.each(markCases)('Корректно обновляет модель в сторе после изменения меток $value', async ({value, marks}) => {
    const textarea = wrapper.get('textarea[name="marks"]');
    await textarea.setValue(value);
    await textarea.trigger('blur');

    const expectedAccount: Account = {
      id: 1,
      marks: marks,
      recordType: 'local',
      login: 'admin',
      password: '12345678',
    };

    const store = useAccountStore();

    expect(store.update).toBeCalledWith(1, expectedAccount);
  });

  it('Корректно обновляет модель в сторе после изменения типа записи', async () => {
    const select = wrapper.get('select[name="recordType"]');
    await select.setValue('ldap');
    await select.trigger('blur');

    const expectedAccount: Account = {
      id: 1,
      marks: [
        {text: 'XXXX'},
        {text: 'YYYY'},
      ],
      recordType: 'ldap',
      login: 'admin',
      password: null,
    };

    const store = useAccountStore();

    expect(store.update).toBeCalledWith(1, expectedAccount);
  });

  it('Корректно обновляет модель в сторе после изменения логина и пароля', async () => {
    const login = wrapper.get('input[name="login"]');
    const password = wrapper.get('input[name="password"]');

    await login.setValue('newLoginValue');
    await password.setValue('newPasswordValue');
    await password.trigger('blur');

    const expectedAccount: Account = {
      id: 1,
      marks: [
        {text: 'XXXX'},
        {text: 'YYYY'},
      ],
      recordType: 'local',
      login: 'newLoginValue',
      password: 'newPasswordValue',
    };

    const store = useAccountStore();

    expect(store.update).toBeCalledWith(1, expectedAccount);
  });

  it('Не обновляет модель, если поля невалидны', async () => {
    const login = wrapper.get('input[name="login"]');
    const password = wrapper.get('input[name="password"]');
    const store = useAccountStore();

    await login.setValue('');
    await password.trigger('blur');

    expect(store.update).not.toBeCalled();

    await password.setValue('');
    await password.trigger('blur');

    expect(store.update).not.toBeCalled();
  });

  it('Удаляет модель по нажатию кнопки', async () => {
    const deleteButton = wrapper.get('button');

    await deleteButton.trigger('click');

    const store = useAccountStore();

    expect(store.remove).toBeCalledWith(1);
  });
});