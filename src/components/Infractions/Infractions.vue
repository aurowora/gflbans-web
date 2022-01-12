<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <div class="pageBase container">
      <div class="section" v-if="infractions && total_infractions > 0">
        <h1 class="title has-text-white">{{ pageTitle }}</h1>
        <h2 class="subtitle is-size-7 has-text-white semitransparent">
          {{ in_view }} of {{ total_infractions }} total results
        </h2>
        <Pagination @goto="handleNav" v-if="pages > 1" :current_page="page" :total_pages="pages"></Pagination>
        <p v-for="infraction in infractions" :key="infraction.id">
          {{ infraction.id }}
        </p>
        <br />
        <Pagination @goto="handleNav" v-if="pages > 1" :current_page="page" :total_pages="pages"></Pagination>
      </div>
      <NoResults :mode="mode" :argument="argument" v-else></NoResults>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import "@/assets/css/pageBase.scss";
import { InfractionModes } from "@/globals";
import { get_infractions, IGetInfractionsResult, IInfraction } from "@/gflbans/infractions";
import {
  ArgumentError,
  EncodingError,
  GFLBansError,
  HTTPError,
  NetworkError,
  setError,
} from "@/errors";
import { sleep, strictParseInt } from "@/gflbans/utils";
import { get_admin_info } from "@/gflbans/admins";
import { IPlayer } from "@/gflbans/servers";
import Pagination from "./Pagination.vue";
import NoResults from "./NoResults.vue";
import { MAX_INFRACTIONS_PER_PAGE } from "@/config";
import { store as globalStore } from "@/state";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

function argAsXql(
  mode: number,
  argument: string
): [string, boolean] | ArgumentError {
  switch (mode) {
    case InfractionModes.VIEW_SERVER: {
      return [`internal_server: "${argument}"`, true];
    }
    case InfractionModes.VIEW_ADMIN: {
      const search = !isNaN(strictParseInt(argument))
        ? `admin_id: "${argument}"`
        : `internal_admin: "${argument}"`;
      return [search, true];
    }
    case InfractionModes.VIEW_PLAYER: {
      const p = JSON.parse(argument) as IPlayer;
      return [`gs_service: "${p.gs_service}" and gs_id: "${p.gs_id}"`, true];
    }
    case InfractionModes.SEARCH: {
      return [argument, false];
    }
  }

  return new ArgumentError(`invalid mode ${mode}`);
}

async function resolveArgument(
  mode: number,
  argument: string
): Promise<string | NetworkError | EncodingError | HTTPError | ArgumentError> {
  switch (mode) {
    case InfractionModes.VIEW_SERVER: {
      // can just check the server store for a server with this id
      while (globalStore.state.servers === undefined) {
        await sleep(30);
      }

      let ret: string = '';

      globalStore.state.servers.forEach((server) => {
        if (server.id === argument) {
          if (server.friendly_name) {
            ret = server.friendly_name;
          } else if (server.hostname) {
            ret = server.hostname;
          } else {
            ret = `${server.ip}:${server.game_port}`;
          }
        }
      });

      return ret;
    }
    case InfractionModes.VIEW_PLAYER: {
      const p = JSON.parse(argument) as IPlayer;
      return `${p.gs_service}/${p.gs_id}`;
    }
    case InfractionModes.VIEW_ADMIN: {
      const r = await get_admin_info(argument);

      if (r instanceof GFLBansError) {
        return r;
      }

      return r.admin_name ? r.admin_name : "whoops_missing_name!";
    }
    default: {
      return new ArgumentError(`cannot resolve an argument in mode ${mode}`);
    }
  }
}

function handleRouteUpdate(
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  tr: Infractions | null
) {
  // Set the loading indicator so the user can see we're thinking
  globalStore.commit("setNavLoader", {
    is_loading: true,
    loader_text: "Loading Infractions…",
  });

  // Extract the mode, argument, and page_num from the query params
  const mode_l = to.query.mode;
  let mode: number;

  if (mode_l && !isNaN(strictParseInt(mode_l.toString()))) {
    mode = strictParseInt(mode_l.toString());
  } else {
    mode = 0;
  }

  const argument = to.query.argument ? to.query.argument.toString() : "";

  const page_num_l = to.query.page;
  let page: number;

  if (page_num_l && !isNaN(strictParseInt(page_num_l.toString()))) {
    page = strictParseInt(page_num_l.toString());
  } else {
    page = 1;
  }

  // simple error handler
  function error(err: GFLBansError)
  {
    setError(err);
  
    // we failed, so remove the loader
    globalStore.commit("setNavLoader", {
      is_loading: false,
      loader_text: "Loading…",
    });
  }

  if (page <= 0)
  {
    return error(new ArgumentError('Cannot have a page that is less than or equal to zero'));
  }

  const prom: any[] = []

  if (mode == InfractionModes.VIEW_SERVER || mode == InfractionModes.VIEW_ADMIN || mode == InfractionModes.VIEW_PLAYER)
  {
    const query = argAsXql(mode, argument);

    if (query instanceof GFLBansError)
    {
      return error(query);
    }

    prom.push(get_infractions(page, query[0], null, query[1]));
    prom.push(resolveArgument(mode, argument));
  } else if (mode == InfractionModes.NORMAL) {
    prom.push(get_infractions(page, null, null, true));
  } else {
    return error(new ArgumentError(`Invalid infraction loader mode ${mode}`))
  }

  Promise.all(prom).then(vals => {
    // the first value should always be the result of get_infractions()

    const val1 = vals[0] as IGetInfractionsResult | GFLBansError;

    if (val1 instanceof GFLBansError)
    {
      return error(val1);
    }

    // The second value, if present, will be the resolved argument value
    let r_arg: string = '';

    if (vals.length === 2)
    {
      const val2 = vals[1] as GFLBansError | string;

      if (val2 instanceof GFLBansError)
      {
        return error(val2);
      }

      r_arg = val2;
    }

    const num_pages = Math.ceil(val1.total_results / MAX_INFRACTIONS_PER_PAGE);
    // bounds check to return an error instead of a broken page
    if (page > num_pages)
    {
      return error(new ArgumentError(`Requested page ${page} exceeds the number of available pages ${num_pages}`))
    }

    if (tr)
    {
      tr.setData(mode, argument, r_arg, page, val1.total_results, val1.infractions);
      next();
    } else {
      next(vm => (vm as Infractions).setData(mode, argument, r_arg, page, val1.total_results, val1.infractions));
    }
    

    // we're done, so clear the loader
    globalStore.commit("setNavLoader", {
      is_loading: false,
      loader_text: "Loading…",
    });
  }).catch(err => {
    return error(new GFLBansError(err));
  })
}

@Options({
  components: {
    Pagination,
    NoResults,
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

  setData(mode: number, orig_arg: string, resolved: string, page_ov: number | null, total: number, infractions: IInfraction[] | null)
  {
    this.mode = mode;
    this.orig_arg = orig_arg;
    this.argument = resolved;
    this.page = page_ov ? page_ov : 1;
    this.total_infractions = total;
    this.infractions = infractions;
  }

  handleNav(page: number)
  {
    console.log('InfractionsPage:: Navigating to ', page)
    this.$router.push(`/infractions?page=${page}&mode=${this.mode}&argument=${encodeURIComponent(this.orig_arg)}`);
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
    return `${(this.page - 1) * 30 + 1}-${
      this.pages > this.page
        ? this.page * 30
        : (this.page - 1) * 30 + this.infractions.length
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
</style>