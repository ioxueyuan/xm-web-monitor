import { monitorReport, cacheReport, customOption } from './utils/monitorReport';
import catchMonitor from './catch_monitor';

import { QmsInterface, QmsReportInterface } from '../types';

const pf = ('ontouchstart' in window ? 'm' : 'pc');

export default function qms({
    dataType,
    data = {},
    rate = 1,
    bt,
    platform = pf,
    time = (new Date()).valueOf(),
    source = window.location.href
}: QmsInterface) {
    try {
        if(!dataType) { return console.warn('dataType比传'); }

        const {
            open: customOpen,
            bt: customBT,
            appkey,
            data: customData
        } = customOption;

        if (Math.random() < (1 / rate)) {
            // 采样上报
            const jsonData = JSON.stringify({
                ...customData,
                ...data
            });
            const reqData: QmsReportInterface = {
                // 业务类型
                bt: bt || customBT,
                // 数据类型
                dt: dataType,
                // 具体数据
                d: jsonData,
                // 平台
                pf: platform,
                // 采样率
                r: rate,
                // 当前时间
                ct: time,
                // 来源
                s: source, //信息来源（每条记录自带），如：页面referer、客户端界面路径、服务端文件路径等
                appkey,
            };

            if (customOpen === -1) {
                cacheReport.set(reqData);
            } else {
                monitorReport(reqData);
            }
        }
    } catch (err) {
        catchMonitor(err.message, 2.1);
    }
}
