import { createRouter, createWebHistory, RouteLocation } from 'vue-router';
import { ArgumentError, GFLBansError, HTTPError, NetworkError, SecurityError, setError, StateError } from './errors';
import { finish_login } from './gflbans/login';
import { adminPermissions } from './globals';
import { store } from './state';

// Initialize the router
const Home = () => import('@/components/Home/Home.vue');
const Infractions = () => import('@/components/Infractions/Infractions.vue');
const Management = () => import('@/components/TopLevel/Management.vue');
const Servers = () => import('@/components/Servers/Servers.vue');
//const BanFinder = () => import('@/components/BanFinder/BanFinder.vue');
const GQLDoc = () => import('@/components/GQLDoc/GQLDoc.vue');
const ErrorPage = () => import('@/components/Global/ErrorPage.vue');

const routes = [
  { path: '/', component: Home, alias: '/home' },
  { path: '/error', component: ErrorPage },
  { path: '/servers', component: Servers },
  { path: '/infractions', component: Infractions, props: (route: any) => ({ mode: route.query.mode ? parseInt(route.query.mode) : 0, argument: route.query.argument ? route.query.argument : ''  }) },
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
        return '/home';
      }

      const code = to.query.code.toString();
      const state = to.query.state.toString();

      /* Do the login */
      finish_login(store, code, state).then(function (result) {
        if (result instanceof HTTPError || result instanceof NetworkError || result instanceof StateError || result instanceof SecurityError)
        {
          setError(result);
          return;
        }
        console.log('Login succeeded :)');
      }).catch(function (e) {
        setError(new GFLBansError(e));
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
  },
  // not found route
  { path: '/:pathMatch(.*)*', name: 'not-found', component: ErrorPage, meta: {
      'error_detail': 'The requested path does not exist.'
  } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router