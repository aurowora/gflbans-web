<template>
    <div class="section is-flex is-align-items-center is-flex-direction-column is-justify-content-center">
        <img src="@/assets/other/eevee_dead_oof.webp" alt="" v-if="mode === 5" />
        <img src="@/assets/animated/schleep.webp" alt="" v-else />
        <h1 class="is-size-2"><span v-if="mode === 5">Oops!</span><span v-else>No Results</span></h1>
        <!-- There are no infractions in GFLBans -->
        <p v-if="mode === 0">There don't seem to be any infractions in GFLBans. <span v-if="$store.state.current_user && ($store.state.current_user.permissions & makeInfractions) > 0">Perhaps you'd like to <a @click="newInf">create one?</a></span></p>
        <!-- There are no infractions for this server/admin/player -->
        <p v-else-if="mode < 4">There don't seem to be any infractions <span v-if="mode === 1">from this server</span><span v-else-if="mode === 2">from this admin</span><span v-else>against this player</span>. Try something else or go back to the <router-link to="/infractions">main listing</router-link>.</p>
        <!-- Nothing matched your search -->
        <p v-else-if="mode === 4">No infractions matched your search query. Try something else or go back to the <router-link to="/infractions">main listing</router-link>.</p>
        <!-- Error! -->
        <div class="code-wrap" v-else>
            <p>An error occurred while loading the list of infractions. The details of the error are as follows:</p>
            <div class="code">
                {{ argument }}
            </div>
            <p>If you followed a link to get here, it's possible that the link is broken, in which case, you should <router-link :class="[$store.getters.hasTextThemeClass]" to="/infractions">return to the main listing</router-link>. If you think this should be working, try again in a few minutes and <a target="_blank" :href="support_link" :class="[$store.getters.hasTextThemeClass]">contact us</a> if the issue persists.</p>
        </div>
    </div>
</template>

<script lang="ts">
import { SUPPORT_LINK } from "@/config";
import { Permission } from "@/globals";
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        mode: {
            type: Number,
            required: true
        },
        argument: {
            type: String,
            required: true
        }
    },
    emits: ['openCreateInf']
})
export default class NoResults extends Vue {
    // prop
    mode!: number;
    argument!: string;

    // template globals
    makeInfractions = Permission.CREATE_INFRACTION;
    support_link = SUPPORT_LINK;

    newInf()
    {
        this.$emit('openCreateInf');
    }
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