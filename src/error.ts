import qms from './qms';
import catchMonitor from './catch_monitor';
import { ReportErrorInterface } from '../types';

declare const window: any;

/**
 * 获取前3个错误堆栈
 * @param err
 */
const getStackMsg = (err?: Error) => {
    try {
        let stack = undefined;
        if (err && err.stack) {
            const stackArr = err.stack.split('\n');
            const stackSlice = stackArr.slice(0, 4).map(item => item.trim());
            stack = stackSlice.join('\n');

            if (stack.length > 500) {
                stack = stack.slice(0, 500);
            }
        }
        return stack;
    } catch (e) {
        catchMonitor(e.message, 7.2);
    }
};

export const reportError = ({
    msg,
    file,
    line,
    column,
    stack
}: ReportErrorInterface) => {
    const { origin, pathname } = window.location;
    qms({
        dataType: 'error',
        data: {
            path: `${origin}${pathname}`,
            msg: msg,
            file: file,
            line: line,
            column: column,
            stack
        },
    });
};

export const initError = () => {
    try {
        window.onerror = function (msg: string, file: string, line: number, column: number, err: Error) {
            const stack = getStackMsg(err);
            reportError({msg, file, line, column, stack});
            return false;
        };

        /**
         * 捕获没有catch promise报错。没有catch分两种情况：
         * 1、reject错误，这时event.reason为reject的第一个参数
         * 2、promise内部报错，没有catch，这时event.reason为错误对象，抛出可被window.onerror捕获
         * @param event
         */
        window.onunhandledrejection = function(event: PromiseRejectionEvent) {
            if (event.reason instanceof Error) {
                throw event.reason;
            }
        };

        // 监听Vue报错
        if (window.Vue && window.Vue.config) {
            window.Vue.config.errorHandler = function (err: ErrorEvent) {
                setTimeout(() => {
                    throw err;
                });
            }
        }
    } catch (err) {
        catchMonitor(err.message, 7.1);
    }
};
