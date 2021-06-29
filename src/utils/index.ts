export const paramStr = (obj: any) => {
    const list = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            list.push(`${encodeURIComponent(key)}=${encodeURIComponent(value === null ? '' : value)}`);
        }
    }
    return list.join('&').replace(/%20/g, `+`);
};

export const listening = (callback: () => void) => {
    if (location.search.indexOf('debug') === -1) {
        callback();
    }
};

// load最大等待10秒
const maxLoadDelay = 10000;
const maxLoad = () => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, maxLoadDelay);
    });
};

export const domLoad = () => {
    return new Promise<void>((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', function() {
                resolve();
            });
        }
    });
};
// 页面load或最大等待时间10秒，触发回调
export const loadInterceptor = (callback: () => void): void => {
    Promise.race([maxLoad(), domLoad()]).then(() => {
        callback();
    });
};

export const speedDelay = 1000; // load之后1s延迟
export const whiteScreenDelay = 2000; // load之后2s延迟

export const getType = (arg: any) => {
    return Object.prototype.toString.call(arg).slice(8, -1);
};

export const objectToUrlParams = (obj: any) => {
    let result = '';
    if (getType(obj) === 'Object') {
        let paramsArr = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                paramsArr.push(`${key}=${obj[key]}`)
            }
        }
        result = paramsArr.join('&');
    } else if (getType(obj) === 'String') {
        result = obj;
    }
    return result;
};
