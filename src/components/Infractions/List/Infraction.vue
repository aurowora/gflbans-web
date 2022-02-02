<template>
    <td class="is-hidden-mobile">
        <div class="is-flex">
            <div class="icon">
                <font-awesome-icon :icon="service_icon"></font-awesome-icon>
            </div>
        </div>
    </td>
    <td class="nowrap has-text-centered is-hidden-mobile">
        <span class="is-hidden-touch">{{ created_time }}</span>
        <span class="is-hidden-desktop">{{ created_time_short }}</span>
    </td>
    <td class="nowrap hide-550">
        <div class="is-flex">
            <div v-for="icon in restriction_icons" :key="icon.Color" :class="[`has-text-infraction-${icon.Color}`]" class="icon">
                <font-awesome-icon :icon="icon.Icon"></font-awesome-icon>
            </div>
        </div>
    </td>
    <td class="nowrap">
        <div class="is-flex">
            <Player :player="infraction.player"></Player>
        </div>
    </td>
    <td class="cliplong is-hidden-touch is-hidden-desktop-only">{{ infraction.reason }}</td>
    <td>
        <div class="icon-text nowrap" :class="[`has-text-infraction-state-${remaining.Color}`]" :data-tooltip="remaining.Tip">
            <div class="icon">
                <font-awesome-icon :icon="remaining.Icon"></font-awesome-icon>
            </div>
            <span>{{ remaining.Text }}</span>
        </div>
    </td>
</template>

<script lang="ts">
import { IInfraction } from "@/gflbans/infractions";
import { Vue, Options } from "vue-class-component";
import { faSteam, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faQuestion, faVolumeMute, faBan, faCommentSlash, faPhoneSlash, faHandsHelping, faTriangleExclamation, faInfinity, faDiceD6, faCheck, faStopwatch, faPause, faAnkh } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { InfractionFlags } from "@/globals";
import '@/assets/css/infractionColors.sass';
import Player from "./Player.vue";


dayjs.extend(localizedFormat);
dayjs.extend(duration)
dayjs.extend(relativeTime);

const invalid = {
                    Color: 'unknown',
                    Icon: faQuestion,
                    Text: 'Unknown',
                    Tip: 'This infraction is invalid.',
                    Fract: -1
                }

function formatDur(duration: number, caps = false): string {
    let s = dayjs.duration(duration, "seconds").humanize();

    if (caps) {
        s = s.charAt(0).toUpperCase() + s.substring(1)
    }

    console.log('Duration', duration, 'Out', s)

    return s
}

@Options({
    props: {
        infraction: {
            required: true
        }
    },
    components: {
        Player
    }
})
export default class Infraction extends Vue {
    infraction!: IInfraction

    get service_icon() {
        switch (this.infraction.player.gs_service) {
            case 'steam':
                return faSteam;
            case 'discord':
                return faDiscord;
            default:
                return faQuestion;
        }
    }

    get created_time() {
        return dayjs.unix(this.infraction.created).format('lll')
    }

    get created_time_short() {
        return dayjs.unix(this.infraction.created).format('L HH:mm')
    }

    get restriction_icons() {
        const icons = [];

        if (this.infraction.flags & InfractionFlags.BAN) {
            icons.push({
                Icon: faBan,
                Color: 'ban'
            });
        }
        
        if (this.infraction.flags & InfractionFlags.VOICE_BLOCK) {
            icons.push({
                Icon: faVolumeMute,
                Color: 'vmute'
            });
        }

        if (this.infraction.flags & InfractionFlags.CHAT_BLOCK) {
            icons.push({
                Icon: faCommentSlash,
                Color: 'tmute'
            });
        }

        if (this.infraction.flags & InfractionFlags.CALL_ADMIN_BAN) {
            icons.push({
                Icon: faPhoneSlash,
                Color: 'caban'
            });
        }

        if (this.infraction.flags & InfractionFlags.ADMIN_CHAT_BLOCK) {
            icons.push({
                Icon: faHandsHelping,
                Color: 'acban'
            });
        }

        if (icons.length === 0) {
            icons.push({
                Icon: faTriangleExclamation,
                Color: 'warn'
            })
        }

        return icons;
    }

    get remainingRemoved() {
        let r = {
            Color: 'removed',
            Icon: faAnkh,
            Tip: 'This infraction was removed by an administrator',
            Text: ''
        }

        if (this.infraction.flags & InfractionFlags.DEC_ONLINE_ONLY) {
            if (this.infraction.orig_length) {
                r.Text = `Removed (${formatDur(this.infraction.orig_length, true)})`
            } else {
                r.Text = 'Removed'
            }
        } else if (this.infraction.flags & InfractionFlags.PERMANENT) {
            r.Text = 'Removed'
        } else if (this.infraction.flags & InfractionFlags.SESSION) {
            r.Text = 'Removed'
        } else {
            if (this.infraction.expires) {
                r.Text = `Removed (${formatDur(this.infraction.expires - this.infraction.created, true)})`
            } else {
                r.Text = 'Removed'
            }
        }

        return r
    }

    get remaining() {
        console.log(this.infraction);
        const uNow = Date.now() / 1000;

        if (this.infraction.flags & InfractionFlags.REMOVED) {
            return this.remainingRemoved;
        } else if (this.infraction.flags & InfractionFlags.PERMANENT) {
            return {
                Color: 'permanent',
                Icon: faInfinity,
                Text: 'Permanent',
                Tip: 'This infraction does not expire.'
            }
        } else if (this.infraction.flags & InfractionFlags.SESSION) {
            return {
                Color: 'session',
                Icon: faDiceD6,
                Text: 'Session',
                Tip: 'This infraction expires upon disconnecting.'
            }
        } else if (this.infraction.flags & InfractionFlags.DEC_ONLINE_ONLY) {
            if (this.infraction.time_left === undefined || this.infraction.time_left === null)
            {
                return invalid
            } else if  (this.infraction.time_left <= 0) {
                return {
                    Color: 'expired',
                    Icon: faCheck,
                    Text: this.infraction.orig_length ? `Expired (${formatDur(this.infraction.orig_length, true)})` : 'Expired',
                    Tip: 'This infraction has expired.'
                }
            }

            const tick = this.infraction.last_heartbeat && this.infraction.last_heartbeat + 300 > uNow 
            
            return {
                Color: tick ? 'ticking-dec' : 'paused',
                Icon: tick ? faStopwatch : faPause,
                Text: this.infraction.orig_length ? `${formatDur(this.infraction.time_left, true)} of ${formatDur(this.infraction.orig_length, false)}` : `${formatDur(this.infraction.time_left, true)}`,
                Tip: 'This Infraction\'s time remaining decreases while the player is connected.'
            }
        } else {
            if (!this.infraction.expires) {
                return invalid
            }

            const originalDuration = this.infraction.expires - this.infraction.created;
            const timeRemaining = this.infraction.expires - uNow;
            const expired = timeRemaining <= 0;

            return {
                Color: expired ? 'expired' : 'ticking-normal',
                Icon: expired ? faCheck : faStopwatch,
                Text: expired ? `Expired (${formatDur(originalDuration, true)})` : `${formatDur(timeRemaining, true)} of ${formatDur(originalDuration, false)}`,
                Tip: expired ? 'The infraction is no longer in force.' : 'This infraction expires at a fixed time.'
            }
        }
    }
}
</script>

<style scoped>
td {
    vertical-align: middle;
}

.table td {
    border-bottom: 1px solid #404040;
}

.nowrap {
    white-space: nowrap;
    flex-wrap: nowrap;
    text-overflow: clip;
}

.cliplong {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    /* idk why but it breaks when i remove this lmao */
    max-width: 150px;
}

@media screen and (max-width: 550px) {
    .hide-550 {
        display: none;
    }
}
</style>