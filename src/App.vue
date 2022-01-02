<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <TopBar></TopBar>
  <router-view class="is-flex-grow-1"></router-view>
  <Error></Error>
  <Loading></Loading>
  <LoadingSmall></LoadingSmall>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TopBar from '@/components/Global/TopBar.vue';
import Error from '@/components/Global/Error.vue'
import Loading from '@/components/Global/Loading.vue';
import { check_login } from './gflbans/login';
import { startServerManager } from './gflbans/servers';
import LoadingSmall from './components/Global/LoadingSmall.vue';

@Options({
  components: {
    TopBar,
    Error,
    Loading,
    LoadingSmall
  },
  mounted: function () {
    check_login(this.$store);
    startServerManager(this.$store);
  }
})
export default class App extends Vue {}
</script>

<style>
  /* Default fonts can be overriden on a per component basis */

  p
  {
    font-family: 'Montserrat-Regular', sans-serif;
  }

  .title, strong
  {
    font-family: 'Montserrat-Medium', sans-serif;
  }
</style>