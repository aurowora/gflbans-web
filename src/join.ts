/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.

  This file contains methods for joining servers
*/

import { DEFAULT_JOIN_HANDLER } from "./config";
import { ArgumentError } from "./errors";

function joinSteamServer(server_ip: string, game_port: string)
{
    window.open(`steam://connect/${server_ip}:${game_port}`);
}

/* Wrap all of this into a nice interface for other parts of the program */
interface Opener
{
    (server_ip: string, game_port: string): void
}

const SUPPORTED_MODS = new Map<string, Opener>();
SUPPORTED_MODS.set('garrysmod', joinSteamServer);
SUPPORTED_MODS.set('csgo', joinSteamServer);
SUPPORTED_MODS.set('cstrike', joinSteamServer);
SUPPORTED_MODS.set('tf', joinSteamServer);
SUPPORTED_MODS.set('rust', joinSteamServer);

function openServer(game: string, ip: string, game_port: string): null | ArgumentError
{
    let opener = SUPPORTED_MODS.get(game);

    if (!opener && !DEFAULT_JOIN_HANDLER)
    {
        return new ArgumentError(`Cannot join server for unsupported service ${game}`);
    } else if (!opener)
    {
        // typescript moment oof
        if (DEFAULT_JOIN_HANDLER) 
        {
            DEFAULT_JOIN_HANDLER(ip, game_port);
        }
        return null;
    }

    opener(ip, game_port);

    return null;
}

function isGameSupported(game: string)
{
    return SUPPORTED_MODS.has(game) || DEFAULT_JOIN_HANDLER;
}

export { isGameSupported, openServer, Opener };