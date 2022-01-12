/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { EncodingError, HTTPError, NetworkError } from "@/errors";
import { csrf_init } from "./login";

/*
    Appends a forward slash to a string if it hasn't already got one
*/
function slash_fix(input: string): string
{
    if (input.endsWith('/'))
        return input;
    return input.endsWith('/') ? input : input + '/';
}

/* Awaitable sleep function */
function sleep(msToSleep: number): Promise<void>
{
    return new Promise((resolve: TimerHandler) => setTimeout(resolve, msToSleep));
}

let csrf_token: string | undefined;

async function get_csrf_token(): Promise<string | NetworkError | EncodingError | HTTPError >
{
    if (!csrf_token)
    {
        const r = await csrf_init()

        if (typeof(r) !== 'string')
        {
            return r;
        }

        csrf_token = r;
    }

    return csrf_token;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// necessary because we use int parsibility to tell between mongo admin ids and ips admin ids in some parts
function strictParseInt(value: string) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
      return Number(value)
    } else {
      return NaN
    }
}

export {slash_fix, sleep, get_csrf_token, strictParseInt};