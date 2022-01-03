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
                <PlayerRow v-for="player in players" :key="player.gs_id" :player="player" :server="server"></PlayerRow>
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
import { getPlayers, IPlayer, IServer } from "@/gflbans/servers";
import { Options, Vue } from "vue-class-component";
import PlayerRow from './PlayerRow.vue';

@Options({
    props: {
        server: {
            type: Object,
            required: true
        }
    },
    beforeUnmount: function () {
        if (this.intervalId !== undefined)
        {
            clearInterval(this.intervalId);
        }
    },
    components: {
        PlayerRow
    }
})

export default class ServerInterior extends Vue {
    // prop
    server!: IServer

    // data
    imageErr = false;
    intervalId?: number;
    players: IPlayer[] = [];
    loaded = false;

    // template globals
    INST = INSTANCE;

    // getters
    get game()
    {
        return this.server.mod ? this.server.mod : ''
    }

    get map()
    {
        return this.server.map ? this.server.map : ''
    }

    // Called by the parent component to begin loading when it is opened (so we don't spam the server with useless requests)
    // (Fetches the player list)
    activate()
    {
        console.log('server activated')
        this.refreshPlayers();

        if (this.intervalId)
        {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(this.refreshPlayers, 60000);
    }

    refreshPlayers()
    {
        const t = this;

        getPlayers(this.server.id).then(function (result) {
            if (result instanceof NetworkError || result instanceof EncodingError || result instanceof HTTPError)
            {
                t.$store.commit('setError', result);
            } else {
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