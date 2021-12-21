import { InjectionKey } from 'vue';
import { createStore, Store, useStore as _useStore } from 'vuex';
import { CurrentUserInfo } from './gflbans/login';
import { adminPermissions } from '@/globals';

// Changes to this need to be applied to vuex.d.ts
interface State {
    csrf_token?: string;
    current_user?: CurrentUserInfo;
}

const key: InjectionKey<Store<State>> = Symbol();
const store = createStore<State>({
    state: {},
    getters: {
        isAdmin(state)
        {
            if (state.current_user)
            {
                return (state.current_user.permissions & adminPermissions) !== 0;
            } else {
                return false;
            }
        }
    }
});

function useStore() {
    return _useStore(key);
}

export { State, key, store, useStore };