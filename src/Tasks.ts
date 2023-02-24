/* tslint:disable:max-classes-per-file */
import * as Locking from './Lock';

//var $:JQueryStatic = $ || null as JQueryStatic;

export interface IException {
  message: string;
}

export class Task<TT> {
  public promise: Promise<TT> = null;

  private resolveFunc: (value?: TT | PromiseLike<TT>) => void;

  constructor(private func: (cback?: (val?: TT) => void) => void) {
    this.promise = new Promise<TT>((resolve) => {
      this.resolveFunc = resolve;
    });

    if (!this.func) {
      this.func = (rFunc: (val?: TT) => void): void => {
        return rFunc();
      };
    } else if (func.length === 0) {
      const bfunc = this.func;
      this.func = (rFunc: (val?: TT) => void) => {
        bfunc();
        rFunc();
      };
    }
  }

  public then = (onFulfilled: (value?: TT) => TT | PromiseLike<TT>): Promise<TT> => {
    return this.promise.then(onFulfilled);
  };

  public start = (): void => {
    this.func((val?: TT) => {
      this.resolveFunc(val);
    });
  };
}

export interface IDebouncedTask<TT> extends Task<TT> {
  trigger: () => void;
  call: () => void;
}

export class RecurringTask {
  private _isRunning: boolean = false;

  private refreshLock: Locking.MutexLock = null;
  private async timedCall(): Promise<void> {
    if (this.callback) {
      if (!this.refreshLock.isLocked) {
        await this.refreshLock.LockAreaAsync(async () => {
          await this.callback();
        });
      }
    }
    if (this.isRunning) {
      setTimeout(() => {
        this.timedCall();
      }, this.timeout);
    }
  }

  constructor(private callback: () => Promise<void>, private timeout: number, private maxLockTime: number = 30000) {
    this.refreshLock = new Locking.MutexLock(this.maxLockTime);
  }

  get isRunning(): boolean {
    return this._isRunning;
  }

  setTimeOut = (time: number): void => {
    this.timeout = time;
  };

  start = (): void => {
    if (!this.isRunning) {
      this._isRunning = true;
      this.timedCall();
    }
  };
  stop = (): void => {
    this._isRunning = false;
  };
}

export function runAfterWait(waitTimeMilliSeconds: number): IDebouncedTask<void> {
  const t = new Task<void>((cback) => {
    cback();
  }) as IDebouncedTask<void>;

  let timer: number = null;

  const throttle = (): void => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      t.start();
    }, waitTimeMilliSeconds || 500);
  };

  t.trigger = (): void => {
    throttle();
  };
  t.call = (): void => {
    clearTimeout(timer);
    t.start();
  };
  return t;
}

export function debounced(): IDebouncedTask<void> {
  const t = new Task<void>((cback) => {
    cback();
  }) as IDebouncedTask<void>;

  t.trigger = (): void => {
    t.start();
  };
  t.call = (): void => {
    t.start();
  };
  return t;
}

export function delay(msec: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, msec);
  });
}

export function whenReady(): Promise<void> {
  return new Promise<void>((resolve) => {
    if ($) {
        $(() => {
            resolve();
        });
    } else {
        resolve();
    }
  });
}

export function whenTrue(trueFunc: () => boolean, maxLockTime: number = 60 * 60 * 1000): Promise<void> {
  return Locking.WhenTrueAsync(trueFunc, maxLockTime);
}

export async function WhenAll<tRet>(
  list: Array<Promise<tRet>>,
  progressCB?: (numFinished: number, total: number) => void,
): Promise<Array<tRet>> {
  const tot = list.length;
  let fin = 0;
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
