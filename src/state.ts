/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { InjectionKey } from 'vue';
import { createStore, Store, useStore as _useStore } from 'vuex';
import { CurrentUserInfo } from './gflbans/login';
import { adminPermissions, COLORS } from '@/globals';
import { GFLBansError } from './errors';
import { IServer } from './gflbans/servers';
import { ILoaderInfo } from './loading';

// Changes to this need to be applied to vuex.d.ts
interface State {
    current_user?: CurrentUserInfo;
    loading: boolean;
    theme_color: number;
    servers?: IServer[];
    small_loading: ILoaderInfo
}

const colorAtLoad = localStorage.getItem('gflbans_color');

const key: InjectionKey<Store<State>> = Symbol();
const store = createStore<State>({
    state: {
        // app state
        current_user: undefined,
        loading: false,
        servers: undefined,
        small_loading: {is_loading: false, loader_text: 'Loading…'},

        // global user conf
        theme_color: colorAtLoad ? parseInt(colorAtLoad) : 0,
    },
    getters: {
        isAdmin(state)
        {
            if (state.current_user)
            {
                return (state.current_user.permissions & adminPermissions) !== 0;
            } else {
                return false;
            }
        },
        isLoggedIn(state)
        {
            return state.current_user !== undefined;
        },
        isThemeClass(state)
        {
            const themeIdx = state.theme_color;

            if (themeIdx > COLORS.length - 1)
            {
                return 'is-link'
            } else {
                return `is-${COLORS[themeIdx]}`
            }
        },
        hasTextThemeClass(state)
        {
            const themeIdx = state.theme_color;

            if (themeIdx > COLORS.length - 1)
            {
                return 'has-text-link'
            } else {
                return `has-text-${COLORS[themeIdx]}`
            }
        },
        hasBackgroundThemeClass(state)
        {
            const themeIdx = state.theme_color;

            if (themeIdx > COLORS.length - 1)
            {
                return 'has-background-link'
            } else {
                return `has-background-${COLORS[themeIdx]}`
            }
        }
    },
    mutations: {
        setLoading(state, is_loading: boolean)
        {
            state.loading = is_loading;
        },
        setUser(state, user?: CurrentUserInfo)
        {
            state.current_user = user;
        },
        setThemeColor(state, color: number)
        {
            localStorage.setItem('gflbans_color', color.toString());
            state.theme_color = color;
        },
        setServers(state, servers: IServer[])
        {
            state.servers = servers;
        },
        setNavLoader(state, loader_contents: ILoaderInfo)
        {
            state.small_loading = loader_contents;
        }
    }
});

function useStore() {
    return _useStore(key);
}

export { State, key, store, useStore };