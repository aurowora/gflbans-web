/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { createApp } from 'vue'
import App from '@/App.vue';
import { store, key } from '@/state';
import '@/assets/css/bulma.sass';
import '@/assets/css/site.scss';

// Setup the icons

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faExclamationTriangle, faGavel, faCog, faHome, faServer, faUserShield, faRightToBracket, faSignOut, faBan, faAddressCard, faArrowsRotate, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import VueScreen from 'vue-screen';
import router from './routes';

library.add(faGavel, faHome, faServer, faExclamationTriangle, faUserShield, faRightToBracket, faSignOut, faBan, faAddressCard, faArrowsRotate, faArrowLeft, faArrowRight, faCog);

// Initialize the app

const app = createApp(App);

app.use(store, key);
app.use(router);
app.use(VueScreen);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');

