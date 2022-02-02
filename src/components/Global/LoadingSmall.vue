<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <transition name="loaderAppearDisappear" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
    <div v-if="$store.state.small_loading.is_loading" :class="[$store.getters.isThemeClass]" class="notification">
      <div class="is-flex">
          <div class="loader-outer">
              <span class="loader"></span>
          </div>
          <span class="is-flex-grow-1 load-text">{{$store.state.small_loading.loader_text}}</span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class LoadingSmall extends Vue {}
</script>

<style scoped>
.loader-outer {
    width: 24px;
    height: 24px;
    margin-right: 5px;
}

.loader {
    width: 18px;
    height: 18px;
    left: 3px;
    top: 3px;
}


div.notification {
    position: fixed;
    z-index: 100;
    right: 10px;
    bottom: 10px;
    padding: .75rem;
    min-width: 140px;
}
</style>