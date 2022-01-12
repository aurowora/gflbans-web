<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <div class="pageBase container" v-if="hasServers">
        <div class="section">
          <h1 class="title has-text-white">Servers</h1>
          <Server v-for="server in servers" :key="server.id" :server="server"></Server>
        </div>
        
    </div>
    <div v-else class="pageBase is-flex is-justify-content-center is-align-items-center">
      <div class="pb-loader-wrapper">
        <span class="pb-loader loader"></span>
        <span class="pb-loaderText">Loading server list…</span>
      </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Server from './Server.vue';
import '@/assets/css/pageBase.scss'

@Options({
  components: {
    Server
  }
})
export default class Servers extends Vue {
  get servers()
  {
    console.log(this.$store.state.servers);
    return this.$store.state.servers;
  }

  get hasServers()
  {
    return this.$store.state.servers !== undefined;
  }
}
</script>