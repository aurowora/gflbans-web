import { Store } from 'vuex'
import { CurrentUserInfo } from '@/gflbans/login';
import { IServer } from '@/gflbans/servers';
import { ILoaderInfo } from './loading';

declare module '@vue/runtime-core' {
  // Changes to this need to be applied to state.ts
  interface State {
    csrf_token?: string;
    current_user?: CurrentUserInfo;
    current_error?: GFLBansError;
    loading: boolean;
    theme_color: number;
    servers?: IServer[];
    small_loading: ILoaderInfo;
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}