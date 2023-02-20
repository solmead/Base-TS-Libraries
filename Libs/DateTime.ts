import * as Tasks from './Tasks'
import * as Debug from './Debug'
import * as ApiLibrary from './ApiLibrary'

declare global {
    interface Date {
        addDays(days: number): Date;
    }
}

Date.prototype.addDays = function (days: number): Date {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

//module DateTime {
interface ITimeReturn {
    item: ITimeData;
    }
interface ITimeData {
    date?: string;
    milliseconds: number;

}

    export class ServerTime {
        public serverStartTime: Date = null;
        public startTime:Date = new Date();
        public serverDateTime:Date = null;
        public offset:number = 0;
        public serverTimeLoaded:boolean = false;

        constructor(public timeApiUrl: string) {
            //alert(this.timeApiUrl);
            this.init();
        }

        public init = async () => {
            Debug.debugWrite("Script Loaded in Browser");
            await Tasks.whenReady();
            Debug.debugWrite("Page Loaded in Browser");
            await Tasks.delay(1);
            await this.refreshServerTime();
            Debug.debugWrite("Time Loaded from Server");
        }


        public now = () => {
            return new Date();
        }


        public refreshServerTime = async () => {
            var URL = this.timeApiUrl;

            var data = await ApiLibrary.getCallAsync<ITimeReturn>(URL);

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
        }




    }

    export var serverTime: ServerTime = new ServerTime("/api/v1/Time");



    export function dateFromIso8601(isostr: string) {
        if (isostr == null) {
            return new Date();
        }
        var parts = isostr.match(/\d+/g);
        if (parts.length < 6) {
            return new Date();
        }
        var y: number = parseInt(parts[0]);
        var m: number = parseInt(parts[1]) - 1;
        var d: number = parseInt(parts[2]);
        var h: number = parseInt(parts[3]);
        var mn: number = parseInt(parts[4]);
        var s: number = parseInt(parts[5]);


        return new Date(y, m, d, h, mn, s);
    }


    export function formatTimeSpan(ts: number) {
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

        var shour: string = "" + hour;
        var sminute: string = "" + minute;
        var ssecond: string = "" + Math.round(second * 1000) / 1000;


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

    export function formatDate(dt: Date) {
        var curr_date = dt.getDate();
        var curr_month = dt.getMonth() + 1; //Months are zero based
        var curr_year = dt.getFullYear();
        return '' + curr_month + "/" + curr_date + "/" + curr_year;
    };

    export function formatTime(dt: Date, hideMs?: boolean) {
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

        var sminute: string = "" + minute;
        var ssecond: string = "" + second;

        if (minute < 10) {
            sminute = "0" + sminute;
        }
        if (second < 10) {
            ssecond = "0" + ssecond;
        }

        return hour + ":" + sminute + (hideMs ? "" : ":" + ssecond) + " " + ampm + (hideMs ? "" : ":" + ms);
    };


    export function getTimeCount() {
        var Now = new Date();
        var Cnt = Math.round(Now.getTime());
        return Cnt;
    };




//}


