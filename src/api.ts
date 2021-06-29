import qms from './qms';
import {objectToUrlParams} from './utils';
import catchMonitor from './catch_monitor';
import {ReportApiInterface} from '../types';


export const reportApi = ({
    url,
    type,
    code,
    msg,
    delay,
    param
}: ReportApiInterface) => {
    try {
        const rate = type === 1 ? 10 : 1;
        qms({
            dataType: 'api',
            rate,
            data: {
                url,
                type,
                code,
                msg,
                delay,
                param: objectToUrlParams(param)
            },
        });
    } catch (err) {
        catchMonitor(err.message, 6.1);
    }
};

/**
 * 只限axios 错误对象
 * @param err axios错误对象
 */
export const reportApiError = (err: Error|any) => {
    try {
        const type = 2;
        let code = 600;
        const { message, response, config } = err;

        if (response && response.status !== undefined) {
            code = response.status;
        } else if (/Network Error/i.test(message)) {
            code = 601;
        } else if (/timeout/i.test(message)) {
            code = 602;
        } else if (message !== undefined) {
            code = 603;
        }

        reportApi({
            url: config.url,
            type,
            code,
            msg: message,
            param: config.data
        })
    } catch (err) {
        catchMonitor(err.message, 6.2);
    }
};
