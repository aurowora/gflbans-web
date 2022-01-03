<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <div class="columns">
        <div class="column is-one-third is-hidden-mobile is-flex is-flex-direction-column is-align-items-center">
            <img v-if="!imageErr" :src="`${INST}maps/${game}/${map}`" @error="mapImageFailed"/>
            <img v-else src="@/assets/unknown_map.webp" />
            <p>{{ map }}</p>
        </div>
        <div class="column" v-if="loaded">
            <h1 class="is-size-5 has-text-white">Players ({{players.length}})</h1>
            <div class="list has-overflow-ellipsis" v-if="players.length > 0">
                <div class="list-item" v-for="player in players" :key="player.gs_id">
                    <div class="list-item-image">
                        <figure class="image is-64x64">
                            <img v-if="player.gs_avatar" class="is-rounded" :src="`${INST}file/uploads/${player.gs_avatar.file_id}/avatar.webp`" />
                            <!--TODO: Default avatar image -->
                            <img v-else class="is-rounded" src="@/assets/pinwheel.webp" />
                        </figure>
                    </div>

                    <div class="list-item-content">
                        <div class="list-item-title has-text-white">{{ player.gs_name }}</div>
                        <div class="list-item-description has-text-white">{{ formatPlayerPlaytime(player) }}</div>
                    </div>
                </div>
            </div>
            <p class="has-text-white is-faded is-size-6" v-else>No players are connected.</p>
        </div>
        <div class="column is-flex is-flex-direction-column is-align-items-center is-justify-content-center" v-else>
            <span class="loader"></span>
            <span>Loading player list…</span>
        </div>
    </div>
</template>

<script lang="ts">
import { INSTANCE } from "@/config";
import { EncodingError, GFLBansError, HTTPError, NetworkError } from "@/errors";
import { getPlayers, IPlayer } from "@/gflbans/servers";
import { Options, Vue } from "vue-class-component";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

@Options({
    props: {
        id: {
            type: String,
            required: true
        },
        map: {
            type: String,
            required: true
        },
        game: {
            type: String,
            required: true
        },
        hostname: {
            type: String,
            required: true
        }
    },
    beforeUnmount: function () {
        if (this.intervalId !== undefined)
        {
            clearInterval(this.intervalId);
        }
    }
})

export default class ServerInterior extends Vue {
    // prop
    id!: string;

    // data
    imageErr = false;
    intervalId?: number;
    players: IPlayer[] = [];
    INST = INSTANCE;
    loaded = false;

    // Called by the parent component to begin loading when it is opened (so we don't spam the server with useless requests)
    // (Fetches the player list)
    activate()
    {
        this.refreshPlayers();
        this.intervalId = setInterval(this.refreshPlayers, 60000);
    }

    refreshPlayers()
    {
        const t = this;

        getPlayers(this.id).then(function (result) {
            if (result instanceof NetworkError || result instanceof EncodingError || result instanceof HTTPError)
            {
                t.$store.commit('setError', result);
            } else if (t.$store.state.current_user !== undefined && t.$store.state.current_user.avatar_id) {
                console.log('Got player list', result);
                t.players = result;
                t.loaded = true;
            }
        }).catch(function (e) {
            t.$store.commit('setError', new GFLBansError(e));
        })
    }

    mapImageFailed()
    {
        this.imageErr = true;
    }

    formatPlayerPlaytime(player: IPlayer): string
    {
        const playtime = dayjs.unix((Date.now() / 1000) - player.playtime);
        return `For ${playtime.fromNow(true)}`;
    }

}
</script>

<style scoped>
img {
    max-height: 120px;
    max-width: 160px;
    width: 90%;
}

.list {
    overflow-y: auto;
    max-height: 190px;
}

.list-item:not(:last-child):not(.box)
{
    border-bottom: none !important;
}

h1 {
    font-family: 'Monserrat-Medium', sans-serif;
}

.is-faded {
    opacity: 0.7;
}

.loader {
    margin-bottom: 5px;
}
</style>