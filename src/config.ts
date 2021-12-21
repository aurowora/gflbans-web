/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.

  This file acts as a configuration file of sorts of the app
*/

/*
    The GFLBans instance to use

    This must always end with a slash
*/
const INSTANCE = "https://bans.aurora.vg/";

/*
    The Public URI of this application

    This is used to generate the redirect uri for the login process, so make sure it's also added to the IPS OAuth app
*/
const PUBLIC_URI  = "http://127.0.0.1:8080/";

export {INSTANCE, PUBLIC_URI};