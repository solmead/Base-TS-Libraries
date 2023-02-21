

export async function WhenTrueAsync(func: () => boolean, maxLockTime: number = 60000): Promise<void> {
  const p = new Promise<void>((resolve, reject) => {
    const startTime = new Date();
    const check = () => {
      if (func) {
        const t = func();
        if (t) {
          resolve();
          return;
        }
      }
      const seconds = (new Date().getTime() - startTime.getTime()) / 1000;

      if (seconds >= maxLockTime) {
        reject('Max Wait Time for lock hit');
        return;
      }

      setTimeout(check, 100);
    };

    setTimeout(check, 100);
  });
  return p;
}

export class MutexLock {
  private locked = false;
  private lastCalled: Date = null;

  constructor(private maxLockTime?: number) {
    
  }

  get isLocked(): boolean {
    let seconds = 0;
    if (this.lastCalled) {
      seconds = (new Date().getTime() - this.lastCalled.getTime()) / 1000;
    }
    return this.locked && seconds < this.maxLockTime;
  }

  async WhenTrueAsync(func: () => boolean): Promise<void> {
    return WhenTrueAsync(func, this.maxLockTime);
  }

  async WaitTillUnlocked(): Promise<void> {
    await this.WhenTrueAsync(() => {
      return !this.isLocked;
    });
    return;
  }

  async LockAreaAsync(func: () => Promise<void>): Promise<void> {
    await this.BeginLock();

    await func();

    await this.EndLock();
  }

  async BeginLock(): Promise<void> {
    await this.WaitTillUnlocked();

    if (this.isLocked) {
      this.lastCalled = new Date();
      return;
    }

    this.locked = true;
    this.lastCalled = new Date();
  }

  async EndLock(): Promise<void> {
    this.locked = false;
  }
}
