/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { INSTANCE, PRODUCTION } from "@/config";
import { HTTPError, NetworkError } from "@/errors";
import { get_csrf_token } from "./utils";

async function kick_player(server: string, gs_service: string, gs_id: string): Promise<null | HTTPError | NetworkError>
{
    try {
        const csrf_token = await get_csrf_token()
        if (typeof(csrf_token) !== 'string') { return csrf_token }

        const response = await fetch(`${INSTANCE}api/v1/rpc/kick`, {
            mode: PRODUCTION ? 'same-origin' : 'cors',
            credentials: PRODUCTION ? 'same-origin' : 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token
            },
            body: JSON.stringify({
                server_id: server,
                player: {
                    gs_service: gs_service,
                    gs_id: gs_id
                }
            })
        });

        if (!response.ok)
        {
            return new HTTPError(response.status, await response.text());
        }

        return null;
    } catch (e) {
        return new NetworkError(e);
    }
}

export {kick_player}