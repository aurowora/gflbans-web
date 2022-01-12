/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.

  This contains some common globals from the flags.py file on the server that might be helpful clientside
*/

/*
    Permissions are assigned to users to indicate what they can and cannot do
*/
enum Permission
{
    LOGIN = 1 << 0,
    COMMENT = 1 << 1,
    VIEW_IP_ADDR = 1 << 2,
    CREATE_INFRACTION = 1 << 3,
    EDIT_OWN_INFRACTIONS = 1 << 4,
    EDIT_ALL_INFRACTIONS = 1 << 5,
    ATTACH_FILE = 1 << 6,
    WEB_MODERATOR = 1 << 7,
    MANAGE_SERVERS = 1 << 8,
    MANAGE_VPNS = 1 << 9,
    PRUNE_INFRACTIONS = 1 << 10,
    VIEW_AUDIT_LOG = 1 << 11,
    MANAGE_GROUPS = 1 << 12,
    MANAGE_API_KEYS = 1 << 13,
    BLOCK_VOICE = 1 << 15,
    BLOCK_CHAT = 1 << 16,
    BAN = 1 << 17,
    ADMIN_CHAT_BLOCK = 1 << 18,
    CALL_ADMIN_BLOCK = 1 << 19,
    SCOPE_SUPER_GLOBAL = 1 << 20,
    SCOPE_GLOBAL = 1 << 21,
    VPN_CHECK_SKIP = 1 << 22,
    MANAGE_POLICY = 1 << 23,
    IMMUNE = 1 << 24,
    SKIP_IMMUNITY = 1 << 25,
    RPC_KICK = 1 << 26,
    ASSIGN_TO_SERVER = 1 << 27,
    MANAGE_MAP_ICONS = 1 << 28
}

const adminPermissions = Permission.MANAGE_API_KEYS | Permission.MANAGE_GROUPS | Permission.MANAGE_MAP_ICONS | Permission.MANAGE_POLICY | Permission.MANAGE_SERVERS | Permission.MANAGE_VPNS

/* Theme color to CSS class */
const COLORS = ['link', 'primary', 'info', 'success', 'warning', 'danger'];

/* Games we have icons for */
const GAMES = new Map<string, string>();
GAMES.set('garrysmod', 'garrysmod.svg');
GAMES.set('cstrike', 'css.webp');
GAMES.set('csgo', 'csgo.webp');

enum InfractionModes {
  NORMAL,
  VIEW_SERVER,
  VIEW_ADMIN,
  VIEW_PLAYER,
  SEARCH
}

export { Permission, adminPermissions, COLORS, GAMES, InfractionModes };