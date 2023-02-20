var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("LinqToJs", [], function (exports_1, context_1) {
    "use strict";
    var Queryable;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            //module Linq {
            Queryable = class Queryable {
                constructor(array) {
                    this.array = array;
                    this.add = (item) => {
                        this.array.push(item);
                    };
                    this.remove = (item) => {
                        this.array.remove(item);
                    };
                    this.push = (item) => {
                        this.array.push(item);
                    };
                    this.toArray = () => {
                        return this.array.slice(0);
                    };
                    this.distinct = (compareFunction) => {
                        var lst = new Queryable();
                        this.forEach((t) => {
                            if (!lst.contains(t, compareFunction)) {
                                lst.add(t);
                            }
                        });
                        return lst;
                    };
                    this.where = (whereClause) => {
                        if (!whereClause) {
                            return new Queryable(this.array.slice(0));
                        }
                        var lst2 = [];
                        this.array.forEach(item => {
                            if (whereClause(item)) {
                                lst2.push(item);
                            }
                        });
                        return new Queryable(lst2);
                    };
                    this.any = (whereClause) => {
                        if (!whereClause) {
                            return this.array.length > 0;
                        }
                        return this.where(whereClause).any();
                    };
                    this.forEach = (func) => {
                        var list = this.array;
                        if (func == null) {
                            return false;
                        }
                        $.each(list, (i, item) => {
                            func(item);
                        });
                        return true;
                    };
                    this.sum = (func) => {
                        if (!func) {
                            func = (obj) => {
                                return obj;
                            };
                        }
                        var cnt = 0;
                        this.forEach(item => { cnt = cnt + func(item); });
                        return cnt;
                    };
                    this.max = (func) => {
                        if (!func) {
                            func = (obj) => {
                                return obj;
                            };
                        }
                        var mx = func(this.first());
                        this.forEach(item => {
                            var v = func(item);
                            if (mx < v) {
                                mx = v;
                            }
                        });
                        return mx;
                    };
                    this.min = (func) => {
                        if (!func) {
                            func = (obj) => {
                                return obj;
                            };
                        }
                        var mx = func(this.first());
                        this.forEach(item => {
                            var v = func(item);
                            if (mx > v) {
                                mx = v;
                            }
                        });
                        return mx;
                    };
                    this.select = (selectItem) => {
                        if (selectItem == null) {
                            return new Queryable(this.array.slice(0));
                        }
                        return new Queryable(this.array.map(selectItem));
                    };
                    this.orderBy = (orderBy, isDescending = false) => {
                        return this.orderByFunction((ob1, ob2) => {
                            var v1 = orderBy(ob1);
                            var v2 = orderBy(ob2);
                            if (v1 > v2) {
                                return 1;
                            }
                            if (v1 < v2) {
                                return -1;
                            }
                            return 0;
                        }, isDescending);
                    };
                    this.orderByFunction = (orderBy, isDescending = false) => {
                        isDescending = !!isDescending;
                        if (orderBy == null) {
                            return new Queryable(this.array.slice(0));
                        }
                        var clone = this.array.slice(0);
                        clone.sort(orderBy);
                        if (isDescending) {
                            clone = clone.reverse();
                        }
                        return (new Queryable(clone));
                    };
                    this.reverse = () => {
                        return new Queryable(this.array.reverse());
                    };
                    this.skip = (count) => {
                        if (this.length < count) {
                            return new Queryable([]);
                        }
                        this.array.splice(0, count);
                        return new Queryable(this.array.slice(0));
                    };
                    this.take = (count) => {
                        if (this.length == 0) {
                            return new Queryable([]);
                        }
                        if (count > this.length) {
                            count = this.length;
                        }
                        this.array.splice(count - 1, this.length - count);
                        return new Queryable(this.array.slice(0));
                    };
                    this.first = () => {
                        if (this.length == 0) {
                            return null;
                        }
                        return this.array[0];
                    };
                    this.last = () => {
                        if (this.length == 0) {
                            return null;
                        }
                        return this.array[this.length - 1];
                    };
                    this.findItem = (selectItem) => {
                        return this.where(selectItem).first();
                    };
                    this.find = (selectItem) => {
                        return this.where(selectItem).first();
                    };
                    this.contains = (item, compareFunction) => {
                        if (!compareFunction) {
                            compareFunction = this.equals;
                        }
                        return this.where((item2) => compareFunction(item, item2)).any();
                    };
                    this.union = (arr) => {
                        if (arr instanceof Queryable) {
                            return new Queryable(this.array.concat(arr.toArray()));
                        }
                        else {
                            return new Queryable(this.array.concat(arr));
                        }
                    };
                    this.intersect = (arr, compareFunction) => {
                        if (!compareFunction) {
                            compareFunction = this.equals;
                        }
                        var q = null;
                        if (arr instanceof Queryable) {
                            q = arr;
                        }
                        else {
                            q = new Queryable(this.array.concat(arr));
                        }
                        var lst2 = [];
                        this.forEach((item) => {
                            if (q.contains(item, compareFunction)) {
                                lst2.push(item);
                            }
                        });
                        return new Queryable(lst2);
                    };
                    this.difference = (arr, compareFunction) => {
                        if (!compareFunction) {
                            compareFunction = this.equals;
                        }
                        var q = null;
                        if (arr instanceof Queryable) {
                            q = arr;
                        }
                        else {
                            q = new Queryable(this.array.concat(arr));
                        }
                        var lst2 = [];
                        this.forEach((item) => {
                            if (!q.contains(item, compareFunction)) {
                                lst2.push(item);
                            }
                        });
                        return new Queryable(lst2);
                    };
                    this.copy = () => {
                        return new Queryable(this.array.slice(0));
                    };
                    this.asQueryable = () => {
                        return new Queryable(this.array.slice(0));
                    };
                    if (this.array == null) {
                        this.array = new Array();
                    }
                }
                equals(x, y) {
                    if (x === y)
                        return true;
                    // if both x and y are null or undefined and exactly the same
                    if (!(x instanceof Object) || !(y instanceof Object))
                        return false;
                    // if they are not strictly equal, they both need to be Objects
                    if (x.constructor !== y.constructor)
                        return false;
                    // they must have the exact same prototype chain, the closest we can do is
                    // test there constructor.
                    for (var p in x) {
                        if (!x.hasOwnProperty(p))
                            continue;
                        // other properties were tested using x.constructor === y.constructor
                        if (!y.hasOwnProperty(p))
                            return false;
                        // allows to compare x[ p ] and y[ p ] when set to undefined
                        if (x[p] === y[p])
                            continue;
                        // if they have the same strict value or identity then they are equal
                        if (typeof (x[p]) !== "object")
                            return false;
                        // Numbers, Strings, Functions, Booleans must be strictly equal
                        if (!this.equals(x[p], y[p]))
                            return false;
                        // Objects and Arrays must be tested recursively
                    }
                    for (p in y) {
                        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
                            return false;
                        // allows x[ p ] to be set to undefined
                    }
                    return true;
                }
                get length() {
                    return this.array.length;
                }
                get count() {
                    return this.array.length;
                }
            };
            exports_1("Queryable", Queryable);
            //}
            Array.prototype.asQueryable = function () {
                return new Queryable(this);
            };
            Array.prototype.remove = function (item) {
                var index = this.indexOf(item);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
        }
    };
});
//module Locking {
System.register("Lock", [], function (exports_2, context_2) {
    "use strict";
    var MutexLock;
    var __moduleName = context_2 && context_2.id;
    function WhenTrueAsync(func, maxLockTime = 60000) {
        return __awaiter(this, void 0, void 0, function* () {
            var p = new Promise((resolve, reject) => {
                var startTime = new Date();
                var check = () => {
                    if (func) {
                        var t = func();
                        if (t) {
                            resolve();
                            return;
                        }
                    }
                    var seconds = ((new Date()).getTime() - startTime.getTime()) / 1000;
                    if (seconds >= maxLockTime) {
                        reject("Max Wait Time for lock hit");
                        return;
                    }
                    setTimeout(check, 100);
                };
                setTimeout(check, 100);
            });
            return p;
        });
    }
    exports_2("WhenTrueAsync", WhenTrueAsync);
    return {
        setters: [],
        execute: function () {
            //module Locking {
            MutexLock = class MutexLock {
                //private refreshLock:Lock.Locker = null;
                constructor(maxLockTime) {
                    this.maxLockTime = maxLockTime;
                    this.locked = false;
                    this.lastCalled = null;
                    //this.refreshLock = new Lock.Locker(maxLockTime);
                }
                get isLocked() {
                    var seconds = 0;
                    if (this.lastCalled) {
                        seconds = ((new Date()).getTime() - this.lastCalled.getTime()) / 1000;
                    }
                    return this.locked && seconds < this.maxLockTime;
                }
                WhenTrueAsync(func) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return WhenTrueAsync(func, this.maxLockTime);
                    });
                }
                WaitTillUnlocked() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.WhenTrueAsync(() => {
                            return !this.isLocked;
                        });
                        return;
                    });
                }
                LockAreaAsync(func) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.BeginLock();
                        yield func();
                        yield this.EndLock();
                    });
                }
                BeginLock() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.WaitTillUnlocked();
                        //await this.WhenTrueAsync(() => {
                        //    return !this.isLocked;
                        //});
                        if (this.isLocked) {
                            this.lastCalled = new Date();
                            return;
                        }
                        this.locked = true;
                        this.lastCalled = new Date();
                    });
                }
                EndLock() {
                    return __awaiter(this, void 0, void 0, function* () {
                        this.locked = false;
                    });
                }
            };
            exports_2("MutexLock", MutexLock);
            //}
        }
    };
});
System.register("Tasks", ["Lock"], function (exports_3, context_3) {
    "use strict";
    var Locking, Task, RecurringTask;
    var __moduleName = context_3 && context_3.id;
    function runAfterWait(waitTimeMilliSeconds) {
        var t = new Task((cback) => {
            cback();
        });
        var timer = null;
        var throttle = () => {
            clearTimeout(timer);
            timer = window.setTimeout(() => {
                t.start();
            }, waitTimeMilliSeconds || 500);
        };
        t.trigger = () => {
            throttle();
        };
        t.call = () => {
            clearTimeout(timer);
            t.start();
        };
        return t;
    }
    exports_3("runAfterWait", runAfterWait);
    function debounced() {
        var t = new Task((cback) => {
            cback();
        });
        t.trigger = () => {
            t.start();
        };
        t.call = () => {
            t.start();
        };
        return t;
    }
    exports_3("debounced", debounced);
    //export function debouncedAtEnd(waitTimeMilliSeconds: number): IDebouncedTask<void> {
    //    var t = new Task<void>((cback) => {
    //        setTimeout(cback, waitTimeMilliSeconds);
    //    }) as IDebouncedTask<void>;
    //    t.trigger = (): void => {
    //        t.start();
    //    }
    //    t.call = (): void => {
    //        t.start();
    //    }
    //    return t;
    //}
    function delay(msec) {
        return new Promise((resolve) => {
            setTimeout(resolve, msec);
        });
    }
    exports_3("delay", delay);
    function whenReady() {
        return new Promise((resolve) => {
            $(() => {
                resolve();
            });
        });
    }
    exports_3("whenReady", whenReady);
    function whenTrue(trueFunc, maxLockTime = 60 * 60 * 1000) {
        return Locking.WhenTrueAsync(trueFunc, maxLockTime);
    }
    exports_3("whenTrue", whenTrue);
    function WhenAll(list, progressCB) {
        return __awaiter(this, void 0, void 0, function* () {
            var tot = list.length;
            var fin = 0;
            list.forEach((p) => {
                p.then(() => {
                    fin++;
                    if (progressCB) {
                        progressCB(fin, tot);
                    }
                });
            });
            return yield Promise.all(list);
        });
    }
    exports_3("WhenAll", WhenAll);
    return {
        setters: [
            function (Locking_1) {
                Locking = Locking_1;
            }
        ],
        execute: function () {
            Task = class Task {
                constructor(func) {
                    //super((resolve, reject) => {
                    //        resolveFunc = resolve;
                    //});
                    this.func = func;
                    this.promise = null;
                    this.then = (onFulfilled) => {
                        return this.promise.then(onFulfilled);
                    };
                    this.start = () => {
                        this.func((val) => {
                            this.resolveFunc(val);
                        });
                    };
                    this.promise = new Promise((resolve) => {
                        this.resolveFunc = resolve;
                    });
                    if (!this.func) {
                        this.func = (rFunc) => {
                            return rFunc();
                        };
                    }
                    else if (func.length === 0) {
                        var bfunc = this.func;
                        this.func = (rFunc) => {
                            bfunc();
                            rFunc();
                        };
                    }
                }
            };
            exports_3("Task", Task);
            RecurringTask = class RecurringTask {
                constructor(callback, timeout, maxLockTime = 30000) {
                    this.callback = callback;
                    this.timeout = timeout;
                    this.maxLockTime = maxLockTime;
                    this._isRunning = false;
                    this.refreshLock = null; // = new Lock.MutexLock(30000);
                    //private set isRunning(value: boolean) {
                    //    this._isRunning = value;
                    //}
                    this.setTimeOut = (time) => {
                        this.timeout = time;
                    };
                    //lock = (): void => {
                    //    this.locker.lock();
                    //}
                    //unLock = (): void => {
                    //    this.locker.unLock();
                    //}
                    //isLocked = (): boolean => {
                    //    return this.locker.isLocked();
                    //}
                    this.start = () => {
                        if (!this.isRunning) {
                            this._isRunning = true;
                            this.timedCall();
                        }
                    };
                    this.stop = () => {
                        this._isRunning = false;
                    };
                    this.refreshLock = new Locking.MutexLock(this.maxLockTime);
                }
                //private locker = new Lock.Locker();
                timedCall() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (this.callback) {
                            if (!this.refreshLock.isLocked) {
                                yield this.refreshLock.LockAreaAsync(() => __awaiter(this, void 0, void 0, function* () {
                                    yield this.callback();
                                }));
                            }
                            //await this.refreshLock.BeginLock();
                            //this.callback();
                            //await this.refreshLock.EndLock();
                        }
                        if (this.isRunning) {
                            setTimeout(() => { this.timedCall(); }, this.timeout);
                        }
                    });
                }
                get isRunning() {
                    return this._isRunning;
                }
            };
            exports_3("RecurringTask", RecurringTask);
            //}
        }
    };
});
System.register("EventHandler", ["Tasks"], function (exports_4, context_4) {
    "use strict";
    var Tasks, EventHandler, DebouncedEventHandler, AfterStableEventHandler, OneTimeEventHandler;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (Tasks_1) {
                Tasks = Tasks_1;
            }
        ],
        execute: function () {
            //module Tasks {
            //export class EventHandler<T> {
            //    private onTrigger: Array<((data?: T) => void)> = [];
            //    constructor() {
            //    }
            //    trigger(data?: T): void {
            //        this.onTrigger.asQueryable().forEach((fn) => {
            //            fn(data);
            //        });
            //    };
            //    addListener(callback: (data?: T) => void): void {
            //        this.onTrigger.push(callback);
            //    }
            //    async onTriggeredAsync(): Promise<T> {
            //        var p = new Promise<T>((resolve, reject) => {
            //            this.addListener((data) => {
            //                resolve(data);
            //            });
            //        });
            //        return p;
            //    }
            //    async onOccur(): Promise<T> {
            //        var p = new Promise<T>((resolve, reject) => {
            //            this.addListener((data) => {
            //                resolve(data);
            //            });
            //        });
            //        return p;
            //    }
            //}
            EventHandler = class EventHandler {
                constructor() {
                    this.onTrigger = [];
                }
                trigger(data) {
                    this.onTrigger.asQueryable().forEach((fn) => {
                        fn(data);
                    });
                }
                ;
                triggerAsync(data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield Tasks.delay(1);
                        for (var a = 0; a < this.onTrigger.length; a++) {
                            var fn = this.onTrigger[a];
                            yield fn(data);
                        }
                        //this.onTrigger.asQueryable().forEach((fn) => {
                        //    fn(data);
                        //});
                    });
                }
                ;
                addListener(callback) {
                    var f = (data) => {
                        var p = new Promise((resolve, reject) => {
                            callback(data);
                            resolve();
                        });
                        return p;
                    };
                    this.onTrigger.push(f);
                }
                addAsyncListener(callback) {
                    this.onTrigger.push(callback);
                }
                onTriggeredAsync() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return this.onOccur();
                    });
                }
                onOccur() {
                    return __awaiter(this, void 0, void 0, function* () {
                        var p = new Promise((resolve, reject) => {
                            this.addListener((data) => {
                                resolve(data);
                            });
                        });
                        return p;
                    });
                }
            };
            exports_4("EventHandler", EventHandler);
            DebouncedEventHandler = class DebouncedEventHandler extends EventHandler {
                constructor(resetTimeMilliSeconds = 500) {
                    super();
                    this.resetTimeMilliSeconds = resetTimeMilliSeconds;
                    this.lastTime = null;
                }
                triggerAsync(data) {
                    const _super = Object.create(null, {
                        triggerAsync: { get: () => super.triggerAsync }
                    });
                    return __awaiter(this, void 0, void 0, function* () {
                        if (this.lastTime = null) {
                            this.lastTime = (new Date()).addDays(-10);
                        }
                        var timeDiff = (new Date()).getTime() - this.lastTime.getTime();
                        if (timeDiff > this.resetTimeMilliSeconds) {
                            this.lastTime = new Date();
                            yield _super.triggerAsync.call(this, data);
                        }
                    });
                }
                ;
                trigger(data) {
                    if (this.lastTime = null) {
                        this.lastTime = (new Date()).addDays(-10);
                    }
                    var timeDiff = (new Date()).getTime() - this.lastTime.getTime();
                    if (timeDiff > this.resetTimeMilliSeconds) {
                        this.lastTime = new Date();
                        super.trigger(data);
                    }
                }
            };
            exports_4("DebouncedEventHandler", DebouncedEventHandler);
            AfterStableEventHandler = class AfterStableEventHandler extends EventHandler {
                constructor(waitTimeMilliSeconds = 500) {
                    super();
                    this.waitTimeMilliSeconds = waitTimeMilliSeconds;
                    this.timer = null;
                }
                throttle() {
                    clearTimeout(this.timer);
                    this.timer = window.setTimeout(() => {
                        super.triggerAsync(this.lastData);
                    }, this.waitTimeMilliSeconds || 500);
                }
                triggerAsync(data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        this.lastData = data;
                        this.throttle();
                    });
                }
                ;
                trigger(data) {
                    this.lastData = data;
                    this.throttle();
                }
            };
            exports_4("AfterStableEventHandler", AfterStableEventHandler);
            OneTimeEventHandler = class OneTimeEventHandler extends EventHandler {
                constructor() {
                    super();
                    this.hasTriggered = false;
                    this.triggerData = null;
                }
                triggerAsync(data) {
                    const _super = Object.create(null, {
                        triggerAsync: { get: () => super.triggerAsync }
                    });
                    return __awaiter(this, void 0, void 0, function* () {
                        yield _super.triggerAsync.call(this, data);
                        this.triggerData = data;
                        this.hasTriggered = true;
                    });
                }
                ;
                trigger(data) {
                    super.trigger(data);
                    this.triggerData = data;
                    this.hasTriggered = true;
                }
                addAsyncListener(callback) {
                    super.addAsyncListener(callback);
                    if (this.hasTriggered) {
                        callback(this.triggerData);
                    }
                }
                addListener(callback) {
                    super.addListener(callback);
                    if (this.hasTriggered) {
                        callback(this.triggerData);
                    }
                }
            };
            exports_4("OneTimeEventHandler", OneTimeEventHandler);
            //}
        }
    };
});
System.register("Debug", ["Tasks", "DateTime"], function (exports_5, context_5) {
    "use strict";
    var Tasks, DateTime, Message, Messages, messages;
    var __moduleName = context_5 && context_5.id;
    function debugWrite(msg) {
        messages.addMessage(msg);
    }
    exports_5("debugWrite", debugWrite);
    function addMessage(when, msg) {
        messages.addMessage(new Message(when, msg));
    }
    exports_5("addMessage", addMessage);
    return {
        setters: [
            function (Tasks_2) {
                Tasks = Tasks_2;
            },
            function (DateTime_1) {
                DateTime = DateTime_1;
            }
        ],
        execute: function () {
            String.prototype.replaceAll = function (str1, str2, ignore) {
                return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
            };
            //module Debug {
            Message = class Message {
                constructor(_date, _message) {
                    this._date = _date;
                    this._message = _message;
                }
                get date() {
                    return this._date;
                }
                set date(value) {
                    this._date = value;
                }
                get message() {
                    return this._message;
                }
                set message(value) {
                    this._message = value;
                }
            };
            exports_5("Message", Message);
            Messages = class Messages {
                constructor(displayLocation) {
                    this.displayLocation = displayLocation;
                    this.isReady = false;
                    this.messages = new Array();
                    this.area = null;
                    this.init = () => __awaiter(this, void 0, void 0, function* () {
                        yield Tasks.whenReady();
                        yield Tasks.delay(1);
                        this.area = $(this.displayLocation);
                        var area = this.area;
                        if (area.length == 0) {
                            $("body").append("<ol class='MessageArea' style='display:block;'></ol>");
                            this.displayLocation = $(".MessageArea");
                        }
                        yield Tasks.whenTrue(() => {
                            return DateTime.serverTime.serverTimeLoaded;
                        });
                        this.isReady = true;
                        this.refreshMessages();
                    });
                    this.refreshMessages = () => {
                        if (DateTime.serverTime.serverStartTime != null) {
                            DateTime.serverTime.startTime = new Date(DateTime.serverTime.serverStartTime.getTime() - DateTime.serverTime.offset);
                        }
                        var area = this.area;
                        this.messages.forEach((item) => {
                            var dt = item.date;
                            var secondsFromStart = (dt.getTime() - DateTime.serverTime.startTime.getTime()) / 1000;
                            dt.setTime(dt.getTime() + DateTime.serverTime.offset);
                            var msgTP = DateTime.formatTime(dt);
                            var msgPt = item.message;
                            var msgElapsed = "Time Elapsed From Start: " + DateTime.formatTimeSpan(secondsFromStart);
                            console.log(msgTP + " " + msgPt + " - " + msgElapsed);
                            $(area).append("<li><span class='timePart'>" + msgTP + "</span> - <span class='messagePart'>" + msgPt + "</span> - <span class='timeElapsedPart'>" + msgElapsed + "</span></li>");
                        });
                        this.messages = new Array();
                        try {
                            var item = $(area).find("li:last-child");
                            var t = (item.position().top + item.height()) - $(area).height() + $(area).scrollTop();
                            $(area).scrollTop(t);
                        }
                        catch (err) {
                        }
                    };
                    this.showMessages = () => {
                        if (this.isReady) {
                            this.refreshMessages();
                        }
                    };
                    this.addMessage = (msg) => {
                        if (!(msg instanceof Message)) {
                            var now = new Date();
                            msg = new Message(now, msg);
                        }
                        this.messages.push(msg);
                        this.showMessages();
                    };
                    this.init();
                }
            };
            exports_5("Messages", Messages);
            exports_5("messages", messages = new Messages(".MessageArea"));
            //}
        }
    };
});
/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
System.register("ApiLibrary", ["DateTime", "SiteInfo", "Debug"], function (exports_6, context_6) {
    "use strict";
    var DateTime, SiteInfo, Debug, callTypes;
    var __moduleName = context_6 && context_6.id;
    function addDataToUrl(url, name, value) {
        if (url.indexOf(name + "=") >= 0) {
            url = url.replace(name + "=", name + "Old=");
        }
        if (url.indexOf("?") >= 0) {
            url = url + '&' + name + '=' + value;
        }
        else {
            url = url + '?' + name + '=' + value;
        }
        return url;
    }
    exports_6("addDataToUrl", addDataToUrl);
    function addFormatToUrl(url) {
        return addDataToUrl(url, "Format", "JSON");
    }
    exports_6("addFormatToUrl", addFormatToUrl);
    function addAntiForgeryToken(data) {
        //var token = $('input[name="__RequestVerificationToken"]').val();
        //if (token != null && token != "") {
        //    data.__RequestVerificationToken = token;
        //}
        return data;
    }
    exports_6("addAntiForgeryToken", addAntiForgeryToken);
    function apiCall(type, url, sendData, successCallback, errorCallback, beforeSend) {
        var cntPiece = "Cnt=" + DateTime.getTimeCount();
        if (url.indexOf("?") != -1) {
            cntPiece = "&" + cntPiece;
        }
        else {
            cntPiece = "?" + cntPiece;
        }
        var fUrl = url + cntPiece;
        if (url.indexOf("://") <= 0) {
            if (url.indexOf(SiteInfo.virtualUrl()) == 0) {
                url = url.replace(SiteInfo.virtualUrl(), "");
            }
            if (url.lastIndexOf("/", 0) === 0) {
                url = url.substring(1);
            }
            if (url.indexOf(SiteInfo.virtualUrl()) == 0) {
                url = url.replace(SiteInfo.virtualUrl(), "");
            }
            fUrl = SiteInfo.getVirtualURL(url) + cntPiece;
        }
        fUrl = fUrl.replaceAll("//", "/").replaceAll(":/", "://");
        var pd = true;
        var sd = sendData; //JSON.stringify(sendData);
        var contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        if (sendData instanceof Blob) {
            contentType = "application/octet-stream";
            pd = false;
            //sd = JSON.stringify(sendData);
        }
        else if ((typeof sendData) == "object") {
            contentType = "application/json; charset=utf-8";
            sd = JSON.stringify(sendData);
        }
        $.ajax({
            url: fUrl,
            processData: pd,
            beforeSend: (request) => {
                if (beforeSend) {
                    beforeSend(request);
                }
                //request.setRequestHeader("Authority", authorizationToken);
            },
            type: callTypes[type],
            data: sd,
            dataType: "json",
            contentType: contentType,
            success: (data, textStatus, jqXHR) => {
                if (successCallback) {
                    successCallback(data, textStatus, jqXHR);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                if (errorCallback) {
                    errorCallback(jqXHR, textStatus, errorThrown);
                }
            }
        });
    }
    exports_6("apiCall", apiCall);
    function getCallAsync(url, seqNum, sendData = null) {
        return new Promise((resolve, reject) => {
            getCall(url, seqNum, sendData, (data, seq) => {
                resolve(data);
            }, (jqXHR, extStatus, errorThrown) => {
                reject(Error(jqXHR, extStatus, errorThrown));
            });
        });
    }
    exports_6("getCallAsync", getCallAsync);
    function putCallAsync(url, seqNum, sendData) {
        return new Promise((resolve, reject) => {
            putCall(url, seqNum, sendData, (data, seq) => {
                resolve(data);
            }, (jqXHR, extStatus, errorThrown) => {
                reject(Error(jqXHR, extStatus, errorThrown));
            });
        });
    }
    exports_6("putCallAsync", putCallAsync);
    function postCallAsync(url, seqNum, sendData) {
        return new Promise((resolve, reject) => {
            postCall(url, seqNum, sendData, (data, seq) => {
                resolve(data);
            }, (jqXHR, extStatus, errorThrown) => {
                reject(Error(jqXHR, extStatus, errorThrown));
            });
        });
    }
    exports_6("postCallAsync", postCallAsync);
    //export function getCall(url: string,
    //    successCallback?: (data: any) => any,
    //    errorCallback?: (textStatus: string, errorThrown: string) => any) :void;
    function getCall(url, seqNum, sendData, successCallback, errorCallback) {
        if (!seqNum) {
            seqNum = DateTime.getTimeCount();
        }
        apiCall(callTypes.GET, url, sendData, (data, textStatus, request) => {
            var seq = parseInt(request.getResponseHeader("seq"));
            if (successCallback) {
                successCallback(data, seq);
            }
        }, errorCallback, (request) => {
            request.setRequestHeader("seq", "" + seqNum);
        });
    }
    exports_6("getCall", getCall);
    function putCall(url, seqNum, sendData, successCallback, errorCallback) {
        if (!seqNum) {
            seqNum = DateTime.getTimeCount();
        }
        sendData = sendData || {};
        addAntiForgeryToken(sendData);
        apiCall(callTypes.PUT, url, sendData, (data, textStatus, request) => {
            var seq = parseInt(request.getResponseHeader("seq"));
            if (successCallback) {
                successCallback(data, seq);
            }
        }, errorCallback, (request) => {
            request.setRequestHeader("seq", "" + seqNum);
        });
    }
    exports_6("putCall", putCall);
    function postCall(url, seqNum, sendData, successCallback, errorCallback) {
        if (!seqNum) {
            seqNum = DateTime.getTimeCount();
        }
        sendData = sendData || {};
        addAntiForgeryToken(sendData);
        apiCall(callTypes.POST, url, sendData, (data, textStatus, request) => {
            var seq = parseInt(request.getResponseHeader("seq"));
            if (successCallback) {
                successCallback(data, seq);
            }
        }, errorCallback, (request) => {
            request.setRequestHeader("seq", "" + seqNum);
        });
    }
    exports_6("postCall", postCall);
    function Error(jqXHR, textStatus, errorThrown) {
        Debug.debugWrite(errorThrown);
        var err = {};
        //err.jqXHR = jqXHR;
        err.errorThrown = errorThrown;
        err.textStatus = textStatus;
        err.responseText = jqXHR.responseText;
        err.responseObj = jqXHR.responseJSON;
        return err;
    }
    return {
        setters: [
            function (DateTime_2) {
                DateTime = DateTime_2;
            },
            function (SiteInfo_1) {
                SiteInfo = SiteInfo_1;
            },
            function (Debug_1) {
                Debug = Debug_1;
            }
        ],
        execute: function () {/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
            //module ApiLibrary {
            (function (callTypes) {
                callTypes[callTypes["GET"] = 0] = "GET";
                callTypes[callTypes["PUT"] = 1] = "PUT";
                callTypes[callTypes["POST"] = 2] = "POST";
            })(callTypes || (callTypes = {}));
            exports_6("callTypes", callTypes);
            //}
        }
    };
});
System.register("DateTime", ["Tasks", "Debug", "ApiLibrary"], function (exports_7, context_7) {
    "use strict";
    var Tasks, Debug, ApiLibrary, ServerTime, serverTime;
    var __moduleName = context_7 && context_7.id;
    function dateFromIso8601(isostr) {
        if (isostr == null) {
            return new Date();
        }
        var parts = isostr.match(/\d+/g);
        if (parts.length < 6) {
            return new Date();
        }
        var y = parseInt(parts[0]);
        var m = parseInt(parts[1]) - 1;
        var d = parseInt(parts[2]);
        var h = parseInt(parts[3]);
        var mn = parseInt(parts[4]);
        var s = parseInt(parts[5]);
        return new Date(y, m, d, h, mn, s);
    }
    exports_7("dateFromIso8601", dateFromIso8601);
    function formatTimeSpan(ts) {
        if (ts <= 0) {
            return "";
        }
        var ms = ts - Math.floor(ts);
        ts = ts - ms;
        var second = ts % 60;
        ts = ts - second;
        second = second + ms;
        ts = ts / 60;
        var minute = ts % 60;
        ts = ts - minute;
        ts = ts / 60;
        var hour = Math.floor(ts);
        var shour = "" + hour;
        var sminute = "" + minute;
        var ssecond = "" + Math.round(second * 1000) / 1000;
        if (hour < 10) {
            shour = "0" + shour;
        }
        if (minute < 10) {
            sminute = "0" + sminute;
        }
        if (second < 10) {
            ssecond = "0" + ssecond;
        }
        return shour + ":" + sminute + ":" + ssecond;
    }
    exports_7("formatTimeSpan", formatTimeSpan);
    function formatDate(dt) {
        var curr_date = dt.getDate();
        var curr_month = dt.getMonth() + 1; //Months are zero based
        var curr_year = dt.getFullYear();
        return '' + curr_month + "/" + curr_date + "/" + curr_year;
    }
    exports_7("formatDate", formatDate);
    function formatTime(dt, hideMs) {
        hideMs = !!hideMs;
        var hour = dt.getHours();
        var minute = dt.getMinutes();
        var second = dt.getSeconds();
        var ms = dt.getMilliseconds();
        var ampm = "AM";
        if (hour > 11) {
            hour = hour - 12;
            ampm = "PM";
        }
        if (hour == 0) {
            hour = 12;
        }
        var sminute = "" + minute;
        var ssecond = "" + second;
        if (minute < 10) {
            sminute = "0" + sminute;
        }
        if (second < 10) {
            ssecond = "0" + ssecond;
        }
        return hour + ":" + sminute + (hideMs ? "" : ":" + ssecond) + " " + ampm + (hideMs ? "" : ":" + ms);
    }
    exports_7("formatTime", formatTime);
    function getTimeCount() {
        var Now = new Date();
        var Cnt = Math.round(Now.getTime());
        return Cnt;
    }
    exports_7("getTimeCount", getTimeCount);
    return {
        setters: [
            function (Tasks_3) {
                Tasks = Tasks_3;
            },
            function (Debug_2) {
                Debug = Debug_2;
            },
            function (ApiLibrary_1) {
                ApiLibrary = ApiLibrary_1;
            }
        ],
        execute: function () {
            Date.prototype.addDays = function (days) {
                var dat = new Date(this.valueOf());
                dat.setDate(dat.getDate() + days);
                return dat;
            };
            ServerTime = class ServerTime {
                constructor(timeApiUrl) {
                    this.timeApiUrl = timeApiUrl;
                    this.serverStartTime = null;
                    this.startTime = new Date();
                    this.serverDateTime = null;
                    this.offset = 0;
                    this.serverTimeLoaded = false;
                    this.init = () => __awaiter(this, void 0, void 0, function* () {
                        Debug.debugWrite("Script Loaded in Browser");
                        yield Tasks.whenReady();
                        Debug.debugWrite("Page Loaded in Browser");
                        yield Tasks.delay(1);
                        yield this.refreshServerTime();
                        Debug.debugWrite("Time Loaded from Server");
                    });
                    this.now = () => {
                        return new Date();
                    };
                    this.refreshServerTime = () => __awaiter(this, void 0, void 0, function* () {
                        var URL = this.timeApiUrl;
                        var data = yield ApiLibrary.getCallAsync(URL);
                        var sdt = new Date(Date.parse(data.item.date));
                        sdt.setTime(sdt.getTime() + data.item.milliseconds);
                        this.serverDateTime = sdt;
                        var ldt = new Date();
                        this.offset = (this.serverDateTime.getTime() - ldt.getTime());
                        this.serverTimeLoaded = true;
                        Debug.debugWrite("ServerDateTime = " + formatTime(this.serverDateTime));
                        Debug.debugWrite("LocalDateTime = " + formatTime(ldt));
                        Debug.debugWrite(`Offset = ${this.offset}`);
                        return;
                    });
                    //alert(this.timeApiUrl);
                    this.init();
                }
            };
            exports_7("ServerTime", ServerTime);
            exports_7("serverTime", serverTime = new ServerTime("/api/v1/Time"));
            ;
            ;
            ;
            //}
        }
    };
});
System.register("SiteInfo", ["DateTime", "LinqToJs"], function (exports_8, context_8) {
    "use strict";
    var DateTime, LinqToJs_1, SiteInfo, siteInfo;
    var __moduleName = context_8 && context_8.id;
    function fixDoubleSlash(path) {
        path = path.replaceAll("//", "/");
        path = path.replaceAll(":/", "://");
        return path;
    }
    function virtualUrl() {
        return siteInfo.virtualUrl;
    }
    exports_8("virtualUrl", virtualUrl);
    function applicationUrl() {
        return siteInfo.applicationUrl;
    }
    exports_8("applicationUrl", applicationUrl);
    function isCleanHtml() {
        return siteInfo.isCleanHtml;
    }
    exports_8("isCleanHtml", isCleanHtml);
    function refreshPage() {
        redirect(getFullURL(window.location.pathname + window.location.search));
    }
    exports_8("refreshPage", refreshPage);
    function getParameterByName(name) {
        return siteInfo.getParameterByName(name);
    }
    exports_8("getParameterByName", getParameterByName);
    function getVirtualURL(url) {
        return fixDoubleSlash(applicationUrl() + virtualUrl() + url);
    }
    exports_8("getVirtualURL", getVirtualURL);
    function getFullURL(url) {
        var cntPiece = "Cnt=" + DateTime.getTimeCount();
        if (url.indexOf("?") != -1) {
            cntPiece = "&" + cntPiece;
        }
        else {
            cntPiece = "?" + cntPiece;
        }
        return fixDoubleSlash(applicationUrl() + url + cntPiece);
    }
    exports_8("getFullURL", getFullURL);
    function redirect(url) {
        window.location.href = url;
    }
    exports_8("redirect", redirect);
    return {
        setters: [
            function (DateTime_3) {
                DateTime = DateTime_3;
            },
            function (LinqToJs_1_1) {
                LinqToJs_1 = LinqToJs_1_1;
            }
        ],
        execute: function () {
            //module SiteInfo {
            SiteInfo = class SiteInfo {
                constructor() {
                    this.sitepath = "/";
                    this.virtualUrl = "";
                    this.applicationUrl = "";
                    this.isCleanHtml = false;
                    this.getParameterByName = (name) => {
                        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
                        var results = regex.exec(location.search);
                        return (results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " ")));
                    };
                    var scripts = document.getElementsByTagName('script');
                    var lastScript = scripts[scripts.length - 1];
                    var scriptName = lastScript.src;
                    var subDirs = new LinqToJs_1.Queryable(["/JS/", "/BUNDLES/"]);
                    var indexs = subDirs.select((d) => {
                        return scriptName.toUpperCase().indexOf(d);
                    }).where((i) => i > 0);
                    if (indexs.any()) {
                        var minIdx = indexs.min();
                        this.sitepath = scriptName.substring(0, minIdx) + "/";
                    }
                    var base = window.location.protocol + "//" + window.location.host + "/";
                    this.virtualUrl = this.sitepath.replace(base, "");
                    this.applicationUrl = base;
                    var t = window.location.pathname + window.location.search;
                    this.isCleanHtml = (t.indexOf("Format=CleanHTML") > -1);
                }
            };
            exports_8("SiteInfo", SiteInfo);
            exports_8("siteInfo", siteInfo = new SiteInfo());
            ;
            ;
            ;
            //}
        }
    };
});
System.register("Dialog", ["EventHandler"], function (exports_9, context_9) {
    "use strict";
    var EventHandler, lastDialogNumber, dialogReturn, dialogCloseEvents, DialogTypeEnum;
    var __moduleName = context_9 && context_9.id;
    function resetPage() {
        setTimeout(() => { window.location.reload(); }, 100);
    }
    exports_9("resetPage", resetPage);
    function closeDialog() {
        window.closeBasePopupDialog('');
        resetPage();
    }
    exports_9("closeDialog", closeDialog);
    function showBlockUI(msg) {
        if (msg == null) {
            msg = " Processing...";
        }
        $.blockUI({ message: '<h1><span class="spinner">&nbsp;&nbsp;</span>' + msg + '</h1>' });
    }
    exports_9("showBlockUI", showBlockUI);
    function hideBlockUI() {
        $.unblockUI();
    }
    exports_9("hideBlockUI", hideBlockUI);
    //export function getFancyBoxDialogSettings(width?: number, height?: number, title?: string, noScroll?: boolean, resizable?: boolean, callOnClose?: string, onComplete?: () => void): IFbDialogSettings {
    //    return {
    //        dialogType: DialogTypeEnum.FancyBox,
    //        width: width,
    //        height: height,
    //        callOnClose: callOnClose,
    //        onComplete: onComplete,
    //        noScroll: noScroll,
    //        resizable: resizable
    //    };
    //}
    function getBootstrapDialogSettings(settings, callOnClose, onComplete) {
        return {
            dialogType: DialogTypeEnum.Bootstrap,
            width: null,
            height: null,
            callOnClose: callOnClose,
            onComplete: onComplete,
            title: null,
            item: null,
            settings: settings
        };
    }
    exports_9("getBootstrapDialogSettings", getBootstrapDialogSettings);
    function getJqueryUiDialogSettings(width, height, title, settings, callOnClose, onComplete) {
        return {
            dialogType: DialogTypeEnum.JQueryDialog,
            width: width,
            height: height,
            callOnClose: callOnClose,
            onComplete: onComplete,
            title: title,
            item: null,
            settings: settings
        };
    }
    exports_9("getJqueryUiDialogSettings", getJqueryUiDialogSettings);
    function getDefaultDialogSettings(dialogType) {
        if (dialogType == DialogTypeEnum.FancyBox) {
            //return getFancyBoxDialogSettings();
        }
        else if (dialogType == DialogTypeEnum.Bootstrap) {
            return getBootstrapDialogSettings();
        }
        else {
            return getJqueryUiDialogSettings();
        }
    }
    exports_9("getDefaultDialogSettings", getDefaultDialogSettings);
    //export function showElementInDialog(item: JQuery, settings: IDialogSettings): JQuery {
    //    return null;
    //}
    function showHtmlInDialog(html, options, parent) {
        var myParent = parent;
        if (self != top) {
            return top.showHtmlInDialog(html, options, self);
        }
        if (!myParent) {
            myParent = top;
        }
        var baseOptions = getDefaultDialogSettings((options != null ? options.dialogType : null));
        var settings = $.extend(true, {}, baseOptions, options);
        exports_9("lastDialogNumber", lastDialogNumber = lastDialogNumber + 1);
        if (settings.dialogType == DialogTypeEnum.JQueryDialog) {
            showHtmlInJQDialog(html, settings, myParent);
        }
        else if (settings.dialogType == DialogTypeEnum.Bootstrap) {
            showHtmlInBootstrap(html, settings, myParent);
        }
        else {
            //showHtmlInFancyDialog(html, <IFbDialogSettings>settings, myParent);
        }
    }
    exports_9("showHtmlInDialog", showHtmlInDialog);
    //export function showVideoInDialog(url: string, options?: IDialogSettings) {
    //    var id = "video_" + DateTime.getTimeCount();
    //    var baseOptions: IDialogSettings = {
    //        dialogType: DialogTypeEnum.FancyBox,
    //        width: 640,
    //        height: 355,
    //        callOnClose: null,
    //        onComplete: () => {
    //            //alert(id + "_PU");
    //            $f(id + '_PU', "/WMP/flash/flowplayer-3.2.12.swf", {
    //                'key': '#$695a7519d0be6236d25',
    //                clip: {
    //                    url: url,
    //                    autoPlay: true,
    //                    autoBuffering: true
    //                }
    //            });
    //        }
    //    };
    //    var fbSettings = $.extend(true, {}, baseOptions, options);
    //    var html: string = '<a href="' + url + '" id="' + id + '_PU' + '" style="display:block; width:' + fbSettings.width + 'px; height:' + fbSettings.height + 'px; padding:0; margin:10px;"></a>';
    //    showHtmlInDialog(html, fbSettings);
    //};
    function showInDialog(url, title, options) {
        if (url == "") {
            return;
        }
        if (url.indexOf("?") != -1) {
            url = url + "&Format=CleanHTML";
        }
        else {
            url = url + "?Format=CleanHTML";
        }
        showHtmlInDialog($("<iframe style='border:0px; width:100%; height: 99%; overflow: auto;'  seamless='seamless' class='dialog' title='" + title + "' />").attr("src", url), options);
    }
    exports_9("showInDialog", showInDialog);
    function confirmDialog(msg, dialogType, callback) {
        var mg = '<p style="padding: 20px;"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' + msg + '</p>';
        var diaSettings = null;
        if (dialogType == DialogTypeEnum.FancyBox) {
            //diaSettings = getFancyBoxDialogSettings(300, 200, "");
        }
        else if (dialogType == DialogTypeEnum.Bootstrap) {
            diaSettings = getBootstrapDialogSettings();
        }
        else {
            diaSettings = getJqueryUiDialogSettings(300, 200, "", {
                resizable: false,
                buttons: {
                    "Ok": () => {
                        window.closeBasePopupDialog(null);
                        if (callback) {
                            callback(true);
                        }
                    },
                    Cancel: () => {
                        window.closeBasePopupDialog(null);
                        if (callback) {
                            callback(false);
                        }
                    }
                }
            });
        }
        showHtmlInDialog(mg, diaSettings);
    }
    exports_9("confirmDialog", confirmDialog);
    //function showHtmlInFancyDialog(html: string | JQuery, settings?: IFbDialogSettings, myParent?: Window): JQuery {
    //    var dialogNum = lastDialogNumber;
    //    //var item = $(html);
    //    var Settings: FancyboxOptions = {
    //        autoSize: false,
    //        'padding': 0,
    //        height: 500,
    //        width: 700,
    //        afterClose: function () {
    //            $("#globalPopUpDialog_" + dialogNum).remove();
    //            if (settings.callOnClose && settings.callOnClose != "") {
    //                var fn = myParent[settings.callOnClose];
    //                if (typeof fn === 'function') {
    //                    fn(settings, dialogReturn);
    //                }
    //            }
    //        },
    //        afterLoad: settings.onComplete
    //    };
    //    (<any>Settings).autoDimensions = false;
    //    Settings.type = 'inline';
    //    if (settings.noScroll) {
    //        Settings.scrolling = 'no';
    //    }
    //    if (!(settings.width == null || '' + settings.width == "")) {
    //        settings.width = parseInt('' + settings.width);
    //        if (settings.width > 0) {
    //            Settings.width = settings.width;
    //        }
    //    }
    //    if (!(settings.height == null || '' + settings.height == "")) {
    //        settings.height = parseInt('' + settings.height);
    //        if (settings.height > 0) {
    //            Settings.height = settings.height;
    //        }
    //    }
    //    var maxWidth = $(top).width();
    //    if (Settings.width > maxWidth) {
    //        Settings.width = maxWidth;
    //    }
    //    $(document.body).append("<div id='globalPopUpDialog_" + dialogNum + "' style='height: 100%; padding:0; margin:0;'></div>");
    //    var pUp = $("#globalPopUpDialog_" + dialogNum);
    //    pUp.append($(html));
    //    Settings.href = "#globalPopUpDialog_" + dialogNum;
    //    $.fancybox(Settings);
    //    return pUp;
    //}
    function showHtmlInBootstrap(html, settings, myParent) {
        var dialogNum = lastDialogNumber;
        var modalSettings = {
            backdrop: 'static',
            keyboard: false,
            show: true
        };
        //var DialogSettings = {
        //    autoOpen: true,
        //    modal: true,
        //    title: settings.title,
        //    width: 700,
        //    height: 500,
        //    close: function () {
        //        $("#globalPopUpDialog_" + dialogNum).remove();
        //        if (settings.callOnClose && settings.callOnClose != "") {
        //            var fn = myParent[settings.callOnClose];
        //            if (typeof fn === 'function') {
        //                fn(settings, dialogReturn);
        //            }
        //        }
        //        dialogReturn = null;
        //    }
        //};
        //if (!(settings.width == null || '' + settings.width == "")) {
        //    settings.width = parseInt('' + settings.width);
        //    if (settings.width > 0) {
        //        DialogSettings.width = settings.width;
        //    }
        //}
        //if (!(settings.height == null || '' + settings.height == "")) {
        //    settings.height = parseInt('' + settings.height);
        //    if (settings.height > 0) {
        //        DialogSettings.height = settings.height;
        //    }
        //}
        //DialogSettings = $.extend(true, {}, settings.settings, DialogSettings);
        //var maxWidth = $(top).width();
        //if (DialogSettings.width > maxWidth) {
        //    DialogSettings.width = maxWidth;
        //}
        $(document.body).append("<div id='globalPopUpDialog_" + dialogNum + "'></div>");
        var pUp = $("#globalPopUpDialog_" + dialogNum);
        var ht = $(html);
        var url = ht.attr('src');
        ht.attr('src', 'about:blank');
        pUp.append(ht);
        var modal = $(pUp).modal(modalSettings);
        modal.on('hidden', () => {
            $("#globalPopUpDialog_" + dialogNum).remove();
            if (settings.callOnClose && settings.callOnClose != "") {
                var fn = myParent[settings.callOnClose];
                if (typeof fn === 'function') {
                    fn(settings, dialogReturn);
                }
            }
            exports_9("dialogReturn", dialogReturn = null);
        });
        //pUp.dialog(DialogSettings);
        pUp.find('iframe').attr('src', url);
        return pUp;
    }
    function showHtmlInJQDialog(html, settings, myParent) {
        var dialogNum = lastDialogNumber;
        var DialogSettings = {
            autoOpen: true,
            modal: true,
            title: settings.title,
            width: 700,
            height: 500,
            close: function () {
                $("#globalPopUpDialog_" + dialogNum).remove();
                if (settings.callOnClose && settings.callOnClose != "") {
                    var fn = myParent[settings.callOnClose];
                    if (typeof fn === 'function') {
                        fn(settings, dialogReturn);
                    }
                }
                exports_9("dialogReturn", dialogReturn = null);
            }
        };
        if (!(settings.width == null || '' + settings.width == "")) {
            settings.width = parseInt('' + settings.width);
            if (settings.width > 0) {
                DialogSettings.width = settings.width;
            }
        }
        if (!(settings.height == null || '' + settings.height == "")) {
            settings.height = parseInt('' + settings.height);
            if (settings.height > 0) {
                DialogSettings.height = settings.height;
            }
        }
        DialogSettings = $.extend(true, {}, settings.settings, DialogSettings);
        var maxWidth = $(top).width();
        if (DialogSettings.width > maxWidth) {
            DialogSettings.width = maxWidth;
        }
        $(document.body).append("<div id='globalPopUpDialog_" + dialogNum + "'></div>");
        var pUp = $("#globalPopUpDialog_" + dialogNum);
        var ht = $(html);
        var url = ht.attr('src');
        ht.attr('src', 'about:blank');
        pUp.append(ht);
        pUp.dialog(DialogSettings);
        pUp.find('iframe').attr('src', url);
        return pUp;
    }
    return {
        setters: [
            function (EventHandler_1) {
                EventHandler = EventHandler_1;
            }
        ],
        execute: function () {
            Window.prototype.closeBasePopupDialog = (data) => {
                if (self != top) {
                    top.closeBasePopupDialog(data);
                    return;
                }
                exports_9("dialogReturn", dialogReturn = data);
                dialogCloseEvents.trigger();
                try {
                    $('#globalPopUpDialog_' + lastDialogNumber).dialog("close");
                    exports_9("lastDialogNumber", lastDialogNumber = lastDialogNumber - 1);
                }
                catch (err) {
                    var a = 1;
                }
                try {
                    $('#globalPopUpDialog_' + lastDialogNumber).modal('hide');
                }
                catch (err) {
                }
                try {
                    //$.fancybox.close();
                }
                catch (err) {
                }
            };
            Window.prototype.showHtmlInDialog = (html, settings, parent) => {
                return showHtmlInDialog(html, settings, parent);
            };
            exports_9("lastDialogNumber", lastDialogNumber = 1234);
            exports_9("dialogReturn", dialogReturn = null);
            exports_9("dialogCloseEvents", dialogCloseEvents = new EventHandler.EventHandler());
            (function (DialogTypeEnum) {
                DialogTypeEnum[DialogTypeEnum["JQueryDialog"] = 0] = "JQueryDialog";
                DialogTypeEnum[DialogTypeEnum["FancyBox"] = 1] = "FancyBox";
                DialogTypeEnum[DialogTypeEnum["Bootstrap"] = 2] = "Bootstrap";
            })(DialogTypeEnum || (DialogTypeEnum = {}));
            exports_9("DialogTypeEnum", DialogTypeEnum);
            ;
        }
    };
});
System.register("JqueryEx", ["ApiLibrary"], function (exports_10, context_10) {
    "use strict";
    var ApiLibrary;
    var __moduleName = context_10 && context_10.id;
    function createAjaxOptions(beforeCall, afterResponse) {
        return {
            beforeCall: beforeCall,
            afterResponse: afterResponse
        };
    }
    exports_10("createAjaxOptions", createAjaxOptions);
    function checkOptions(options) {
        var defaults = {
            beforeCall: null,
            afterResponse: null
        };
        var settings = $.extend({}, defaults, options);
        if (!settings.beforeCall) {
            settings.beforeCall = (item) => {
                return false;
            };
        }
        if (!settings.afterResponse) {
            settings.afterResponse = (item, data) => {
                return;
            };
        }
        return settings;
    }
    return {
        setters: [
            function (ApiLibrary_2) {
                ApiLibrary = ApiLibrary_2;
            }
        ],
        execute: function () {
            $.extend({
                replaceTag: function (currentElem, newTagObj, keepProps) {
                    var $currentElem = $(currentElem);
                    var i, $newTag = $(newTagObj).clone();
                    if (keepProps) { //{{{
                        //var newTag = $newTag[0];
                        //newTag.className = currentElem.className;
                        //$.extend(newTag.classList, currentElem.classList);
                        $.each(currentElem.attributes, function (index, it) {
                            $newTag.attr(it.name, it.value);
                        });
                        //$.extend(newTag.attributes, currentElem.attributes);
                    } //}}}
                    $currentElem.wrapAll($newTag);
                    $currentElem.contents().unwrap();
                    // return node; (Error spotted by Frank van Luijn)
                    return this; // Suggested by ColeLawrence
                }
            });
            $.fn.extend({
                replaceTag: function (newTagObj, keepProps) {
                    // "return" suggested by ColeLawrence
                    return this.each(function () {
                        jQuery.replaceTag(this, newTagObj, keepProps);
                    });
                }
            });
            jQuery.fn.extend({
                disable: function (state) {
                    var items = this;
                    return items.each(function () {
                        var $this = $(this);
                        if ($this.is('input, button, textarea, select'))
                            this.disabled = state;
                        else
                            $this.toggleClass('disabled', state);
                        $(this).prop("disabled", state);
                    });
                }
            });
            jQuery.fn.submitUsingAjax = function (options) {
                var settings = checkOptions(options);
                var form = this;
                var clickedItem = this;
                if (settings.beforeCall(null, this)) {
                    return;
                }
                var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr("action"));
                var formData = $(this).serialize();
                ApiLibrary.postCall(clickUrl, null, formData, (data) => {
                    settings.afterResponse(clickedItem, data);
                });
            };
            jQuery.fn.onSubmitUseAjax = function (options) {
                var settings = checkOptions(options);
                var form = this;
                $(form).find("[type='submit']").click(function () {
                    $("[type='submit']", $(this).parents("form")).removeAttr("clicked");
                    $(this).attr("clicked", "true");
                });
                $(form).submit(function (evt) {
                    evt.preventDefault();
                    var clickedItem = $(this).find("[type=submit][clicked=true]");
                    //var clickedItem = this;
                    if (settings.beforeCall(clickedItem, this)) {
                        return;
                    }
                    $(form).find("input[type='submit'],button[type='submit']").disable(true);
                    var clickUrl = ApiLibrary.addFormatToUrl($(form).attr("action"));
                    $(this).append("<input type='hidden' name='" + clickedItem.attr('name') + "' value='" + clickedItem.val() + "'/>");
                    var formData = $(this).serialize();
                    ApiLibrary.postCall(clickUrl, null, formData, (data) => {
                        settings.afterResponse(clickedItem, data);
                        $(form).find("input[type='submit'],button[type='submit']").disable(false);
                    });
                });
            };
            jQuery.fn.onClickAjaxGet = function (options) {
                var settings = checkOptions(options);
                var item = this;
                $(item).click(function (evt) {
                    if (!evt.isDefaultPrevented()) {
                        evt.preventDefault();
                        var clickedItem = this;
                        if (settings.beforeCall(clickedItem, null)) {
                            return;
                        }
                        var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr("href"));
                        ApiLibrary.getCall(clickUrl, null, (data) => {
                            settings.afterResponse(clickedItem, data);
                        });
                    }
                });
            };
            jQuery.fn.onClickAjaxPost = function (options) {
                var settings = checkOptions(options);
                var item = this;
                $(item).click(function (evt) {
                    if (!evt.isDefaultPrevented()) {
                        evt.preventDefault();
                        var clickedItem = this;
                        if (settings.beforeCall(clickedItem, this)) {
                            return;
                        }
                        var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr("href"));
                        ApiLibrary.postCall(clickUrl, null, null, (data) => {
                            settings.afterResponse(this, data);
                        });
                    }
                });
            };
            jQuery.fn.onClickPostAsForm = function (options) {
                var settings = checkOptions(options);
                var item = this;
                $(item).click(function (evt) {
                    if (!evt.isDefaultPrevented()) {
                        evt.preventDefault();
                        var clickedItem = this;
                        if (settings.beforeCall(clickedItem, this)) {
                            return;
                        }
                        var clickUrl = $(clickedItem).attr("href");
                        //ApiLibrary.addFormatToUrl($(clickedItem).attr("href"));
                        var doc = "<form action='" + clickUrl + "' method='post'></form>";
                        var form = $(doc).appendTo(document.body);
                        $(form).submit();
                    }
                });
            };
            //}
        }
    };
});
System.register("UCIT_Libs", ["LinqToJs", "Lock", "Tasks", "EventHandler", "Dialog", "DateTime", "Debug", "ApiLibrary", "JqueryEx", "SiteInfo"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (LinqToJs_2) {
                exports_11("LinqToJs", LinqToJs_2);
            },
            function (Locking_2) {
                exports_11("Locking", Locking_2);
            },
            function (Tasks_4) {
                exports_11("Tasks", Tasks_4);
            },
            function (EventHandler_2) {
                exports_11("EventHandler", EventHandler_2);
            },
            function (Dialog_1) {
                exports_11("Dialog", Dialog_1);
            },
            function (DateTime_4) {
                exports_11("DateTime", DateTime_4);
            },
            function (Debug_3) {
                exports_11("Debug", Debug_3);
            },
            function (ApiLibrary_3) {
                exports_11("ApiLibrary", ApiLibrary_3);
            },
            function (JqueryEx_1) {
                exports_11("JqueryEx", JqueryEx_1);
            },
            function (SiteInfo_2) {
                exports_11("SiteInfo", SiteInfo_2);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=Libs.js.map