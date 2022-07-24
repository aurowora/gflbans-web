<template>
    <table class="table">
        <tbody>
            <tr v-if="!PROD">
                <th class="has-text-white">Internal ID</th>
                <td>{{ infraction.id }}</td>
            </tr>
            <tr v-if="infraction.player.gs_id && infraction.player.gs_service">
                <th class="has-text-white">{{`${infraction.player.gs_service.charAt(0).toUpperCase()}${infraction.player.gs_service.slice(1)}`}} ID</th>
                <td><router-link @click="$emit('closeModal')" :class="[$store.getters.hasTextThemeClass]" :to="`/infractions?mode=3&argument=${JSON.stringify({gs_service: infraction.player.gs_service, gs_id: infraction.player.gs_id})}`">{{infraction.player.gs_id}}</router-link></td>
            </tr>
            <tr v-if="infraction.player.ip">
                <th class="has-text-white">IP Address</th>
                <td><UserIP :ip="infraction.player.ip" v-if="infraction.player.ip != 'MISSING_PERMISSIONS'"></UserIP><span class="is-italic" v-else>IP Address Redacted</span></td>
            </tr>
            <tr>
                <th class="has-text-white">Issued By</th>
                <td>
                    <div class="is-flex"  v-if="(infraction.flags & IF.SYSTEM) === 0">
                        <figure class="image is-24x24">
                            <img class="slight-round" :src="`${INST}file/uploads/${admin.avatar_id}/avatar.webp`" v-if="admin && admin.admin_id === infraction.admin && admin.avatar_id" />
                            <img class="slight-round" src="@/assets/other/fallback_av.webp" v-else />
                        </figure>
                        <router-link @click="$emit('closeModal')" :to="`/infractions?mode=2&argument=${infraction.admin}`" v-if="admin && admin.admin_id === infraction.admin">{{ admin.admin_name }}</router-link>
                        <span v-else>Admin</span>
                    </div>
                    <span v-else>System</span>
                </td>
            </tr>
            <tr>
                <th class="has-text-white">Created</th>
                <td>{{ formatDate(infraction.created) }}</td>
            </tr>
            <tr>
                <th class="has-text-white">{{ expires.key }}</th>
                <td>{{ expires.value }}</td>
            </tr>
            <tr>
                <th class="has-text-white">Scope</th>
                <td v-if="infraction.flags & IF.COMMUNITY">Community Ban</td>
                <td v-if="infraction.flags & IF.GLOBAL">All Servers</td>
                <td v-else>Origin Server Only</td>
            </tr>
            <tr v-if="(infraction.flags & IF.WEB) === 0 && (infraction.server)">
                <th class="has-text-white">Server</th>
                <td>{{ server }}</td>
            </tr>
            <tr>
                <th class="has-text-white">Reason</th>
                <td>{{ infraction.reason }}</td>
            </tr>
            <tr>
                <th class="has-text-white">Restrictions</th>
                <td>
                    <span class="tag" :class="tag.color" :key="tag.text" v-for="tag in tags">
                        {{ tag.text }}
                    </span>
                </td>
            </tr>
            <template v-if="infraction.flags & IF.REMOVED">
                <tr>
                    <th class="has-text-white">Removed By</th>
                    <td v-if="infraction.removed_by">
                        <div class="is-flex">
                            <figure class="image is-24x24">
                                <img class="slight-round" :src="`${INST}file/uploads/${remove_admin.avatar_id}/avatar.webp`" v-if="remove_admin && remove_admin.admin_id === infraction.removed_by && remove_admin.avatar_id" />
                                <img class="slight-round" src="@/assets/other/fallback_av.webp" v-else />
                            </figure>
                            <router-link @click="$emit('closeModal')" :to="`/infractions?mode=2&argument=${infraction.removed_by}`" v-if="remove_admin && remove_admin.admin_id === infraction.removed_by">{{ remove_admin.admin_name }}</router-link>
                            <span v-else>Admin</span>
                        </div>
                    </td>
                    <td v-else>
                        System
                    </td>
                </tr>
                <tr>
                    <th class="has-text-white">Removed On</th>
                    <td>{{ formatDate(infraction.removed_on) }}</td>
                </tr>
                <tr>
                    <th class="has-text-white">Removal Reason</th>
                    <td>{{ infraction.removal_reason }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<script lang="ts">
import UserIP from "@/components/Global/UserIP.vue";
import { INSTANCE, PRODUCTION } from "@/config";
import { GFLBansError, setError } from "@/errors";
import { get_admin_info, IAdminInfo } from "@/gflbans/admins";
import { IInfraction } from "@/gflbans/infractions";
import { InfractionFlags } from "@/globals";
import { Options, Vue } from "vue-class-component";
//import { Vue, Watch } from 'vue-property-decorator'
import { formatDate, formatDur } from "./utils";

@Options({
    props: {
        infraction: {
            required: true
        },
        readonly: {
            required: true,
            type: Boolean
        }
    },
    components: {
        UserIP
    },
    emits: ['closeModal']
})
export default class ISummaryDetails extends Vue
{
    infraction!: IInfraction;
    readonly!: boolean;
    admin: IAdminInfo | null = null;
    remove_admin: IAdminInfo | null = null;

    // GLOBALS
    IF = InfractionFlags;
    INST = INSTANCE;
    PROD = PRODUCTION;
    formatDate = formatDate;

    activate()
    {
        const tr = this;

        if ((this.infraction.flags & InfractionFlags.SYSTEM) === 0 && this.infraction.admin) {
            get_admin_info(this.infraction.admin.toString()).then(function (r) {
                if (r instanceof GFLBansError) {
                    setError(r);
                    return;
                }

                tr.admin = r;
            }).catch(function (e) {
                setError(new GFLBansError(e));
            });
        }

        if (this.infraction.flags & InfractionFlags.REMOVED && this.infraction.removed_by) {
            get_admin_info(this.infraction.removed_by.toString()).then(function (r) {
                if (r instanceof GFLBansError) {
                    setError(r);
                    return;
                }

                tr.remove_admin = r;
            }).catch(function (e) {
                setError(new GFLBansError(e));
            });
        }
    }

    get expires() {
        if (this.infraction.flags & InfractionFlags.PERMANENT) {
            return {
                key: 'Duration',
                value: 'Permanent'
            }
        } else if (this.infraction.flags & InfractionFlags.SESSION) {
            return {
                key: 'Duration',
                value: 'Session'
            }
        } else if (this.infraction.flags & InfractionFlags.DEC_ONLINE_ONLY) {
            return {
                key: 'Time Remaining',
                value: `${this.infraction.time_left ? formatDur(this.infraction.time_left) : 'Missing Time'} (${this.infraction.orig_length ? formatDur(this.infraction.orig_length) : 'Unknown'})`
            }
        } else {
            return {
                key: 'Expires',
                value: formatDate(this.infraction.expires ? this.infraction.expires : 0)
            }
        }
    }

    get server() {
        if (!this.$store.state.servers) { return 'Loading…'; }

        for (let i = 0; i < this.$store.state.servers.length; i++) {
            console.log(this.$store.state.servers[i])
            console.log(this.infraction);
            if (this.$store.state.servers[i].id === this.infraction.server) {
                if (this.$store.state.servers[i].friendly_name) {
                    return this.$store.state.servers[i].friendly_name;
                } else if (this.$store.state.servers[i].hostname) {
                    return this.$store.state.servers[i].hostname;
                } else {
                    return `${this.$store.state.servers[i].ip}:${this.$store.state.servers[i].game_port}`
                }
            }
        }

        return 'Deleted Server';
    }

    get tags() {
        const t = [];

        if (this.infraction.flags & InfractionFlags.VOICE_BLOCK) {
            t.push({
                text: "No Voice Chat",
                color: "is-vmute"
            });
        }

        if (this.infraction.flags & InfractionFlags.CHAT_BLOCK) {
            t.push({
                text: "No Text Chat",
                color: "is-tmute"
            });
        }

        if (this.infraction.flags & InfractionFlags.BAN) {
            t.push({
                text: "Banned",
                color: "is-ban"
            });
        }

        if (this.infraction.flags & InfractionFlags.ADMIN_CHAT_BLOCK) {
            t.push({
                text: "No Admin Chat",
                color: "is-acban"
            });
        }

        if (this.infraction.flags & InfractionFlags.CALL_ADMIN_BAN) {
            t.push({
                text: "No Call Admin",
                color: "is-caban"
            });
        }

        if (t.length === 0) {
            t.push({
                text: "Warning",
                color: "is-warn"
            });
        }

        return t
    }
}
</script>

<style scoped>
.table {
    width: 100%;
}

.image {
    margin-right: 5px;
}

.table td, .table th {
    border-bottom: 1px solid #404040;
}

.tag {
    margin-right: 5px;
}

</style>