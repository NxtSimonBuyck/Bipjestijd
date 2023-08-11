import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import './style.scss'
import { firebaseApp } from './firebase'
import { router } from './core/routes'
import { store } from './core/store/store'
// import App.vue

const app = createApp(App)

app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})
app.use(router)
app.use(store)

app.mount('#app')
