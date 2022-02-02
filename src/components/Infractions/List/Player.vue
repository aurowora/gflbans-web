<template>
    <div class="is-flex is-align-items-center">
        <figure class="image is-32x32">
            <img class="is-rounded" :src="`${INST}file/uploads/${player.gs_avatar.file_id}/avatar.webp`" @error="error = true" v-if="player.gs_avatar && !error">
            <img class="is-rounded" src="@/assets/animated/pinwheel.webp" v-else>
        </figure>
        <span class="restrict_length" v-if="this.player.gs_name">{{ this.player.gs_name }}</span>
        <UserIP v-else-if="!this.player.gs_id && this.player.ip !== 'MISSING_PERMISSIONS'" :ip="this.player.ip"></UserIP>
        <span class="restrict_length"  v-else-if="!this.player.gs_id && this.player.ip === 'MISSING_PERMISSIONS'">IP Address</span>
        <span class="restrict_length" v-else>Unknown Player</span>
    </div>
</template>

<script lang="ts">
import UserIP from "@/components/Global/UserIP.vue";
import { INSTANCE } from "@/config";
import { IInfractionPlayer } from "@/gflbans/infractions";
import { Vue, Options } from "vue-class-component";

@Options({
    props: {
        player: {
            required: true
        }
    },
    components: {
        UserIP
    }
})
export default class Player extends Vue
{
    player!: IInfractionPlayer
    error: boolean = false

    // globals
    INST = INSTANCE;
}
</script>

<style scoped>
span {
    flex-wrap: nowrap;
    text-overflow: clip;
    white-space: nowrap;
}

.image {
    margin-right: 7px;
}

.restrict_length {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

@media screen and (max-width: 550px) {
    .restrict_length {
        max-width: 80px
    }
}

@media screen and (min-width: 550px) {
    .restrict_length {
        max-width: 170px;
    }
}

</style>