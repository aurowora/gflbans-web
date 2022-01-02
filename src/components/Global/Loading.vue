<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <div v-if="isLoading" class="modal is-active">
    <div class="modal-background"></div>
    <div class="sk-cube-grid">
      <div class="sk-cube sk-cube1">
        <img class="animated" src="@/assets/cubes/3.webp" />
      </div>
      <div class="sk-cube sk-cube2">
        <img class="animated" src="@/assets/cubes/2.webp" />
      </div>
      <div class="sk-cube sk-cube3">
        <img class="animated" src="@/assets/cubes/1.webp" />
      </div>
      <div class="sk-cube sk-cube4">
        <img class="animated" src="@/assets/cubes/6.webp" />
      </div>
      <div class="sk-cube sk-cube5">
        <img class="animated" src="@/assets/cubes/5.webp" />
      </div>
      <div class="sk-cube sk-cube6">
        <img class="animated" src="@/assets/cubes/4.webp" />
      </div>
      <div class="sk-cube sk-cube7">
        <img class="animated" src="@/assets/cubes/9.webp" />
      </div>
      <div class="sk-cube sk-cube8">
        <img class="animated" src="@/assets/cubes/8.webp" />
      </div>
      <div class="sk-cube sk-cube9">
        <img class="animated" src="@/assets/cubes/7.webp" />
      </div>
    </div>
    <p id="loadMessage">
      Loading...
      <img class="loader-emote" src="@/assets/pinwheel.webp" alt=":pinwheel:" />
    </p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Loading extends Vue {
  get isLoading() 
  {
    return this.$store.state.loading;
  }
}
</script>

<style scoped>
.animated {
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}

.loader-emote {
  max-width: 32px;
  max-height: 32px;
}

#loadMessage {
  z-index: 1000;
  font-family: "Montserrat-Medium", sans-serif;
  align-items: center;
  display: flex;
}

/*
        Spin Kit 
        https://tobiasahlin.com/spinkit/
    */

.sk-cube-grid {
  width: 128px;
  height: 128px;
  margin: 25px auto;
}

.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  background: rgba(0, 0, 0, 0);
  float: left;
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
  animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
}
.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes sk-cubeGridScaleDelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}

@keyframes sk-cubeGridScaleDelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}
</style>