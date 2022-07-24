<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <div class="pageBase ibase">
      <div class="section" v-if="infractions && total_infractions > 0">
        <InfractionWarning></InfractionWarning>
        <h1 class="title has-text-white">{{ pageTitle }}</h1>
        <h2 class="subtitle is-size-7 has-text-white semitransparent">
          {{ in_view }} of {{ total_infractions }} total results
        </h2>
        <Pagination @goto="handleNav" v-if="pages > 1" :current_page="page" :total_pages="pages"></Pagination>
        <InfractionList @openDetails="openDetails" :infractions="infractions"></InfractionList>
        <Pagination @goto="handleNav" v-if="pages > 1 && infractions.length >= 15" :current_page="page" :total_pages="pages"></Pagination>
      </div>
      <NoResults :mode="mode" :argument="argument" v-else></NoResults>
  </div>
  <InfractionSummary ref="detailsModal"></InfractionSummary>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import "@/assets/css/pageBase.scss";
import { InfractionModes } from "@/globals";
import { IInfraction } from "@/gflbans/infractions";
import {
  ArgumentError,
  setError,
} from "@/errors";
import Pagination from "./List/Pagination.vue";
import NoResults from "./List/NoResults.vue";
import { MAX_INFRACTIONS_PER_PAGE } from "@/config";
import InfractionList from "./List/InfractionList.vue";
import { handleRouteUpdate } from './Infractions';
import InfractionSummary from "./Summary/InfractionSummary.vue";
import InfractionWarning from "./InfractionWarning.vue";

@Options({
  components: {
    Pagination,
    NoResults,
    InfractionList,
    InfractionSummary,
    InfractionWarning
  },
  // eslint-disable-next-line no-unused-vars
  beforeRouteEnter: function (to, from, next) {
    handleRouteUpdate(to, next, null);
  },
  // eslint-disable-next-line no-unused-vars
  beforeRouteUpdate: function (to, from, next) {
    handleRouteUpdate(to, next, this as Infractions);
  },
})
export default class Infractions extends Vue {
  mode: number = 0;
  orig_arg: string = '';
  argument: string = "";
  page: number = 1;
  total_infractions: number = 0;
  infractions: IInfraction[] | null = null;

  // template globals
  perPage = MAX_INFRACTIONS_PER_PAGE;

  setData(mode: number, orig_arg: string, resolved: string, page_ov: number | null, total: number, infractions: IInfraction[] | null, open: string | null)
  {
    this.mode = mode;
    this.orig_arg = orig_arg;
    this.argument = resolved;
    this.page = page_ov ? page_ov : 1;
    this.total_infractions = total;
    this.infractions = infractions;

    if (open !== null && infractions !== null) {
      for (let i = 0; i < infractions.length; i++) {
        if (infractions[i].id === open) {
          (this.$refs.detailsModal as InfractionSummary).activate(infractions[i]);
          return;
        }
      }

      console.log(`could not find ${open} in ${infractions}`)
    }
  }

  handleNav(page: number)
  {
    console.log('InfractionsPage :: Navigating to ', page)

    // handle reload
    if (page === this.page)
    {
      this.$router.go(0);
      return;
    }

    this.$router.push(`/infractions?page=${page}&mode=${this.mode}&argument=${encodeURIComponent(this.orig_arg)}`);
  }

  openDetails(infractionId: string) {
    if (this.infractions === null) { return; }

    for (let i = 0; i < this.infractions.length; i++) {
      if (this.infractions[i].id === infractionId)
      {
        (this.$refs.detailsModal as InfractionSummary).activate(this.infractions[i]);
        break;
      }
    }
  }

  get pageTitle() {
    switch (this.mode) {
      case InfractionModes.NORMAL: {
        return "Infractions";
      }
      case InfractionModes.VIEW_SERVER: {
        return `Infractions from ${this.argument}`;
      }
      case InfractionModes.VIEW_ADMIN: {
        return `Infractions by ${this.argument}`;
      }
      case InfractionModes.VIEW_PLAYER: {
        return `Infractions on ${this.argument}`;
      }
      case InfractionModes.SEARCH: {
        return "Search";
      }
      default: {
        setError(
          new ArgumentError(
            `Selected mode ${this.mode} is not supported. Bad link or query param manipulation.`
          )
        );
        return "Invalid Mode!!!!";
      }
    }
  }

  get in_view() {
    if (this.infractions === null) {
      return "";
    }
    return `${(this.page - 1) * MAX_INFRACTIONS_PER_PAGE + 1}-${
      this.pages > this.page
        ? this.page * MAX_INFRACTIONS_PER_PAGE
        : (this.page - 1) * MAX_INFRACTIONS_PER_PAGE + this.infractions.length
    }`;
  }

  get pages() {
    return Math.ceil(this.total_infractions / MAX_INFRACTIONS_PER_PAGE);
  }
}
</script>
  
<style scoped>
.semitransparent {
  opacity: 0.6;
}

.ibase {
  padding-left: 5%;
  padding-right: 5%;
}
</style>