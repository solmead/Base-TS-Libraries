import * as Tasks from './Tasks';


export class EventHandler<T> {
  private onTrigger: Array<(data?: T) => Promise<void>> = [];

  constructor() {}

  trigger(data?: T): void {
    this.onTrigger.asQueryable().forEach((fn) => {
      fn(data);
    });
  }

  async triggerAsync(data?: T): Promise<void> {
    await Tasks.delay(1);

    for (var a = 0; a < this.onTrigger.length; a++) {
      var fn = this.onTrigger[a];
      await fn(data);
    }
  }

  addListener(callback: (data?: T) => void): void {
    var f = (data?: T): Promise<void> => {
      var p = new Promise<void>((resolve, reject) => {
        callback(data);
        resolve();
      });
      return p;
    };

    this.onTrigger.push(f);
  }
  addAsyncListener(callback: (data?: T) => Promise<void>): void {
    this.onTrigger.push(callback);
  }

  async onTriggeredAsync(): Promise<T> {
    return this.onOccur();
  }

  async onOccur(): Promise<T> {
    var p = new Promise<T>((resolve, reject) => {
      this.addListener((data) => {
        resolve(data);
      });
    });
    return p;
  }
}

export class DebouncedEventHandler<T> extends EventHandler<T> {
  private lastTime: Date = null;

  constructor(private resetTimeMilliSeconds: number = 500) {
    super();
  }

  async triggerAsync(data?: T): Promise<void> {
    if ((this.lastTime = null)) {
      this.lastTime = new Date().addDays(-10);
    }
    var timeDiff = new Date().getTime() - this.lastTime.getTime();

    if (timeDiff > this.resetTimeMilliSeconds) {
      this.lastTime = new Date();

      await super.triggerAsync(data);
    }
  }

  trigger(data?: T): void {
    if ((this.lastTime = null)) {
      this.lastTime = new Date().addDays(-10);
    }

    var timeDiff = new Date().getTime() - this.lastTime.getTime();

    if (timeDiff > this.resetTimeMilliSeconds) {
      this.lastTime = new Date();

      super.trigger(data);
    }
  }
}

export class AfterStableEventHandler<T> extends EventHandler<T> {
  constructor(private waitTimeMilliSeconds: number = 500) {
    super();
  }

  private timer: number = null;
  private lastData: T;

  throttle(): void {
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      super.triggerAsync(this.lastData);
    }, this.waitTimeMilliSeconds || 500);
  }

  async triggerAsync(data?: T): Promise<void> {
    this.lastData = data;
    this.throttle();
  }

  trigger(data?: T): void {
    this.lastData = data;
    this.throttle();
  }
}

export class OneTimeEventHandler<T> extends EventHandler<T> {
  public hasTriggered: boolean = false;
  private triggerData: T = null;

  constructor() {
    super();
  }

  async triggerAsync(data?: T): Promise<void> {
    await super.triggerAsync(data);
    this.triggerData = data;
    this.hasTriggered = true;
  }

  trigger(data?: T): void {
    super.trigger(data);
    this.triggerData = data;
    this.hasTriggered = true;
  }

  addAsyncListener(callback: (data?: T) => Promise<void>): void {
    super.addAsyncListener(callback);
    if (this.hasTriggered) {
      callback(this.triggerData);
    }
  }

  addListener(callback: (data?: T) => any): void {
    super.addListener(callback);
    if (this.hasTriggered) {
      callback(this.triggerData);
    }
  }
}
//}
