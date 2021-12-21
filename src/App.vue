<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <TopBar></TopBar>
  <router-view></router-view>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TopBar from '@/components/TopBar.vue';

@Options({
  components: {
    TopBar,
  },
})
export default class App extends Vue {}
</script>

<style></style>
