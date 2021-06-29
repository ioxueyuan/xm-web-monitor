import qms from './qms';
import { loadInterceptor, speedDelay } from './utils';
import catchMonitor from './catch_monitor';
import {ObserveCallbackType, EntryItemInterface, ResourceTypeInterface, ReportSpeedInterface} from '../types';

declare const window: any;

let navigationEntry: any;
/**
 * 导航开始到各个指标点时间的间隔
 * @returns {{entryType: string, startTime: number}}
 */
export const getNavigationEntryFromPerformanceTiming = () => {
    try {
        if (navigationEntry) {
            return navigationEntry;
        }

        if (window && window.performance) {
            if (
                window.performance.getEntriesByType
                && window.performance.getEntriesByType('navigation')
                && window.performance.getEntriesByType('navigation')[0]
            ) {
                // performance.getEntriesByType兼容性：IE10及以上，safari 11及以上，安卓 5及以上。
                navigationEntry = window.performance.getEntriesByType('navigation')[0];
            } else {
                const timing: any = window.performance.timing; // performance.timing兼容性：IE9及以上，safari 9及以上，安卓 4及以上。
                const obj: any = {
                    entryType: 'navigation',
                    startTime: 0,
                };
                for (const key in timing) {
                    if (key !== 'navigationStart' && key !== 'toJSON') {
                        obj[key] = Math.max(timing[key] - timing.navigationStart, 0);
                    }
                }
                navigationEntry = obj;
            }
        } else {
            navigationEntry = {};
        }
        return navigationEntry;
    } catch (err) {
        catchMonitor(err.message, 3.1);
    }
};

/**
 * PerformanceObserver 监听性能类型。兼容性：IE不支持，safari 12.1及以上，安卓 5及以上
 * @param type
 * @param callback
 */
export const observe = (
    type: string,
    callback: (list: ObserveCallbackType) => void,
) => {
    try {
        const PerformanceObserver = window.PerformanceObserver;
        if (
            PerformanceObserver &&
            PerformanceObserver.supportedEntryTypes &&
            PerformanceObserver.supportedEntryTypes.indexOf(type) !== -1
        ) {
            const po = new PerformanceObserver((l: PerformanceObserverEntryList) => callback(l.getEntries()));
            po.observe({type, buffered: true}); // type：观察的类型；buffered: 是否应将缓冲的条目排队到观察者的缓冲区中。
            return po;
        }
    } catch {
        // 根据w3c结论，observe的参数entryTypes和type不可同时出现，但部分浏览器无entryTypes参数会报错。所以忽略这里报错
        // https://github.com/w3c/performance-timeline/pull/112
        // catchMonitor(err.message, 3.2);
    }
    return false;
};

/**
 * FCP时间
 * @returns {Promise<number>}
 */
const getFCP = () => {
    return new Promise((resolve) => {
        try {
            const entryHandler = (entryList: ObserveCallbackType) => {
                const timeList: number[] = [];
                entryList.forEach(({name, startTime}) => {
                    if (name === 'first-contentful-paint') {
                        timeList.push(Math.floor(startTime));
                    }
                });
                resolve(timeList.pop() || 0);
            };
            const po = observe('paint', entryHandler);
            if (!po) {
                resolve(0);
            }
        } catch (err) {
            catchMonitor(err.message, 3.3);
        }
    });
};

/**
 * LCP时间
 * @returns {Promise<number>}
 */
const getLCP = () => {
    return new Promise((resolve) => {
        try {
            const entryHandler = (entryList: ObserveCallbackType) => {
                const timeList: number[] = [];
                entryList.forEach(({ startTime }) => {
                    timeList.push(Math.floor(startTime));
                });
                resolve(timeList.pop() || 0);
            };
            const po = observe('largest-contentful-paint', entryHandler);
            if (!po) {
                resolve(0);
            }
        } catch (err) {
            catchMonitor(err.message, 3.4);
        }
    });
};

/**
 * FID时间
 * @returns {Promise<number>}
 */
const getFID = () => {
    return new Promise((resolve) => {
        try {
            const entryHandler = (entryList: ObserveCallbackType) => {
                const timeList: number[] = [];
                entryList.forEach(({ duration }) => {
                    timeList.push(Math.floor(duration));
                });
                resolve(timeList.pop() || 0);
            };
            const po = observe('first-input', entryHandler);
            if (!po) {
                resolve(0);
            }
        } catch (err) {
            catchMonitor(err.message, 3.5);
        }
    });
};

// 对数值向下取整
const modifyFloor = (num = 0) => Math.floor(num);
/**
 * TTFB时间
 * @returns {number}
 */
const getTTFB = () => {
    try {
        return modifyFloor(getNavigationEntryFromPerformanceTiming().responseStart);
    } catch (err) {
        catchMonitor(err.message, 3.6);
    }
};

/**
 * DOM结构结束解析,开始加载内嵌资源
 * @returns {number}
 */
const getReady = () => {
    try {
        return modifyFloor(getNavigationEntryFromPerformanceTiming().domInteractive);
    } catch (err) {
        catchMonitor(err.message, 3.7);
    }
};

/**
 * 文档解析完成
 * @returns {number}
 */
const getLoaded = () => {
    try {
        return modifyFloor(getNavigationEntryFromPerformanceTiming().domComplete);
    } catch (err) {
        catchMonitor(err.message, 3.8);
    }
};

/**
 * 页面资源列表
 */
const getPerformanceEntryList = () => {
    try {
        if (window.performance && window.performance.getEntries) {
            const EntryList: Array<EntryItemInterface> = window.performance.getEntries();
            const resourceInfo: ResourceTypeInterface = {
                js: [],
                css: [],
                cssInline: [],
                img: []
            };
            const alias = {
                script: 'js',
                link: 'css',
                css: 'cssInline',
                img: 'img',
            };
            EntryList.forEach(({initiatorType, name, transferSize, duration}) => {
                const type = alias[initiatorType];
                if (
                    type &&
                    duration > 1000
                ) {
                    const infoType = type as keyof ResourceTypeInterface;
                    resourceInfo[infoType].push({
                        name,
                        size: transferSize,
                        time: duration
                    });
                }
            });
            return resourceInfo;
        }
    } catch (err) {
        catchMonitor(err.message, 3.9);
    }
};


export const reportSpeed = ({
    type= 2,
    d1,
    d2,
    d3,
    d4,
    d5,
    d6,
    detail
}: ReportSpeedInterface) => {
    const { origin, pathname } = window.location;
    qms({
        dataType: 'speed',
        data: {
            type,
            d1,
            d2,
            d3,
            d4,
            d5,
            d6,
            path: `${origin}${pathname}`,
            detail
        },
    });
};

/**
 * 性能打点
 */
export const initSpeed = () => {
    try {
        let fid = 0;
        let fcp = 0;
        let lcp = 0;
        getFID().then((time: number) => {
            fid = time;
        });
        getFCP().then((time: number) => {
            fcp = time;
        });
        getLCP().then((time: number) => {
            lcp = time;
        });
        loadInterceptor(() => {
            setTimeout(async () => {
                try {
                    const ttfb = getTTFB();
                    const ready = getReady();
                    const loaded = getLoaded();
                    const entryMap = getPerformanceEntryList();
                    const data: ReportSpeedInterface = {
                        type: 2,
                        d1: ttfb || undefined,
                        d2: fcp || undefined,
                        d3: lcp || undefined,
                        d4: fid || undefined,
                        d5: ready || undefined,
                        d6: loaded || undefined,
                        detail: JSON.stringify(entryMap)
                    };
                    reportSpeed(data);
                } catch (e) {
                    qms({
                        dataType: 'error',
                        data: {
                            msg: e.message,
                        },
                    });
                }
            }, speedDelay);
        });
    } catch (err) {
        catchMonitor(err.message, 3.11);
    }
};
