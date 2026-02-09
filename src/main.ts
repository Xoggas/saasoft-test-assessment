import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Lara from '@primeuix/themes/lara';
import {definePreset} from "@primeuix/themes";
import {createPinia} from "pinia";

const pinia = createPinia();

const app = createApp(App);

const preset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}'
    }
  },
})

app.use(PrimeVue, {
  theme: {
    preset: preset,
    options: {
      darkModeSelector: false
    }
  }
});

app.use(pinia);

app.mount('#app');
