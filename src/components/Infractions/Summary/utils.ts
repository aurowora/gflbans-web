import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import router from '@/routes';

dayjs.extend(localizedFormat);
dayjs.extend(duration)
dayjs.extend(relativeTime);

function formatDate(time: number): string {
    return dayjs.unix(time).format('lll');
}

function formatDur(duration: number, caps = false): string {
    let s = dayjs.duration(duration, "seconds").humanize();

    if (caps) {
        s = s.charAt(0).toUpperCase() + s.substring(1)
    }

    console.log('Duration', duration, 'Out', s)

    return s
}

function setInfractionUrl(id: string | null) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let newPath = id ? `/infractions/${id}` : '/infractions';
    
    let pn = 0;

    for (const key in params) {
        if (pn === 0) {
            newPath += '?'
        } else if (pn > 0) {
            newPath += '&'
        }

        newPath += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        pn++;
    }

    console.log('new url: ', newPath);

    window.history.replaceState(history.state, '', newPath);
    //router.push(newPath);
}

export {formatDate, formatDur, setInfractionUrl};