
//module Locking {

    export async function WhenTrueAsync(func: () => boolean, maxLockTime:number = 60000): Promise < void> {

        var p = new Promise<void>((resolve, reject) => {
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
    }


    export class MutexLock {

        private locked = false;
        private lastCalled: Date = null;
        //private refreshLock:Lock.Locker = null;

        constructor(private maxLockTime?: number) {
            //this.refreshLock = new Lock.Locker(maxLockTime);
        }

        get isLocked(): boolean {
            var seconds = 0;
            if (this.lastCalled) {
                seconds = ((new Date()).getTime() - this.lastCalled.getTime()) / 1000;
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
            //await this.WhenTrueAsync(() => {
            //    return !this.isLocked;
            //});

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




//}