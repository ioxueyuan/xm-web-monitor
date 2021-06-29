import qms from './qms';
import { whiteScreenDelay, loadInterceptor } from './utils';
import catchMonitor from './catch_monitor';
import { ReportWhiteScreenInterface } from '../types';

// 要最先加载，否则会监听不到script下载失败
export function reportWhiteScreen({
    detail = '',
}: ReportWhiteScreenInterface) {
    try {
        const { origin, pathname } = window.location;
        qms({
            dataType: 'whiteScreen',
            data: {
                path: `${origin}${pathname}`,
                detail,
            },
        });
    } catch (err) {
        catchMonitor(err.message, 4.3);
    }

}

export const initWhiteScreen = () => {
    loadInterceptor(() => {
        try {
            let monitorWhiteScreenNode = document.querySelector('#app');
            if (!monitorWhiteScreenNode) {
                monitorWhiteScreenNode = document.querySelector('#whiteScreen');
            }
            if (monitorWhiteScreenNode) {
                setTimeout(() => {
                    try {
                        if (!(/\w/.test(monitorWhiteScreenNode!.innerHTML))) {
                            // 重要节点没有内容
                            reportWhiteScreen({
                                detail: monitorWhiteScreenNode!.outerHTML
                            });
                        }
                    } catch (err) {
                        catchMonitor(err.message, 4.1);
                    }
                }, whiteScreenDelay);
            }
        } catch (err) {
            catchMonitor(err.message, 4.2);
        }

    });
};
