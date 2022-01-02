/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { COMMUNITY_NAME } from "./config";

const PLATFORMS = {
    'discord': {
        'name': 'Discord',
        'banFinderDesc': `Any of ${COMMUNITY_NAME}'s Discord servers.`,
        'primaryColor': '#5865F2',
        'secondaryColor': '#6e78e6',
        'faIcon': 'discord'
    },
    'steam': {
        'name': 'Steam',
        'banFinderDesc': 'Any game that makes use of Steam for its multiplayer functionality. This includes Garry\'s Mod, CounterStrike: Global Offensive, CounterStrike: Source, Team Fortress 2, Rust, and others.',
        'primaryColor': '',
        'secondaryColor': '',
        'faIcon': 'steam'
    }
}

export { PLATFORMS };