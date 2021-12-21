/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { createApp } from 'vue'
import App from '@/App.vue';
import { store, key } from '@/state';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Infractions from '@/components/Infractions.vue';
import Management from '@/components/Management.vue';
import Servers from '@/components/Servers.vue';

// Initialize the router
const routes = [
  { path: '/', component: Home, alias: '/dashboard' },
  { path: '/servers', component: Servers },
  { path: '/infractions', component: Infractions },
  { path: '/manage', component: Management }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Initialize the app

const app = createApp(App);

app.use(store, key);
app.use(router);

app.mount('#app')
