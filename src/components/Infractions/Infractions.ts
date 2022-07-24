/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.

  This file contains some of the logic from Infractions.vue (to clean stuff up)
*/

import { MAX_INFRACTIONS_PER_PAGE } from "@/config";
import { ArgumentError, EncodingError, GFLBansError, HTTPError, NetworkError, setError } from "@/errors";
import { get_admin_info } from "@/gflbans/admins";
import { get_infractions, get_infraction_position, IGetInfractionsResult, IInfraction } from "@/gflbans/infractions";
import { IPlayer } from "@/gflbans/servers";
import { sleep, strictParseInt } from "@/gflbans/utils";
import { InfractionModes } from "@/globals";
import { store as globalStore } from "@/state";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

interface InfractionsPage {
    setData(mode: number, orig_arg: string, resolved: string, page_ov: number | null, total: number, infractions: IInfraction[] | null, open_idx: string | null): void
}

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
    tr: InfractionsPage | null
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

    // check if we need to find something
    const find = to.params.infractionId ? to.params.infractionId.toString() : null;
    //const find = to.hash !== '' ? to.hash.slice(1) : null;
  
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

    // if we're going to find an infraction, we need to wait to call this
    function a() {
        const prom: any[] = []
      
        if (mode == InfractionModes.VIEW_SERVER || mode == InfractionModes.VIEW_ADMIN || mode == InfractionModes.VIEW_PLAYER)
        {
          const query = argAsXql(mode, argument);
      
          if (query instanceof GFLBansError)
          {
            return error(query);
          }
      
          prom.push(get_infractions(page, query[0], query[1]));
          prom.push(resolveArgument(mode, argument));
        } else if (mode == InfractionModes.NORMAL) {
          prom.push(get_infractions(page, null, true));
        } else if (mode == InfractionModes.SEARCH) {
          prom.push(get_infractions(page, argument, false));
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
          if (page > num_pages && num_pages > 0)
          {
            return error(new ArgumentError(`Requested page ${page} exceeds the number of available pages ${num_pages}`))
          }
      
          if (tr)
          {
            tr.setData(mode, argument, r_arg, page, val1.total_results, val1.infractions, find);
            next();
          } else {
            // typescript moment
            next(vm => ((vm as unknown) as InfractionsPage).setData(mode, argument, r_arg, page, val1.total_results, val1.infractions, find));
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

    // if we need to find something, we first need to get the index of the located infraction
    if (find) {
      let p;

      if (mode === InfractionModes.NORMAL) {
        p = get_infraction_position(page, find, null);
      } else {
        const args = argAsXql(mode, argument)

        if (args instanceof GFLBansError)
        {
          return error(args);
        }

        p = get_infraction_position(page, find, args[0], args[1]);
      }

      p.then(function (r) {
        if (r instanceof GFLBansError) {
          return error(r);
        }

        // override the page
        page = Math.floor((r - 1) / MAX_INFRACTIONS_PER_PAGE) + 1;
        console.log('find inf', find, 'pos', r, 'page', page);
        a();
      }).catch(function (e) {
        return error(new GFLBansError(e));
      })
    } else {
      a()
    }
  }

  export { handleRouteUpdate };