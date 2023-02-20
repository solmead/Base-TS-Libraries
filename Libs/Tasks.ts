
import * as Locking from './Lock'

//module Tasks {
    

    export interface IException {
        message: string
    }
    

    export class Task<TT> {

        public promise:Promise<TT> = null;

        private resolveFunc: (value?: TT | PromiseLike<TT> )=>void;
        
        constructor(private func: (cback?: (val?: TT) => void) => void) {
            //super((resolve, reject) => {
            //        resolveFunc = resolve;
            //});

            this.promise = new Promise<TT>((resolve) => {
                this.resolveFunc = resolve;
            });

            if (!this.func) {
                this.func = (rFunc: (val?: TT) => void):void => {
                    return rFunc();
                };
            }
            else if (func.length === 0) {
                var bfunc = this.func;
                this.func = (rFunc: (val?: TT) => void) => {
                    bfunc();
                    rFunc();
                };
            }

        }

        public then = (onFulfilled: (value?: TT) => TT | PromiseLike<TT>): Promise<TT> => {
            return this.promise.then(onFulfilled);
        }

        public start = ():void => {
            this.func((val?: TT) => {
                this.resolveFunc(val);
            });
        }
        

    }

    export interface IDebouncedTask<TT> extends Task<TT> {
        trigger: () => void;
        call: () => void;
    }

    export class RecurringTask {

        private _isRunning: boolean = false;

        private refreshLock: Locking.MutexLock = null; // = new Lock.MutexLock(30000);
        //private locker = new Lock.Locker();
        private async timedCall(): Promise<void> {

            if (this.callback) {
                if (!this.refreshLock.isLocked) {
                    await this.refreshLock.LockAreaAsync(async () => {
                        await this.callback();
                    });
                }
                //await this.refreshLock.BeginLock();
                //this.callback();
                //await this.refreshLock.EndLock();
            }
            if (this.isRunning) {
                setTimeout(() => { this.timedCall(); }, this.timeout);
            }
        }


        constructor(private callback: () => Promise<void>, private timeout: number, private maxLockTime: number = 30000) {
            this.refreshLock = new Locking.MutexLock(this.maxLockTime);
        }


        get isRunning(): boolean {
            return this._isRunning;
        }
        //private set isRunning(value: boolean) {
        //    this._isRunning = value;
        //}

        setTimeOut = (time: number): void => {
            this.timeout = time;
        }
        //lock = (): void => {
        //    this.locker.lock();
        //}
        //unLock = (): void => {
        //    this.locker.unLock();
        //}
        //isLocked = (): boolean => {
        //    return this.locker.isLocked();
        //}
        start = (): void => {
            if (!this.isRunning) {
                this._isRunning = true;
                this.timedCall();
            }
        }
        stop = (): void => {
            this._isRunning = false;
        }


    }



    export function runAfterWait(waitTimeMilliSeconds: number): IDebouncedTask<void> {
        
        var t = new Task<void>((cback) => {
            cback();
        }) as IDebouncedTask<void>;

        var timer = null;

        var throttle =():void=> {
            clearTimeout(timer);
            timer = window.setTimeout( ()=> {
                    t.start();
                },
                waitTimeMilliSeconds || 500);
        }
        
        t.trigger = (): void => {
            throttle();
        }
        t.call = (): void => {
            clearTimeout(timer);
            t.start();
        }
        return t;
    }

    export function debounced(): IDebouncedTask<void> {
        var t = new Task<void>((cback) => {
            cback();
        }) as IDebouncedTask<void>;

        t.trigger = (): void => {
            t.start();
        }
        t.call = (): void => {
            t.start();
        }
        return t;
    }
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
    
    export function delay(msec: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, msec);
        });
    }

    export function whenReady(): Promise<void> {
        return new Promise<void>((resolve) => {
            $(() => {
                resolve();
            });
        });
    }

    export function whenTrue(trueFunc: () => boolean, maxLockTime: number = 60*60*1000): Promise<void> {
        return Locking.WhenTrueAsync(trueFunc, maxLockTime);
    }


    export async function WhenAll<tRet>(list: Array<Promise<tRet>>, progressCB?: ((numFinished: number, total: number) => void)): Promise<Array<tRet>> {
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



        return await Promise.all(list);
    }

//}
