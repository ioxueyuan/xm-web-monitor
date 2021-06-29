// qms
import {reportSpeed} from "../src/speed";

export interface QmsInterface {
    dataType: string
    data: any
    rate?: number
    bt?: string
    platform?: 'm'|'pc'
    time?: number
    source?: string
}

export interface QmsReportInterface {
    bt: string
    dt: string
    d: string
    pf: 'm'|'pc'
    r: number
    ct: number
    s: string
    appkey: string
}

export interface SetMonitorOptionInterface {
    bt: string // bt
    appkey: string // key
    open?: boolean // 是否监听
    [propName: string]: any; // 任何data数据
}

interface ObjectInterface {
    [propName: string]: any;
}

// api
export interface ReportApiInterface {
    url: string // 接口地址
    type: 1|2|3; // 1: 请求成功；3: 逻辑失败；2：非逻辑失败
    code: number // code码
    msg: string // 错误消息
    delay?: number // 接口响应时间
    param: ObjectInterface // 请求参数
}

// error
export interface ReportErrorInterface {
    msg: string // 错误消息
    file: string // 错误文件
    line: number // 错误行
    column: number // 错误列
    stack?: undefined|string // 错误堆栈
}

// spped
interface ObserveCallbackInterface {
    name: string,
    startTime: number
    duration: number
}

export type ObserveCallbackType = Array<ObserveCallbackInterface>

export interface EntryItemInterface {
    initiatorType: 'script' | 'link' | 'css' | 'img',
    name: string
    transferSize: number
    duration: number
}

interface ResourceInfoInterface {
    name: string
    size: number,
    time: number
}

export interface ResourceTypeInterface {
    js: Array<ResourceInfoInterface>
    css: Array<ResourceInfoInterface>
    cssInline: Array<ResourceInfoInterface>
    img: Array<ResourceInfoInterface>
}

export interface ReportSpeedInterface {
    type?: 1|2 // 1为以前老的测速方案。2为监控集成sdk测速方案
    d1: number|undefined // TTFB时间
    d2: number|undefined // FCP
    d3: number|undefined // LCP
    d4: number|undefined // FID
    d5: number|undefined // Ready
    d6: number|undefined // Load
    detail: string // duration超过500ms文件，字符串数组
}

// url异常
export interface ReportUrlErrorInterface {
    code: string // 错误码5xx, 4xx
    source?: string // 源链接，默认document.referrer
}

// 白屏上报
export interface ReportWhiteScreenInterface {
    detail?: string, // 关键节点内容
}

// 资源加载失败上报
export interface ReportResourceFailInterface {
    detail: string, // 资源失败的地址
}
