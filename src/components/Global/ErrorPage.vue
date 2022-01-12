<template>
  <div class="pageBase container">
      <div class="section is-flex is-align-items-center is-flex-direction-column is-justify-content-center">
        <img src="@/assets/other/eevee_dead_oof.webp" alt="" />
        <h1 class="is-size-2">Oops!</h1>
        <div class="code-wrap">
            <p>An unexpected error occurred. The details of the error are as follows:</p>
            <div class="code">
                <template v-if="$route.meta.error_detail">{{ $route.meta.error_detail }}</template>
                <template v-else-if="$route.query.error_detail">{{ $route.query.error_detail }}</template>
                <template v-else>Error information not set. Did you navigate here directly?</template>
            </div>
            <p>If you followed a link to get here, it's possible that the link is broken, in which case, you should <router-link :class="[$store.getters.hasTextThemeClass]" to="/">return home</router-link>.</p>
            <br />
            <p>If you think this should be working, try again in a few minutes and <a target="_blank" :href="support_link" :class="[$store.getters.hasTextThemeClass]">contact us</a> with as many details as you can provide (including this error message) if the issue persists.</p>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SUPPORT_LINK } from "@/config";
import { Vue } from "vue-class-component";

export default class ErrorPage extends Vue {
    support_link = SUPPORT_LINK;
}
</script>

<style scoped>
img {
    max-width: 192px;
    height: auto;
}

h1 {
    font-family: 'Montserrat-Medium', sans-serif;
}

.section {
    height: 100%;
}

.code {
    margin: 10px 0;
    padding: 10px;
    background-color: black;
    border-radius: 4px;
    color: lime;
    font-family: monospace;
}

.code-wrap {
    max-width: 550px;
}
</style>