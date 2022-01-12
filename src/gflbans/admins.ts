import { INSTANCE, PRODUCTION } from "@/config";
import { EncodingError, HTTPError, NetworkError } from "@/errors";
import { strictParseInt } from "./utils";

interface IAdminInfo
{
    admin_name?: string;
    admin_id?: string | number; // it's a number now, but will eventually be turned into a string
    avatar_id?: string;
    permissions: number;
}

const AdminCache = new Map<string, IAdminInfo>();

async function get_admin_info(admin_id: string): Promise<NetworkError | HTTPError | EncodingError | IAdminInfo>
{
    const cached_val = AdminCache.get(admin_id)

    if (cached_val) { return cached_val }

    // TODO: GFLBANS 0.3 AND 0.4 COMPAT CODE, REMOVE WHEN GFLBANS 0.4 IS READY
    const params = !isNaN(strictParseInt(admin_id)) ? `ips_id=${admin_id}` : `mongo_id=${admin_id}`;

    console.log('gb0.4-compat: parsed', params);

    try {
        const response = await fetch(`${INSTANCE}api/v1/gs/admininfo?${params}`, {
            mode: PRODUCTION ? 'same-origin' : 'cors',
            credentials: 'omit'
        });

        const text = await response.text();

        if (!response.ok)
        {
            return new HTTPError(response.status, text);
        }

        try {
            const result = (JSON.parse(text) as IAdminInfo);
            AdminCache.set(admin_id, result);
            return result;
        } catch (e) {
            return new EncodingError(e, text);
        }

    }
    catch (e)
    {
        return new NetworkError(e);
    }
}

export { get_admin_info };