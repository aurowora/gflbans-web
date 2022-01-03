/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.

  This file contains methods for opening stuff in external services (like steam and what not)
*/

import { ArgumentError } from "./errors";

function openSteamProfile(profile_id: string)
{
    window.open(`https://steamcommunity.com/profiles/${profile_id}`, '_blank', 'noreferrer');
}

/* Wrap all of this into a nice interface for other parts of the program */
interface Opener
{
    (profile_id: string): void
}

const SUPPORTED_SERVICES = new Map<string, Opener>();
SUPPORTED_SERVICES.set('steam', openSteamProfile)

function openProfile(gs_service: string, gs_id: string): null | ArgumentError
{
    const opener = SUPPORTED_SERVICES.get(gs_service);

    if (!opener)
    {
        return new ArgumentError(`Cannot open profile for unsupported service ${gs_service}`);
    }

    opener(gs_id);

    return null;
}

function isServiceSupported(gs_service: string)
{
    return SUPPORTED_SERVICES.has(gs_service);
}

export { openProfile, isServiceSupported };