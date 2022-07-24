<template>
    <teleport to="body">
            <div class="modal" :class="{'is-active': active && this.infraction}">
                <transition name="infractionDetailsBackupAnim" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-if="active && this.infraction" class="modal-background" @click="close()"></div>
                </transition>

                <transition name="infractionDetailsAnim" enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster">
                    <div v-if="active && this.infraction" class="modal-content">
                        <div class="box has-background-grey-darker">
                            <article class="media">
                                <figure class="media-left">
                                    <p class="image is-64x64">
                                        <img class="slight-round" v-if="infraction.player.gs_avatar && !img_err" :src="`${INST}file/uploads/${infraction.player.gs_avatar.file_id}/avatar.webp`" @error="img_err = true" />
                                        <img class="slight-round" v-else src='@/assets/other/fallback_av.webp' >
                                    </p>
                                </figure>
                                <div class="media-content">
                                    <ISummaryHeader :infraction="infraction" :readonly="!canEdit"></ISummaryHeader>
                                    <ISummaryDetails @closeModal="close()" ref="idetails" :infraction="infraction" :readonly="!canEdit"></ISummaryDetails>
                                </div>
                            </article>
                        </div>
                    </div>
                </transition>
                <button class="modal-close is-large" @click="close()"></button>
            </div>
    </teleport>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { IInfraction } from "@/gflbans/infractions";
import { INSTANCE } from '@/config';
import { Permission } from "@/globals";
import ISummaryHeader from "./ISummaryHeader.vue";
import ISummaryDetails from "./ISummaryDetails.vue";
import { setInfractionUrl } from "./utils";


@Options({
    components: {
        ISummaryHeader,
        ISummaryDetails
    }
})
export default class InfractionSummary extends Vue
{
    // globals
    INST = INSTANCE;

    infraction: IInfraction | null = null
    img_err: boolean = false;
    active: boolean = false;
    orig_addr: string | null = null;

    /* This is called by List to open the modal */

    activate(infraction: IInfraction) {
        console.log('open modal for ', infraction.id)

        this.infraction = infraction;
        this.active = true;
        const tr = this;
        this.$nextTick(() => {
            (tr.$refs.idetails as ISummaryDetails).activate();
        });

        setInfractionUrl(this.infraction.id);
    }

    close() {
        this.active = false;
        setInfractionUrl(null);
    }

    // Can the current user edit this?
    get canEdit()
    {
        if (!this.$store.state.current_user || !this.infraction) { return false; }

        if (this.$store.state.current_user.permissions & Permission.EDIT_OWN_INFRACTIONS && this.infraction.admin === this.$store.state.current_user.current_ips_id) {
            return true
        } else if (this.$store.state.current_user.permissions & Permission.EDIT_ALL_INFRACTIONS) {
            return true
        }

        return false;
    }
}
</script>

<style scoped>
    .box {
        min-height: 300px;
    }
</style>