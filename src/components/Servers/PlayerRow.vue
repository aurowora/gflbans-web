<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <div class="list-item">
        <div class="list-item-image">
            <figure class="image is-64x64">
                <img v-if="player.gs_avatar" class="is-rounded" :src="`${INST}file/uploads/${player.gs_avatar.file_id}/avatar.webp`" />
                <!--TODO: Default avatar image -->
                <img v-else class="is-rounded" src="@/assets/pinwheel.webp" />
            </figure>
        </div>

        <div class="list-item-content">
            <div class="list-item-title has-text-white">{{ player.gs_name }}</div>
            <div class="list-item-description has-text-white is-faded">{{ formatPlayerPlaytime }}</div>
        </div>

        <div class="list-item-controls">
            <div class="buttons is-right">
                <button @click="kick" v-if="$store.state.current_user && ($store.state.current_user.permissions & PRIVS.RPC_KICK) !== 0" class="button is-outlined is-danger" :class="{'is-loading': loadingKick}">
                    <span class="icon-text">
                        <span class="icon">
                            <font-awesome-icon icon="ban"></font-awesome-icon>
                        </span>
                        <span>Kick</span>
                    </span>
                </button>
                <button v-if="serviceSupported" @click="openCurrentProfile" class="button is-outlined" :class="$store.getters.isThemeClass">
                    <span class="icon-text">
                        <span class="icon">
                            <font-awesome-icon icon="address-card"></font-awesome-icon>
                        </span>
                        <span>Profile</span>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IPlayer, IServer } from "@/gflbans/servers";
import { Permission } from "@/globals";
import { openProfile, isServiceSupported } from '@/profile';
import { Vue, Options } from "vue-class-component";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { INSTANCE } from "@/config";
import { kick_player } from "@/gflbans/rpc";
import { GFLBansError, HTTPError, NetworkError } from "@/errors";

dayjs.extend(relativeTime);

@Options({
    props: {
        player: {
            type: Object,
            required: true
        },
        server: {
            type: Object,
            required: true
        }
    }
})
export default class Player extends Vue {
    // props
    player!: IPlayer
    server!: IServer

    // template globals
    INST = INSTANCE;
    PRIVS = Permission;

    // data
    loadingKick: boolean = false;

    // computed props
    get serviceSupported()
    {
        return isServiceSupported(this.player.gs_service);
    }

    // methods
    get formatPlayerPlaytime(): string
    {
        const pt = dayjs.unix((Date.now() / 1000) - this.player.playtime);
        return `For ${pt.fromNow(true)}`;
    }

    openCurrentProfile()
    {
        openProfile(this.player.gs_service, this.player.gs_id);
    }

    kick()
    {
        const pr = this;

        this.loadingKick = true;

        kick_player(this.server.id, this.player.gs_service, this.player.gs_id).then(function (result) {
            if (result instanceof HTTPError || result instanceof NetworkError)
            {
                pr.$store.commit('setError', result);
            }
        }).catch(function (exc) {
            pr.$store.commit('setError', new GFLBansError(exc));
        }).finally(function () {
            pr.loadingKick = false;
        })
    }
}
</script>

<style scoped>

/* Remove the white line below items that Bulma list provides */
.list-item:not(:last-child):not(.box)
{
    border-bottom: none !important;
}

.is-faded {
    opacity: 0.7;
}
</style>