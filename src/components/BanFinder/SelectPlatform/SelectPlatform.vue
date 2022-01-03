<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <p>Select the platform that you were banned from. This won't necessarily be the game you were banned from.</p>
    <ul>
        <template v-for="platform in platforms" :key="platform.platform">
            <li v-if="platform.enabled">
                <SelectPlatformButton :platform="platform.platform"></SelectPlatformButton>
            </li>
        </template>
    </ul>
</template>

<script lang="ts">
import { BAN_FINDER_SERVICES } from "@/config";
import { Options, Vue } from "vue-class-component";

import SelectPlatformButton from './SelectPlatformButton.vue';

@Options({
    components: {
        SelectPlatformButton
    }
})
export default class SelectPlatform extends Vue {
    platforms = BAN_FINDER_SERVICES;
}
</script>
