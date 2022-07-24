<template>
    <div class="notification is-danger" v-if="!warningDismissed">
        <button @click="closeWarning" class="delete"></button>
            <span>Infraction reasons, attached videos, and photo evidence are not filtered. As such, you may see potentially unsavory content here. If you do not wish to see such content, feel free to visit <a :href="COMMUNITY_HOME">our website</a> instead.</span>
    </div>
</template>

<script lang="ts">
import { COMMUNITY_HOME } from '@/config';
import { Vue } from 'vue-class-component';

const sv = localStorage.getItem('gflbans_infraction_warning');

export default class InfractionWarning extends Vue
{
    warningDismissed = sv != null;
    COMMUNITY_HOME = COMMUNITY_HOME;

    closeWarning()
    {
        this.warningDismissed = true;
        localStorage.setItem('gflbans_infraction_warning', '1');
    }
}
</script>