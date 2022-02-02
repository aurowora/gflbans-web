<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <article class="message" :class="[$store.getters.isThemeClass]">
        <div @click="toggle" class="message-header" :class="[open ? '' : 'is-closed', server.online ? 'clickable' : '']">
            <template v-if="server.online">
                <span>
                    <span class="icon-text">
                        <span class="icon">
                            <img :src="gameIcon" />
                        </span>
                        <span class="icon">
                            <font-awesome-icon :icon="osIcon" size="lg" />
                        </span>
                        <span>{{ server.hostname }}</span>
                        <span class="ip">({{ server.ip }}:{{ server.game_port }})</span>
                    </span>
                </span>
                <span>
                    {{ server.player_count }} / {{ server.max_players }}
                </span>
            </template>
            <template v-else>
                <span class="icon-text">
                    <span class="icon">
                        <font-awesome-icon icon="server" size="lg" />
                    </span>
                    <span v-if="server.friendly_name">
                        {{ server.friendly_name }} ({{ server.ip }}:{{ server.game_port }})
                    </span>
                    <span v-else>
                        {{ server.ip }}:{{ server.game_port }}
                    </span>
                </span>
                <span>Offline</span>
            </template>
        </div>
        <div class="transition-wrapper">
            <transition name="serverExpandAnimation" enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
            <div v-if="open && openable" class="message-body has-text-white">
                <ServerInterior ref="interior" :server="server"></ServerInterior>
            </div>
        </transition>
        </div>
        
    </article>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { faApple, faWindows, faLinux } from '@fortawesome/free-brands-svg-icons';
import { GAMES } from "@/globals";
import ServerInterior from "./ServerInterior.vue";
import { IServer } from "@/gflbans/servers";

@Options({
    props: {
        server: Object
    },
    components: {
        ServerInterior
    }
})
export default class Server extends Vue {
    // Props
    server!: IServer

    // Data
    open = false;

    //Methods
    toggle()
    {
        if (this.server.online)
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
        switch (this.server.os) {
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
        if (this.server.mod && GAMES.has(this.server.mod))
        {
            return `/games/${GAMES.get(this.server.mod)}`;
        }
        return '/games/fallback.webp';
    }

    get openable()
    {
        return this.server.online;
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
    border: none;
}

.icon
{
    margin-right: 0.25rem !important;
    margin-left: 0 !important;
}

.ip {
    margin-left: 0.25rem;
}

.transition-wrapper {
    overflow: hidden;
}
</style>