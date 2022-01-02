/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { INSTANCE, PRODUCTION } from "@/config";
import { EncodingError, HTTPError, NetworkError } from "@/errors";
import { State } from "@/state";
import { Store } from "vuex";
import { sleep } from "./utils";

// Responsible for fetching (and keeping up to date) the Servers in the Vuex store, which are used by the Servers page
class ServerManager
{
    private vuexStore: Store<State>;

    constructor(store: Store<State>)
    {
        this.vuexStore = store;
    }

    // Update servers in the store
    private async updateServers(): Promise<NetworkError | HTTPError | EncodingError | null>
    {
        try {
            const response = await fetch(`${INSTANCE}api/v1/server/`, {
                mode: PRODUCTION ? 'same-origin' : 'cors',
                credentials: 'omit'
            });

            const text = await response.text();

            if (!response.ok)
            {
                return new HTTPError(response.status, text);
            }

            try {
                console.log('ServerManager :: updated servers');
                this.vuexStore.commit('setServers', (JSON.parse(text) as IServer[]));
            } catch (e: any)
            {
                return new EncodingError(e, text);
            }
        } catch (e: any)
        {
            return new NetworkError(e);
        }

        return null
    }

    async start(): Promise<NetworkError | EncodingError | HTTPError>
    {
        console.log('ServerManager :: start()');
        for (;;)
        {
            console.log('ServerManager :: updating server information from GFLBans');

            const v = await this.updateServers();

            if (v !== null)
            {
                return v;
            }

            // Only do this once every 60 seconds
            await sleep(60000);
        }
    }
}

function startServerManager(store: Store<State>)
{
    const sm = new ServerManager(store);

    function d() {
        sm.start().then(function (err) {
            console.log('ServerManager died, restarting: ', err);
            d();
        });
    }

    d();   
}

// Clientside representation of API's Server type
interface IServer
{
    id: string;
    ip: string;
    game_port: string;
    enabled: boolean;
    friendly_name?: string;

    // If this is true, the other optional params should also be set
    online: boolean;
    hostname?: string;
    os?: string;
    player_count?: number;
    max_players?: number;
    mod?: string;
    map?: string;
    is_locked?: boolean;

    // Appeal Form for BanFinder
    appeals_form?: string;
}

// Clientside representation of a heartbeat's player
interface IPlayer
{
    gs_service: string;
    gs_id: string;
    gs_name: string;
    gs_avatar?: IFileInfo;
    playtime: number;
}

// File info with only the bits we care about
interface IFileInfo
{
    file_id: string;
}

// Fetches the player list
async function getPlayers(server_id: string): Promise<NetworkError | HTTPError | EncodingError | IPlayer[]>
{
    try {
        const response = await fetch(`${INSTANCE}api/v1/server/${server_id}/players`, {
            mode: PRODUCTION ? 'same-origin' : 'cors',
            credentials: 'omit'
        });

        const text = await response.text();

        if (!response.ok)
        {
            return new HTTPError(response.status, text);
        }

        try {
            return (JSON.parse(text) as IPlayer[]);
        } catch (e) {
            return new EncodingError(e, text);
        }

    }
    catch (e)
    {
        return new NetworkError(e);
    }
}

export { IServer, ServerManager, startServerManager, getPlayers, IPlayer, IFileInfo }