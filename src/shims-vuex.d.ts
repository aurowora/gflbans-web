/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import { Store } from 'vuex'
import { CurrentUserInfo } from '@/gflbans/login';
import { IServer } from '@/gflbans/servers';
import { ILoaderInfo } from './loading';

declare module '@vue/runtime-core' {
  // Changes to this need to be applied to state.ts
  interface State {
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