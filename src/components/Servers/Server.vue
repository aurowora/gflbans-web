<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <article class="message" :class="[$store.getters.isThemeClass]">
        <div @click="toggle" class="message-header" :class="[open ? '' : 'is-closed', online ? 'clickable' : '']">
            <template v-if="online">
                <span>
                    <span class="icon-text">
                        <span class="icon">
                            <font-awesome-icon :icon="osIcon" size="lg" />
                        </span>
                        <span class="icon">
                            <img :src="gameIcon" />
                        </span>
                        <span>{{ hostname }}</span>
                        <span class="ip">({{ ip }})</span>
                    </span>
                </span>
                <span>
                    {{ player_count }} / {{ max_players }}
                </span>
            </template>
            <template v-else>
                <span class="icon-text">
                    <span class="icon">
                        <font-awesome-icon icon="server" size="lg" />
                    </span>
                    <span v-if="friendly_name">
                        {{ friendly_name }} ({{ ip }})
                    </span>
                    <span v-else>
                        {{ ip }}
                    </span>
                </span>
                <span>Offline</span>
            </template>
        </div>
        <div v-if="open && openable" class="message-body has-text-white">
            <ServerInterior ref="interior" :id="id" :map="map" :hostname="hostname" :game="game"></ServerInterior>
        </div>
    </article>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { faApple, faWindows, faLinux } from '@fortawesome/free-brands-svg-icons';
import { GAMES } from "@/globals";
import ServerInterior from "./ServerInterior.vue";

@Options({
    props: {
        id: {
            type: String,
            required: true
        },
        os: String,
        game: String,
        hostname: String,
        ip: {
            type: String,
            required: true
        },
        player_count: Number,
        max_players: Number,
        online: {
            type: Boolean,
            required: true
        },
        friendly_name: String,
        map: String
    },
    components: {
        ServerInterior
    }
})
export default class Server extends Vue {
    // Props
    id!: string;
    os!: string;
    game!: string;
    hostname!: string;
    ip!: string;
    player_count!: number;
    max_players!: number;
    online!: boolean;
    friendly_name!: string;
    map!: string;

    // Data
    open = false;

    //Methods
    toggle()
    {
        if (this.online)
        {
            this.open = !this.open;

            if (this.open)
            {
                const thisRef = this;
                this.$nextTick().then(function () {
                    (thisRef.$refs.interior as ServerInterior).activate();
                })                
            }
        }
    }

    // Comp props
    get osIcon()
    {
        switch (this.os) {
            case "apple":
                return faApple;
            case "windows":
                return faWindows;
            case "Linux":
                return faLinux;    
            default:
                return faLinux;
        }
    }

    get gameIcon()
    {
        if (GAMES.has(this.game))
        {
            return `/games/${GAMES.get(this.game)}`;
        }
        return '/games/fallback.webp';
    }

    get openable()
    {
        return this.online;
    }
}
</script>

<style scoped>
.is-closed {
    border-radius: 4px;
}

.clickable
{
    cursor: pointer;
}

.message {
    margin-bottom: 1rem;
    background-color: transparent;
}

.message-body
{
    height: 250px;
    background-color: hsl(0, 0%, 21%);
}

.icon
{
    margin-right: 0.25rem !important;
    margin-left: 0 !important;
}

.ip {
    margin-left: 0.25rem;
}
</style>