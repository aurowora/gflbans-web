<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <div class="columns transition-wrapper">
        <div class="column is-one-third is-hidden-mobile is-flex is-flex-direction-column is-align-items-center">
            <figure class="image">
                <img v-if="!imageErr" :src="`${INST}maps/${game}/${map}`" @error="mapImageFailed">
                <img v-else src="@/assets/unknown_map.webp">
            </figure>
            <p>{{ map }}</p>
            <div class="field is-grouped">
                <p class="control">
                    <button v-if="canJoinServer" @click="joinServer" class="button is-small" :class="[$store.getters.isThemeClass]">Connect</button>
                </p>
                <p class="control">
                    <router-link :to="`/infractions?mode=${serverMode}&argument=${server.id}`" class="button is-small" :class="[$store.getters.isThemeClass]">View Infractions</router-link>
                </p>
            </div>
        </div>
            <transition name="serverPlayerListAnim" mode="out-in" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
                <div key=1 class="column" v-if="loaded">
                    <h1 class="is-size-5 has-text-white">Players ({{players.length}})</h1>
                    <div class="list has-overflow-ellipsis" v-if="players.length > 0">
                        <PlayerRow v-for="player in players" :key="player.gs_id" :player="player" :server="server"></PlayerRow>
                    </div>
                    <p class="has-text-white is-faded is-size-6" v-else>No players are connected.</p>
                </div>
                <div key=2 class="column is-flex is-flex-direction-column is-align-items-center is-justify-content-center" v-else>
                    <span class="loader"></span>
                    <span>Loading player list…</span>
                </div>
            </transition>
    </div>
</template>

<script lang="ts">
import { INSTANCE } from "@/config";
import { EncodingError, GFLBansError, HTTPError, NetworkError, setError } from "@/errors";
import { getPlayers, IPlayer, IServer } from "@/gflbans/servers";
import { InfractionModes } from "@/globals";
import { isGameSupported, openServer } from "@/join";
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
        PlayerRow,
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
    serverMode = InfractionModes.VIEW_SERVER

    // getters
    get game()
    {
        return this.server.mod ? this.server.mod : ''
    }

    get map()
    {
        return this.server.map ? this.server.map : ''
    }

    get canJoinServer()
    {
        return isGameSupported(this.game);
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
                setError(result);
            } else {
                console.log('Got player list', result);
                t.players = result;
                t.loaded = true;
            }
        }).catch(function (e) {
            setError(new GFLBansError(e));
        })
    }

    mapImageFailed()
    {
        this.imageErr = true;
    }

    joinServer()
    {
        openServer(this.game, this.server.ip, this.server.game_port);
    }
}
</script>

<style scoped>
.image {
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

.field {
    margin-top: 30px;
}

.transition-wrapper {
    overflow: hidden;
}
</style>
