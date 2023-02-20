/// <reference types="jquery" />
/// <reference types="jqueryui" />
declare module "LinqToJs" {
    global {
        interface Array<T> {
            asQueryable(): Queryable<T>;
            remove(item: T): void;
        }
        interface IEnumerable<T> extends Array<T> {
        }
        interface IList<T> extends Array<T> {
        }
        interface List<T> extends Array<T> {
        }
        interface Dictionary<T1, T2> extends Object {
        }
    }
    export class Queryable<T> {
        private array?;
        constructor(array?: Array<any>);
        private equals;
        add: (item: T) => void;
        remove: (item: T) => void;
        push: (item: T) => void;
        toArray: () => Array<T>;
        get length(): number;
        get count(): number;
        distinct: (compareFunction?: (obj1: T, obj2: T) => boolean) => Queryable<T>;
        where: (whereClause: (obj: T) => boolean) => Queryable<T>;
        any: (whereClause?: (obj: T) => boolean) => boolean;
        forEach: (func: (obj: T) => any) => boolean;
        sum: (func?: (obj: T) => number) => number;
        max: (func?: (obj: T) => number) => number;
        min: (func?: (obj: T) => number) => number;
        select: <T2>(selectItem: (obj: T) => T2) => Queryable<T2>;
        orderBy: (orderBy: (obj: T) => any, isDescending?: boolean) => Queryable<T>;
        orderByFunction: (orderBy?: (obj1: T, obj2: T) => number, isDescending?: boolean) => Queryable<T>;
        reverse: () => Queryable<T>;
        skip: (count: number) => Queryable<T>;
        take: (count: number) => Queryable<T>;
        first: () => T;
        last: () => T;
        findItem: (selectItem: (obj: T) => boolean) => T;
        find: (selectItem: (obj: T) => boolean) => T;
        contains: (item: T, compareFunction?: (obj1: T, obj2: T) => boolean) => boolean;
        union: (arr: Array<T> | Queryable<T>) => Queryable<T>;
        intersect: (arr: Array<T> | Queryable<T>, compareFunction?: (obj1: T, obj2: T) => boolean) => Queryable<T>;
        difference: (arr: Array<T> | Queryable<T>, compareFunction?: (obj1: T, obj2: T) => boolean) => Queryable<T>;
        copy: () => Queryable<T>;
        asQueryable: () => Queryable<T>;
    }
}
declare module "Lock" {
    export function WhenTrueAsync(func: () => boolean, maxLockTime?: number): Promise<void>;
    export class MutexLock {
        private maxLockTime?;
        private locked;
        private lastCalled;
        constructor(maxLockTime?: number);
        get isLocked(): boolean;
        WhenTrueAsync(func: () => boolean): Promise<void>;
        WaitTillUnlocked(): Promise<void>;
        LockAreaAsync(func: () => Promise<void>): Promise<void>;
        BeginLock(): Promise<void>;
        EndLock(): Promise<void>;
    }
}
declare module "Tasks" {
    export interface IException {
        message: string;
    }
    export class Task<TT> {
        private func;
        promise: Promise<TT>;
        private resolveFunc;
        constructor(func: (cback?: (val?: TT) => void) => void);
        then: (onFulfilled: (value?: TT) => TT | PromiseLike<TT>) => Promise<TT>;
        start: () => void;
    }
    export interface IDebouncedTask<TT> extends Task<TT> {
        trigger: () => void;
        call: () => void;
    }
    export class RecurringTask {
        private callback;
        private timeout;
        private maxLockTime;
        private _isRunning;
        private refreshLock;
        private timedCall;
        constructor(callback: () => Promise<void>, timeout: number, maxLockTime?: number);
        get isRunning(): boolean;
        setTimeOut: (time: number) => void;
        start: () => void;
        stop: () => void;
    }
    export function runAfterWait(waitTimeMilliSeconds: number): IDebouncedTask<void>;
    export function debounced(): IDebouncedTask<void>;
    export function delay(msec: number): Promise<void>;
    export function whenReady(): Promise<void>;
    export function whenTrue(trueFunc: () => boolean, maxLockTime?: number): Promise<void>;
    export function WhenAll<tRet>(list: Array<Promise<tRet>>, progressCB?: ((numFinished: number, total: number) => void)): Promise<Array<tRet>>;
}
declare module "EventHandler" {
    export class EventHandler<T> {
        private onTrigger;
        constructor();
        trigger(data?: T): void;
        triggerAsync(data?: T): Promise<void>;
        addListener(callback: (data?: T) => void): void;
        addAsyncListener(callback: (data?: T) => Promise<void>): void;
        onTriggeredAsync(): Promise<T>;
        onOccur(): Promise<T>;
    }
    export class DebouncedEventHandler<T> extends EventHandler<T> {
        private resetTimeMilliSeconds;
        private lastTime;
        constructor(resetTimeMilliSeconds?: number);
        triggerAsync(data?: T): Promise<void>;
        trigger(data?: T): void;
    }
    export class AfterStableEventHandler<T> extends EventHandler<T> {
        private waitTimeMilliSeconds;
        constructor(waitTimeMilliSeconds?: number);
        private timer;
        private lastData;
        throttle(): void;
        triggerAsync(data?: T): Promise<void>;
        trigger(data?: T): void;
    }
    export class OneTimeEventHandler<T> extends EventHandler<T> {
        hasTriggered: boolean;
        private triggerData;
        constructor();
        triggerAsync(data?: T): Promise<void>;
        trigger(data?: T): void;
        addAsyncListener(callback: (data?: T) => Promise<void>): void;
        addListener(callback: (data?: T) => any): void;
    }
}
declare module "Debug" {
    global {
        interface String {
            replaceAll(str1: string, str2: string, ignore?: boolean): string;
        }
    }
    export class Message {
        private _date;
        private _message;
        constructor(_date: Date, _message: string);
        get date(): Date;
        set date(value: Date);
        get message(): string;
        set message(value: string);
    }
    export class Messages {
        private displayLocation;
        private isReady;
        messages: Array<Message>;
        private area;
        constructor(displayLocation: JQuery | string);
        private init;
        private refreshMessages;
        showMessages: () => void;
        addMessage: (msg: string | Message) => void;
    }
    export var messages: Messages;
    export function debugWrite(msg: string): void;
    export function addMessage(when: Date, msg: string): void;
}
declare module "ApiLibrary" {
    export enum callTypes {
        GET = 0,
        PUT = 1,
        POST = 2
    }
    export interface iApiCallError {
        textStatus: string;
        errorThrown: string;
        responseText: string;
        responseObj: any;
    }
    export function addDataToUrl(url: string, name: string, value: string): string;
    export function addFormatToUrl(url: string): string;
    export function addAntiForgeryToken(data: any): any;
    export function apiCall(type: callTypes, url: string, sendData: any, successCallback?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, errorCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any, beforeSend?: (jqXHR: JQueryXHR) => any): void;
    export function getCallAsync<TT>(url: string, seqNum?: number, sendData?: any): Promise<TT>;
    export function putCallAsync<TT>(url: string, seqNum?: number, sendData?: any): Promise<TT>;
    export function postCallAsync<TT>(url: string, seqNum?: number, sendData?: any): Promise<TT>;
    export function getCall(url: string, seqNum?: number, sendData?: any, successCallback?: (data: any, seq?: number) => any, errorCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any): void;
    export function putCall(url: string, seqNum?: number, sendData?: any, successCallback?: (data: any, seq?: number) => any, errorCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any): void;
    export function postCall(url: string, seqNum?: number, sendData?: any, successCallback?: (data: any, seq?: number) => any, errorCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any): void;
}
declare module "DateTime" {
    global {
        interface Date {
            addDays(days: number): Date;
        }
    }
    export class ServerTime {
        timeApiUrl: string;
        serverStartTime: Date;
        startTime: Date;
        serverDateTime: Date;
        offset: number;
        serverTimeLoaded: boolean;
        constructor(timeApiUrl: string);
        init: () => Promise<void>;
        now: () => Date;
        refreshServerTime: () => Promise<void>;
    }
    export var serverTime: ServerTime;
    export function dateFromIso8601(isostr: string): Date;
    export function formatTimeSpan(ts: number): string;
    export function formatDate(dt: Date): string;
    export function formatTime(dt: Date, hideMs?: boolean): string;
    export function getTimeCount(): number;
}
declare module "SiteInfo" {
    export class SiteInfo {
        sitepath: string;
        virtualUrl: string;
        applicationUrl: string;
        isCleanHtml: boolean;
        constructor();
        getParameterByName: (name: string) => string;
    }
    export var siteInfo: SiteInfo;
    export function virtualUrl(): string;
    export function applicationUrl(): string;
    export function isCleanHtml(): boolean;
    export function refreshPage(): void;
    export function getParameterByName(name: string): string;
    export function getVirtualURL(url: string): string;
    export function getFullURL(url: string): string;
    export function redirect(url: string): void;
}
declare module "Dialog" {
    import { ModalOption } from "bootstrap";
    import * as EventHandler from "EventHandler";
    global {
        interface Window {
            closeBasePopupDialog: (data?: any) => void;
            showHtmlInDialog(html: string | JQuery, settings: IDialogSettings, parent?: Window): JQuery;
        }
    }
    export var lastDialogNumber: number;
    export var dialogReturn: any;
    export var dialogCloseEvents: EventHandler.EventHandler<any>;
    export function resetPage(): void;
    export function closeDialog(): void;
    export enum DialogTypeEnum {
        JQueryDialog = 0,
        FancyBox = 1,
        Bootstrap = 2
    }
    export interface IDialogSettings {
        dialogType: DialogTypeEnum;
        width?: number;
        height?: number;
        callOnClose?: string;
        onComplete?: () => void;
    }
    export interface IBootDialogSettings extends IDialogSettings {
        title?: string;
        item?: JQuery;
        settings?: ModalOption;
    }
    export interface IJQuiDialogSettings extends IDialogSettings {
        title?: string;
        item?: JQuery;
        settings?: JQueryUI.DialogOptions;
    }
    export function showBlockUI(msg?: string): void;
    export function hideBlockUI(): void;
    export function getBootstrapDialogSettings(settings?: ModalOption, callOnClose?: string, onComplete?: () => void): IBootDialogSettings;
    export function getJqueryUiDialogSettings(width?: number, height?: number, title?: string, settings?: JQueryUI.DialogOptions, callOnClose?: string, onComplete?: () => void): IJQuiDialogSettings;
    export function getDefaultDialogSettings(dialogType?: DialogTypeEnum): IDialogSettings;
    export function showHtmlInDialog(html: string | JQuery, options?: IDialogSettings, parent?: Window): JQuery;
    export function showInDialog(url: string, title: string, options?: IDialogSettings): void;
    export function confirmDialog(msg: string, dialogType?: DialogTypeEnum, callback?: (success: boolean) => void): void;
}
declare module "JqueryEx" {
    global {
        interface JQueryStatic {
            disable(state: boolean): any;
            simulate(event?: string, options?: any): void;
            replaceTag(item: JQuery | string, newTagObj: JQuery | string, keepProps: boolean): any;
            replaceTag(newTagObj: JQuery | string, keepProps: boolean): any;
        }
        interface JQuery {
            submitUsingAjax(options?: IAjaxCallOptions): void;
            onSubmitUseAjax(options?: IAjaxCallOptions): void;
            onClickAjaxGet(options?: IAjaxCallOptions): void;
            onClickAjaxPost(options?: IAjaxCallOptions): void;
            onClickPostAsForm(options?: IAjaxCallOptions): void;
            disable(state: boolean): any;
            simulate(event?: string, options?: any): void;
            replaceTag(item: JQuery | string, newTagObj: JQuery | string, keepProps: boolean): any;
            replaceTag(newTagObj: JQuery | string, keepProps: boolean): any;
        }
    }
    export interface IAjaxCallOptions {
        beforeCall: (item: JQuery, form: JQuery) => boolean;
        afterResponse?: (item: JQuery, data: any) => any;
    }
    export function createAjaxOptions(beforeCall: (item: JQuery, form: JQuery) => boolean, afterResponse?: (form: JQuery, data: any) => any): IAjaxCallOptions;
}
declare module "UCIT_Libs" {
    export * as LinqToJs from "LinqToJs";
    export * as Locking from "Lock";
    export * as Tasks from "Tasks";
    export * as EventHandler from "EventHandler";
    export * as Dialog from "Dialog";
    export * as DateTime from "DateTime";
    export * as Debug from "Debug";
    export * as ApiLibrary from "ApiLibrary";
    export * as JqueryEx from "JqueryEx";
    export * as SiteInfo from "SiteInfo";
}
