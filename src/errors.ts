/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

interface IGFLBansError
{
    code: string;

    format(): string;
}

class GFLBansError implements IGFLBansError
{
    code: string = 'UNSPECIFIED_ERROR';
    detail: any;

    constructor(_detail: any)
    {
        this.detail = _detail;
    }

    format(): string
    {
        return `${this.code} :: ${this.detail}`;
    }
}

class NetworkError extends GFLBansError
{
    code: string = 'NETWORK_ERROR';

    constructor(_detail: any)
    {
        super(_detail);
    }
}

class HTTPError extends NetworkError
{
    code: string = 'HTTP_ERROR';
    http_code: number;

    constructor(_http_code: number, _detail: any) {
        super(_detail);
        this.http_code = _http_code;
    }

    format(): string {
        return `${this.code} :: HTTP ${this.http_code} ${this.detail}`
    }
}

class EncodingError extends GFLBansError
{
    code: string = 'ENCODING_ERROR'
    payload: string;

    constructor(_detail: any, _payload: string)
    {
        super(_detail);
        this.payload = _payload;
    }
}

class StateError extends GFLBansError
{
    code: string = 'APPLICATION_STATE_ERROR';

    constructor(_detail: any)
    {
        super(_detail);
    }
}

export { HTTPError, NetworkError, GFLBansError, EncodingError, StateError };
export type { IGFLBansError };