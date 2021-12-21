import { Store } from 'vuex'
import { CurrentUserInfo } from '@/gflbans/login';

declare module '@vue/runtime-core' {
  // Changes to this need to be applied to state.ts
  interface State {
    csrf_token?: string;
    current_user?: CurrentUserInfo;
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}