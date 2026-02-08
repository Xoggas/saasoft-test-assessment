import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Lara from '@primeuix/themes/lara';
import {definePreset} from "@primeuix/themes";

const app = createApp(App);

const preset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}'
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

app.mount('#app');
