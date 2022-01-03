<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <div class="serverMain container" v-if="hasServers">
        <div class="section">
          <h1 class="title has-text-white">Servers</h1>
          <Server v-for="server in servers" :key="server.id" :server="server"></Server>
        </div>
        
    </div>
    <div v-else class="serverMain is-flex is-justify-content-center is-align-items-center">
      <div class="loader-wrapper">
        <span class="loader"></span>
        <span class="loaderText">Loading server list…</span>
      </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Server from './Server.vue';

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

<style scoped>
  .serverMain.container {
    width: 100%;
  }

  .serverMain {
    font-family: 'Montserrat-Regular', sans-serif;
  }

  .loader {
    width: 64px;
    height: 64px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }

  .loader-wrapper {
    text-align: center;
  }

</style>
