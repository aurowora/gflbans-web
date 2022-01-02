<template>
    <router-link to='/banfinder' class="button" :class=[$store.getters.isThemeClass]>Find your Bans</router-link>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class BanFinderButton extends Vue {}
</script>

<style scoped>
button {
    font-family: 'Montserrat-Regular', sans-serif;
}
</style>