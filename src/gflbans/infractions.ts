/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { INSTANCE, MAX_INFRACTIONS_PER_PAGE, PRODUCTION } from "@/config";
import { ArgumentError, EncodingError, HTTPError, NetworkError } from "@/errors";
import { IFileInfo } from "./common";

// PlayerObj in Infraction struct from PyAPI
interface IInfractionPlayer {
    gs_service: string;
    gs_id: string;
    gs_name?: string;
    gs_avatar?: IFileInfo;
    ip?: string;
}

// Comment from PyAPI
interface IComment {
    author?: number;
    content: string;
    edit_data?: any; // Optional[Dict[str, Union[datetime, str]]]
    private: boolean;
    rendered?: string;
    created: number;
}

interface GetReply {
  results: IInfraction[],
  total_matched: number
}

interface LocReply {
  location: number;
}

// IInfraction is the client side counterpart of PyAPI's Infraction type
interface IInfraction {
    id: string;
    flags: number;
    created: number;
    expires?: number; // undef if permanent or session
    server?: string;

    player: IInfractionPlayer;
    admin?: number;
    reason: string;

    comments: IComment[];
    files: IFileInfo[];

    // only set if removed
    removed_on?: number;
    removed_by?: number;
    removal_reason?: string;

    // only set if DEC_ONLINE_ONLY
    time_left?: number;
    orig_length?: number;

    // only if tiering
    policy_id: string;

    // last time the infraction was ticked by a heartbeat
    last_heartbeat?: number;
}

async function get_infractions(page: number, query: string | null = null, strict_xql = false): Promise<EncodingError | NetworkError | HTTPError | ArgumentError | IGetInfractionsResult>
{
    let responseText = "";

  try {
    const response = await fetch(`${INSTANCE}api/v1/infractions${query !== null ? "/search?xql_string=" + encodeURIComponent(query) + `&strict_xql=${strict_xql}&` : "/?"}limit=${MAX_INFRACTIONS_PER_PAGE}&skip=${(page - 1) * MAX_INFRACTIONS_PER_PAGE}&load_fast=false`, {
      mode: PRODUCTION ? 'same-origin' : 'cors',
      credentials: PRODUCTION ? 'same-origin' : 'include',
      method: 'GET'
    });

    if (!response.ok) {
      return new HTTPError(response.status, await response.text());
    }

    responseText = await response.text();

    const rpl = JSON.parse(responseText) as GetReply

    return {
        infractions: rpl.results,
        total_results: rpl.total_matched
    }
  } catch (e: any) {
    if (e instanceof SyntaxError) {
      return new EncodingError(e, responseText);
    } else {
      return new NetworkError(e);
    }
  }
}

interface IGetInfractionsResult
{
  infractions: IInfraction[],
  total_results: number;
}

async function get_infraction_position(page: number, find_infraction: string, query: string | null = null, strict_xql = false): Promise<EncodingError | NetworkError | HTTPError | ArgumentError | number>
{
    let responseText = "";

  try {
    const response = await fetch(`${INSTANCE}api/v1/infractions${query !== null ? "/locate_with_search?xql_string=" + encodeURIComponent(query) + `&strict_xql=${strict_xql}&` : "/locate?"}limit=${MAX_INFRACTIONS_PER_PAGE}&skip=${(page - 1) * MAX_INFRACTIONS_PER_PAGE}&load_fast=false&find=${encodeURIComponent(find_infraction)}`, {
      mode: PRODUCTION ? 'same-origin' : 'cors',
      credentials: PRODUCTION ? 'same-origin' : 'include',
      method: 'GET'
    });

    if (!response.ok) {
      return new HTTPError(response.status, await response.text());
    }

    responseText = await response.text();

    const rpl = JSON.parse(responseText) as LocReply

    return rpl.location;
  } catch (e: any) {
    if (e instanceof SyntaxError) {
      return new EncodingError(e, responseText);
    } else {
      return new NetworkError(e);
    }
  }
}

export { IInfraction, IComment, IInfractionPlayer, get_infractions, IGetInfractionsResult, get_infraction_position };