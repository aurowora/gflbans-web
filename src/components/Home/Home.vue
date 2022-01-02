<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <div class="container">
    <div class="section">
      <h1 class="title has-text-light">Welcome to {{ APPLICATION_NAME }}!</h1>
      <p>Here you can find bans, mutes, and similar infractions made on {{ COMMUNITY_NAME }}'s servers. If you were punished on one of our servers and are looking to locate or appeal your infraction, you can begin by clicking the button below.</p>
      <br />
      <div class="is-flex is-justify-content-center">
        <BanFinderButton class="is-justify-content-center"></BanFinderButton>
      </div>
      <br />
      <p>You can also search for any infraction using the text box below by entering things like <router-link :class="[$store.getters.hasTextThemeClass]" to='/gql-doc'>GQL queries</router-link>, account IDs, and text.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { APP_NAME, COMMUNITY_NAME } from '@/config';
import { Vue, Options } from 'vue-class-component';
import BanFinderButton from './BanFinderButton.vue';

@Options({
  components: {
    BanFinderButton
  }
})
export default class Home extends Vue {
  APPLICATION_NAME = APP_NAME;
  COMMUNITY_NAME = COMMUNITY_NAME;
}
</script>

<style scoped>

</style>
