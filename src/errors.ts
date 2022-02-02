/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

import router from "./routes";

class GFLBansError
{
    code: string;
    detail: any;
    formatted: string;

    constructor(_detail: any)
    {
        this.code = 'UNSPECIFIED_ERROR';
        this.detail = _detail;
        this.formatted = `${this.code} :: ${this.detail}`;
    }
}

class NetworkError extends GFLBansError
{
    constructor(_detail: any)
    {   
        super(_detail);
        this.code = 'NETWORK_ERROR';
        this.formatted = `${this.code} :: ${this.detail}`;
    }
}

class HTTPError extends NetworkError
{
    http_code: number;

    constructor(_http_code: number, _detail: any) {
        super(_detail);
        this.http_code = _http_code;
        this.code = 'HTTP_ERROR';
        this.formatted = `${this.code} :: HTTP ${this.http_code} ${this.detail}`;
    }
}

class EncodingError extends GFLBansError
{
    payload: string;

    constructor(_detail: any, _payload: string)
    {
        super(_detail);
        this.code = 'ENCODING_ERROR';
        this.payload = _payload;
        this.formatted = `${this.code} :: ${this.detail}\nPayload ${this.payload}`;
    }
}

class StateError extends GFLBansError
{
    constructor(_detail: any)
    {
        super(_detail);
        this.code = 'APPLICATION_STATE_ERROR';
        this.formatted = `${this.code} :: ${this.detail}`;
    }
}

class ArgumentError extends GFLBansError
{
    constructor(_detail: any)
    {
        super(_detail);
        this.code = 'ARGUMENT_ERROR';
        this.formatted = `${this.code} :: ${this.detail}`;
    }
}

class SecurityError extends GFLBansError
{
    constructor(_detail: any)
    {
        super(_detail);
        this.code = 'SECURITY_ERROR';
        this.formatted = `${this.code} :: ${this.detail}`;
    }
}

class ConfigError extends GFLBansError
{
    constructor(_detail: any)
    {
        super(_detail);
        this.code = 'CONFIG_ERROR';
        this.formatted = `${this.code} :: ${this.detail}`;
    }
}

function setError(err: GFLBansError)
{
    console.log('GFLBans Error', err);
    console.trace();

    router.replace({
        path: '/error',
        query: {
            'error_detail': err.formatted
        }
    }).catch(function (e) {
        console.log(e)
    })
}

export { HTTPError, NetworkError, GFLBansError, EncodingError, StateError, ArgumentError, SecurityError, ConfigError, setError };
