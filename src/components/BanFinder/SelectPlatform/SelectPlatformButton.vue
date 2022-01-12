<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
    <p>UwU</p>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PLATFORMS } from '@/data';
import { ConfigError, setError } from '@/errors';

@Options({
    props: {
        platform: String
    }
})
export default class SelectPlatformButton extends Vue {
    platform!: string;

    getPlatform(name: string): any
    {
        if (!(name in PLATFORMS))
        {
            const c = new ConfigError(`Platform ${name} specified in config is not supported.`);
            setError(c);
            throw c;
        }

        return PLATFORMS[name];
    }
    
    get platformIcon()
    {

    }

    get platformName()
    {

    }

    get platformText()
    {

    }

    get platformPrimaryColor()
    {

    }

    get platformSecondaryColor()
    {

    }
}
</script>