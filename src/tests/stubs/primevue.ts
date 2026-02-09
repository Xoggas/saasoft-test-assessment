import {h, ref, watch} from "vue";

export default {
  Textarea: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup(props: any, {emit}: any) {
      const value = ref(props.modelValue);

      function onInput(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        value.value = target.value;
        emit('update:modelValue', target.value);
      }

      return () => h('textarea', {
        value: value.value,
        onInput
      });
    }
  },
  InputText: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup(props: any, {emit}: any) {
      const value = ref(props.modelValue);

      function onInput(e: Event) {
        const target = e.target as HTMLInputElement;
        value.value = target.value;
        emit('update:modelValue', target.value);
      }

      return () => h('input', {
        type: 'text',
        value: value.value,
        onInput
      });
    }
  },
  Password: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup(props: any, {emit}: any) {
      const value = ref(props.modelValue);

      function onInput(e: Event) {
        const target = e.target as HTMLInputElement;
        value.value = target.value;
        emit('update:modelValue', target.value);
      }

      return () => h('input', {
        type: 'password',
        value: value.value,
        onInput
      });
    }
  },
  Select: {
    props: ['modelValue', 'options', 'optionLabel'],
    emits: ['update:modelValue', 'change'],
    setup(props: any, {emit}: any) {
      const value = ref(props.modelValue);

      watch(() => props.modelValue, (newVal) => {
        value.value = newVal;
      });

      function onChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        const selectedValue = target.value;

        const selectedObj = props.options.find((opt: any) => opt.value === selectedValue);
        value.value = selectedObj;
        emit('update:modelValue', selectedObj);
        emit('change', selectedObj);
      }

      return () => h('select', {value: value.value?.value, onChange},
        props.options.map((opt: any) =>
          h('option', {value: opt.value}, opt[props.optionLabel])
        )
      );
    }
  },
  Button: {
    props: ['label'],
    emits: ['click'],
    setup(props: any, {emit}: any) {
      function onClick(e: Event) {
        emit('click', e);
      }

      return () => h('button', {onClick}, props.label || 'Button');
    }
  }
};