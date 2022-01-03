/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { createApp } from 'vue'
import App from '@/App.vue';
import { store, key } from '@/state';
import { createRouter, createWebHistory, RouteLocation } from 'vue-router';
import { finish_login } from './gflbans/login';
import '@/assets/bulma.scss';
import '@/assets/site.scss';

// Setup the icons

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faExclamationTriangle, faGavel, faHome, faServer, faUserShield, faRightToBracket, faSignOut, faBan, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { ArgumentError, GFLBansError, HTTPError, NetworkError, StateError, SecurityError } from './errors';
import VueScreen from 'vue-screen';
import { adminPermissions } from './globals';

library.add(faGavel, faHome, faServer, faExclamationTriangle, faUserShield, faRightToBracket, faSignOut, faBan, faAddressCard);

// Initialize the router
const Home = () => import('@/components/Home/Home.vue');
const Infractions = () => import('@/components/TopLevel/Infractions.vue');
const Management = () => import('@/components/TopLevel/Management.vue');
const Servers = () => import('@/components/Servers/Servers.vue');
//const BanFinder = () => import('@/components/BanFinder/BanFinder.vue');
const GQLDoc = () => import('@/components/GQLDoc/GQLDoc.vue');

const routes = [
  { path: '/', component: Home, alias: '/home' },
  { path: '/servers', component: Servers },
  { path: '/infractions', component: Infractions },
  { path: '/gql-doc', component: GQLDoc },
  {
    path: '/manage',
    component: Management,
    beforeEnter: () => {
      if (!store.state.current_user || (store.state.current_user.permissions & adminPermissions) === 0) 
      {
        router.replace('/home').then(function () {
          console.log(';)')
        });
        return false;
      }
    }
  },
  // { path: '/banfinder', component: BanFinder },
  {
    path: '/login/handle',
    redirect: function (to: RouteLocation) {
      store.commit('setLoading', true);

      /* Read the arguments from the query string */
      if (to.query.code == undefined || to.query.state == undefined )
      {
        store.commit('setError', new ArgumentError('Missing required arguments for this route (state, code).'));
        store.commit('setLoading', false);
        return '/home';
      }

      const code = to.query.code.toString();
      const state = to.query.state.toString();

      /* Do the login */
      finish_login(store, code, state).then(function (result) {
        if (result instanceof HTTPError || result instanceof NetworkError || result instanceof StateError || result instanceof SecurityError)
        {
          store.commit('setError', result);
          return;
        }
        console.log('Login succeeded :)');
      }).catch(function (e) {
        store.commit('setError', new GFLBansError(e));
      }).finally(function () {
        store.commit('setLoading', false);

        // Remove the query parameters from the url
        router.replace({
          ...router.currentRoute,
          query: {
            code: undefined,
            state: undefined
          }
        }).catch(e => {
          console.log(e);
          // We don't need to inform the user of this error because it doesn't impact app function
        });
      })

      return '/home';
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Initialize the app

const app = createApp(App);

app.use(store, key);
app.use(router);
app.use(VueScreen);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');

