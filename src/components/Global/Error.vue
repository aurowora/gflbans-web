<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <div v-if="shouldShowError" class="modal is-active">
        <div @click="closeError" class="modal-background"></div>
        <div class="modal-content">
            <article class="message is-danger">
                <div class="message-header">
                    <p class="b">An Error has Occurred</p>
                    <button @click="closeError" class="delete" aria-label="delete"></button>
                </div>
                <div class="message-body">
                    <p>{{ errorFormat }}</p>
                    <i>Wait a few minutes and try again. If you continue to experience issues, please <a target="_blank" :href="support_link">contact us</a>.</i>
                </div>
            </article>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { SUPPORT_LINK } from '@/config';

export default class Error extends Vue
{
    support_link = SUPPORT_LINK;

    get shouldShowError()
    {
        return this.$store.state.current_error !== undefined;
    }

    get errorCode()
    {
        console.log(this.$store.state.current_error);
        return this.$store.state.current_error.code;
    }

    get errorFormat()
    {
        return this.$store.state.current_error.formatted;
    }

    closeError()
    {
        this.$store.state.current_error = undefined;
    }
}
</script>

<style scoped>
    i {
        opacity: 0.6;
        font-size: 10pt;
    }

    .b {
        font-family: 'Montserrat-Medium', sans-serif;
    }

    .message-body {
        font-family: 'Montserrat-Regular', sans-serif;;
    }
</style>