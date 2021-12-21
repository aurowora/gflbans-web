<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <router-link to="/" class="nav-link">Dashboard</router-link>
  <router-link to="/servers" class="nav-link">Servers</router-link>
  <router-link to="/infractions" class="nav-link">Infractions</router-link>
  <router-link v-if="isAdmin" to="/manage" class="nav-link">Manage</router-link>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class TopBar extends Vue {
  get isAdmin()
  {
    return this.$store.getters.isAdmin;
  }
}
</script>

<style scoped></style>
