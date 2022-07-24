<template>
    <table class="table is-hoverable is-fullwidth">
        <thead>
            <th class="is-hidden-touch">Service</th>
            <th class="is-hidden-desktop is-hidden-mobile">Svc</th>
            <th class="is-hidden-mobile">Created</th>
            <th class="is-hidden-touch">Restrictions</th>
            <th class="is-hidden-desktop hide-550">Restr.</th>
            <th>Player</th>
            <th class="is-hidden-touch is-hidden-desktop-only is-hidden-widescreen-only">Admin</th>
            <th class="is-hidden-touch is-hidden-desktop-only" width="100%">Reason</th>
            <th>Remaining</th>
        </thead>
          <tbody>
            <tr v-for="infraction in infractions" :key="infraction.id" @click="openDetailModal(infraction.id)">
              <Infraction :infraction="infraction"></Infraction>
            </tr>
          </tbody>
        </table>
</template>

<script lang="ts">
import { IInfraction } from '@/gflbans/infractions';
import { Vue, Options } from 'vue-class-component';
import Infraction from './Infraction.vue';

@Options({
    props: {
        infractions: {
            required: true
        }
    },
    components: {
        Infraction
    },
    emits: ['openDetails']
})
export default class InfractionList extends Vue {
    infractions!: IInfraction[];

    openDetailModal(infractionId: string) {
        this.$emit('openDetails', infractionId);
    }
}
</script>

<style scoped>
.table {
    border-radius: 5px;
}

th {
    color: white !important;
}

tr {
    cursor: pointer;
}

@media screen and (max-width: 550px) {
    .hide-550 {
        display: none;
    }
}
</style>