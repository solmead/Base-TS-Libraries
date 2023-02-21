import * as Tasks from './Tasks';
import * as Debug from './Debug';
import * as ApiLibrary from './ApiLibrary';

declare global {
  interface Date {
    addDays(days: number): Date;
  }
}

Date.prototype.addDays = function (days: number): Date {
  const dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
};

interface ITimeReturn {
  item: ITimeData;
}
interface ITimeData {
  date?: string;
  milliseconds: number;
}

export class ServerTime {
  public serverStartTime: Date = null;
  public startTime: Date = new Date();
  public serverDateTime: Date = null;
  public offset: number = 0;
  public serverTimeLoaded: boolean = false;

  constructor(public timeApiUrl: string) {
    this.init();
  }

  public init = async () => {
    Debug.debugWrite('Script Loaded in Browser');
    await Tasks.whenReady();
    Debug.debugWrite('Page Loaded in Browser');
    await Tasks.delay(1);
    await this.refreshServerTime();
    Debug.debugWrite('Time Loaded from Server');
  };

  public now = () => {
    return new Date();
  };

  public refreshServerTime = async () => {
    const URL = this.timeApiUrl;

    const data = await ApiLibrary.getCallAsync<ITimeReturn>(URL);

    const sdt = new Date(Date.parse(data.item.date));
    sdt.setTime(sdt.getTime() + data.item.milliseconds);
    this.serverDateTime = sdt;
    const ldt = new Date();
    this.offset = this.serverDateTime.getTime() - ldt.getTime();
    this.serverTimeLoaded = true;
    Debug.debugWrite('ServerDateTime = ' + formatTime(this.serverDateTime));
    Debug.debugWrite('LocalDateTime = ' + formatTime(ldt));
    Debug.debugWrite(`Offset = ${this.offset}`);

    return;
  };
}

export const serverTime: ServerTime = new ServerTime('/api/v1/Time');

export function dateFromIso8601(isostr: string) {
  if (isostr == null) {
    return new Date();
  }
  const parts = isostr.match(/\d+/g);
  if (parts.length < 6) {
    return new Date();
  }
  const y: number = parseInt(parts[0], 10);
  const m: number = parseInt(parts[1], 10) - 1;
  const d: number = parseInt(parts[2], 10);
  const h: number = parseInt(parts[3], 10);
  const mn: number = parseInt(parts[4], 10);
  const s: number = parseInt(parts[5], 10);

  return new Date(y, m, d, h, mn, s);
}

export function formatTimeSpan(ts: number) {
  if (ts <= 0) {
    return '';
  }

  const ms = ts - Math.floor(ts);
  ts = ts - ms;
  let second = ts % 60;
  ts = ts - second;
  second = second + ms;
  ts = ts / 60;
  const minute = ts % 60;
  ts = ts - minute;
  ts = ts / 60;
  const hour = Math.floor(ts);

  let shour: string = '' + hour;
  let sminute: string = '' + minute;
  let ssecond: string = '' + Math.round(second * 1000) / 1000;

  if (hour < 10) {
    shour = '0' + shour;
  }
  if (minute < 10) {
    sminute = '0' + sminute;
  }
  if (second < 10) {
    ssecond = '0' + ssecond;
  }

  return shour + ':' + sminute + ':' + ssecond;
}

export function formatDate(dt: Date) {
  const currDate = dt.getDate();
  const currMonth = dt.getMonth() + 1; 
  const currYear = dt.getFullYear();
  return '' + currMonth + '/' + currDate + '/' + currYear;
}

export function formatTime(dt: Date, hideMs?: boolean) {
  hideMs = !!hideMs;
  let hour = dt.getHours();
  const minute = dt.getMinutes();
  const second = dt.getSeconds();
  const ms = dt.getMilliseconds();
  let ampm = 'AM';
  if (hour > 11) {
    hour = hour - 12;
    ampm = 'PM';
  }
  if (hour === 0) {
    hour = 12;
  }

  let sminute: string = '' + minute;
  let ssecond: string = '' + second;

  if (minute < 10) {
    sminute = '0' + sminute;
  }
  if (second < 10) {
    ssecond = '0' + ssecond;
  }

  return hour + ':' + sminute + (hideMs ? '' : ':' + ssecond) + ' ' + ampm + (hideMs ? '' : ':' + ms);
}

export function getTimeCount() {
  const Now = new Date();
  const Cnt = Math.round(Now.getTime());
  return Cnt;
}
