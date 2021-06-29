import qms from './qms';
import catchMonitor from './catch_monitor';
import { ReportResourceFailInterface } from '../types';

export function reportResourceFail({
  detail,
}: ReportResourceFailInterface) {
    try {
        const { origin, pathname } = window.location;
        qms({
            dataType: 'resourceFail',
            data: {
                path: `${origin}${pathname}`,
                detail,
            },
        });
    } catch (err) {
        catchMonitor(err.message, 5.3);
    }
}

export const initResourceFail = () => {
    try {
        window.addEventListener('error', function (event) {
            try {
                const target = event.target || event.srcElement;
                if (
                    target instanceof HTMLElement &&
                    ['LINK', 'SCRIPT', 'IMG'].indexOf(target.nodeName) !== -1
                ) {
                    // 下载资源失败
                    // @ts-ignore
                    const src = target.src || target.href;
                    if (window.location.href.indexOf(src) !== 0) {
                        reportResourceFail({
                            detail: src
                        });
                    }
                }
            } catch (err) {
                catchMonitor(err.message, 5.1);
            }
        }, true);
    } catch (err) {
        catchMonitor(err.message, 5.2);
    }
};
