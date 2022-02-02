<template>
    <teleport to="body">
        <div class="modal" :class="{'is-active': active}" v-if="active">
            <div class="modal-background" @click="active = false"></div>
            <div class="modal-content">
                <div class="box has-background-grey-darker">
                    <article class="media-content">
                        <figure class="image is-64x64">
                            <img class="is-rounded" v-if="infraction.player.gs_avatar && !img_err" :src="`${INST}file/uploads/${infraction.player.gs_avatar.file_id}/avatar.webp`" @error="img_err = true" />
                            <img  class="is-rounded" v-else src="@/assets/animated/pinwheel.webp" >
                        </figure>
                    </article>
                </div>
            </div>
            <button class="modal-close is-large" @click="active = false"></button>
        </div>
    </teleport>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { IInfraction } from "@/gflbans/infractions";
import { INSTANCE } from '@/config';

export default class Modal extends Vue
{
    // globals
    INST = INSTANCE;

    infraction: IInfraction | null = null
    img_err: boolean = false;
    active: boolean = false;

}
</script>

<style scoped></style>