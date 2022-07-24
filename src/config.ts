/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.

  This file acts as a configuration file of sorts of the app
*/

import { Opener } from "./join";

/*
    The GFLBans instance to use

    This must always end with a slash

    NOTE THAT THIS APPLICATION MUST BE HOSTED ON THE SAME DOMAIN AS THE API
*/
export const INSTANCE = "https://bans.aurora.vg/";

/*
    The Public URI of this application

    This is used to generate the redirect uri for the login process, so make sure it's also added to the IPS OAuth app
*/
export const PUBLIC_URI  = "http://127.0.0.1:8080/";

/*
  Community's Home Page
*/
export const COMMUNITY_HOME = 'https://gflclan.com';


/*
  The name of the application for branding purposes.

  You'll want to change this in public/index.html too.
*/
export const APP_NAME = "GFLBans";

/*
  The link to direct a user to for support if something goes wrong.
*/

export const SUPPORT_LINK = "https://gflclan.com/messenger/compose/?to=1623";

/*
  Set to true for production builds.

  PRODUCTION = false relaxes security restrictions around cookies / CORS, so be sure to enable PRODUCTION when in PRODUCTION
*/
export const PRODUCTION = false;

/*
  Set to the default URL to bring people looking to appeal their bans.

  Used if the server doesn't have an associated appeal form
*/
export const DEFAULT_APPEALS_FORM = "https://gflclan.com/messenger/compose/?to=1028";

/* 
  Configure which services are enabled for the ban finder

  If only one is enabled, it will be used without prompting the user
*/
export const BAN_FINDER_SERVICES = [
  {platform: 'steam', enabled: true},
  {platform: 'discord', enabled: true}
]

/*
  The name of the community that this is for. 

  Used throughout various templates
*/
export const COMMUNITY_NAME = "GFLClan";

/* 
  Set a default handler for connect button

  ex: to use steam connect links for anything not explicitly supported: export const DEFAULT_JOIN_HANDLER = joinSteamServer
*/
export const DEFAULT_JOIN_HANDLER: Opener | null = null;

/*
  Number of infractions to show per page

  Must not exceed 50
*/

export const MAX_INFRACTIONS_PER_PAGE: number = 30;