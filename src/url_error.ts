import qms from './qms';
import catchMonitor from './catch_monitor';
import { ReportUrlErrorInterface } from '../types';

export function reportUrlError({
    code = '5xx',
    source = document.referrer
}: ReportUrlErrorInterface) {
    try {
        qms({
            dataType: 'urlError',
            data: {
                code,
                source: encodeURIComponent(source)
            }
        });
    } catch (err) {
        catchMonitor(err.message, 8.1);
    }
}

