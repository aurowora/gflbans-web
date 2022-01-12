/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { HTTPError, NetworkError, EncodingError, StateError, SecurityError, GFLBansError, setError } from '@/errors';
import { INSTANCE, PRODUCTION, PUBLIC_URI } from '@/config';
import { slash_fix } from '@/gflbans/utils';
import { v4 as uuidv4 } from 'uuid';
import { State } from '@/state';
import { Store } from 'vuex';

// Just an alias so I need to type a bit less
const uri_part = encodeURIComponent;

/*
  LoginData is the client side representation of the server's InitializeReply type
*/
class LoginData {
  client_id: string;
  auth_uri: string;
  scope: string;

  constructor(_dict: { client_id: string, auth_uri: string, scope: string }) {
    this.client_id = _dict.client_id;
    this.auth_uri = _dict.auth_uri;
    this.scope = _dict.scope;
  }

  /*
    Returns the URI to redirect the user to in order to begin the login process
    Result order is URI, STATE, PKCE VERIFIER STRING
  */
  async uri(): Promise<[string, string, string]> {
    const state = uuidv4();
    const pkce_verifier = uuidv4();
    // This generates a SHA-256 hash as a base64 encoded string
    const pkce_hash = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', (new TextEncoder().encode(pkce_verifier)))))).replace('+', '-').replace('/', '_').replace(/=+$/, '');

    return [`${slash_fix(this.auth_uri)}?response_type=code&client_id=${uri_part(this.client_id)}&redirect_uri=${uri_part(slash_fix(PUBLIC_URI) + 'login/handle')}&scope=${uri_part(this.scope)}&state=${uri_part(state)}&code_challenge=${uri_part(pkce_hash)}&code_challenge_method=S256`, state, pkce_verifier];
  }
}


/*
  fetch_login_data() retrieves data needed to proceed with the login process from
  the GFLBans instance as a LoginDataor returns an error if unsuccessful
*/
async function fetch_login_data(): Promise<HTTPError | NetworkError | EncodingError | LoginData> {
  let responseObj: { client_id: string, auth_uri: string, scope: string };
  let responseText;

  try {
    const response = await fetch(`${INSTANCE}api/v1/front/initialize`, {
      mode: PRODUCTION ? 'same-origin' : 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      return new HTTPError(response.status, await response.text());
    }

    responseText = await response.text();
  } catch (e: any) {
    return new NetworkError(e);
  }

  try {
    responseObj = JSON.parse(responseText);
  } catch (e: any) {
    return new EncodingError(e, responseText);
  }

  return new LoginData(responseObj);
}


/*
  Attempts to establish a session by finishing the login. The session is set as a cookie and any
  requests including credentials will have the cookie added by the browser. Returns an error if
  the request is unsuccessful and null if successful.
*/
async function create_session(auth_code: string, pkce_verifier: string): Promise<HTTPError | NetworkError | null> {
  try {
    const response = await fetch(`${INSTANCE}api/v1/front/login?code=${uri_part(auth_code)}&code_verifier=${uri_part(pkce_verifier)}&redirect_uri=${uri_part(slash_fix(PUBLIC_URI) + 'login/handle')}`, {
      mode: PRODUCTION ? 'same-origin' : 'cors',
      credentials: PRODUCTION ? 'same-origin' : 'include'
    });

    if (!response.ok) {
      return new HTTPError(response.status, await response.text());
    }
  } catch (e: any) {
    return new NetworkError(e);
  }

  return null;
}

/*
  Logs out of GFLBans. GFLBans will delete the gflbans_session cookie set on us
  and will remove the associated session database object. An error will be returned
  if it fails to log us out or null will be returned if successful
*/
async function log_out(): Promise<HTTPError | NetworkError | null> {
  try {
    const response = await fetch(`${INSTANCE}api/v1/front/logout`, {
      mode: PRODUCTION ? 'same-origin' : 'cors',
      credentials: PRODUCTION ? 'same-origin' : 'include'
    });

    if (!response.ok) {
      return new HTTPError(response.status, await response.text());
    }
  } catch (e: any) {
    return new NetworkError(e);
  }

  return null;
}

/*
  Initializes a new CSRF token. This token should live for the session and not be saved.
*/
async function csrf_init(): Promise<HTTPError | NetworkError | EncodingError | string> {
  let responseText;
  let token_struct: { csrf_token: string };

  try {
    const response = await fetch(`${INSTANCE}api/v1/front/csrf_init`, {
      mode: PRODUCTION ? 'same-origin' : 'cors',
      credentials: PRODUCTION ? 'same-origin' : 'include'
    });

    if (!response.ok) {
      return new HTTPError(response.status, await response.text());
    }

    responseText = await response.text()
  } catch (e: any) {
    return new NetworkError(e);
  }

  try {
    token_struct = JSON.parse(responseText);
    return token_struct.csrf_token;
  } catch (e: any) {
    return new EncodingError(e, responseText);
  }
}

/*
  Client-side representation of the server side LoginWho struct
*/
class CurrentUserInfo {
  current_ips_id: number;
  internal_id: string;
  avatar_id?: string;
  admin_name: string;
  permissions: number;

  constructor(obj: { current_ips_id: number, internal_id: string, avatar_id?: string, admin_name: string, permissions: number }) {
    this.current_ips_id = obj.current_ips_id;
    this.internal_id = obj.internal_id;
    this.avatar_id = obj.avatar_id;
    this.admin_name = obj.admin_name;
    this.permissions = obj.permissions;
  }
}

/*
  Gets the current user, if any. Returns CurrentUserInfo if successful and an error if not
*/
async function get_current_user(): Promise<HTTPError | NetworkError | EncodingError | CurrentUserInfo> {
  let responseText = "";

  try {
    const response = await fetch(`${INSTANCE}api/v1/front/whoami`, {
      mode: PRODUCTION ? 'same-origin' : 'cors',
      credentials: PRODUCTION ? 'same-origin' : 'include'
    });

    if (!response.ok) {
      return new HTTPError(response.status, await response.text());
    }

    responseText = await response.text();
    return new CurrentUserInfo(JSON.parse(responseText));
  } catch (e: any) {
    if (e instanceof SyntaxError) {
      return new EncodingError(e, responseText);
    } else {
      return new NetworkError(e);
    }
  }
}

/* Tries to finish the login */
async function finish_login(store: Store<State>, auth_code: string, query_state: string): Promise<HTTPError | NetworkError | StateError | SecurityError | null> {
  const state = localStorage.getItem('oauth_state');
  if (state == null) { return new StateError('Expected stored value oauth_state, found nothing. (Do not navigate here directly!)') }
  localStorage.removeItem('oauth_state');

  if (state != query_state) {
    return new SecurityError('State manipulation detected (local state ≠ query state). Refusing to continue.');
  }

  const pkce = localStorage.getItem('oauth_pkce');
  if (pkce == null) { return new StateError('Expected stored value oauth_pkce, found nothing. (Do not navigate here directly!)'); }
  localStorage.removeItem('oauth_pkce');

  const r = await create_session(auth_code, pkce);

  if (r !== null) // Error
  {
    return r;
  }

  const user = await get_current_user();

  if (user instanceof CurrentUserInfo) {
    store.commit('setUser', user);
  } else {
    return user; // Error
  }

  return null;
}

function check_login(store: Store<State>) {
  store.commit('setUser', undefined);
  // Fetch the current login
  store.commit('setLoading', true);

  get_current_user().then(function (r) {
    if (r instanceof HTTPError && r.http_code === 401) {
      console.log('not logged in: OK')
    } else if (r instanceof NetworkError || r instanceof EncodingError) {
      setError(r);
    } else { // CurrentUserInfo
      store.commit('setUser', r);
    }
  }).catch(function (e) {
    setError(new GFLBansError(e));
  }).finally(function () {
    store.commit('setLoading', false);
  });
}

export { LoginData, CurrentUserInfo, fetch_login_data, create_session, log_out, csrf_init, get_current_user, finish_login, check_login };