<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
<br />
<div class="container">
    <Steps :step="wizardStep"></Steps>
    <SelectPlatform v-if="wizardStep == 0"></SelectPlatform>
    <SelectBan v-if="wizardStep == 1"></SelectBan>
    <Appeal v-if="wizardStep == 2"></Appeal>
</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Appeal from "./Appeal.vue";
import SelectBan from "./SelectBan.vue";
import SelectPlatform from "./SelectPlatform/SelectPlatform.vue";
import Steps from "./Steps.vue";

@Options({
    components: {
        Steps,
        SelectPlatform,
        SelectBan,
        Appeal
    }
})
export default class BanFinder extends Vue {
    wizardStep: number = 0;
}
</script>