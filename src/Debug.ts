﻿import * as Tasks from './Tasks';
import * as DateTime from './DateTime';

declare global {
  interface String {
    replaceAll(str1: string, str2: string, ignore?: boolean): string;
  }
}

String.prototype.replaceAll = function (str1: string, str2: string, ignore?: boolean) {
  return this.replace(
    new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), ignore ? 'gi' : 'g'),
    typeof str2 == 'string' ? str2.replace(/\$/g, '$$$$') : str2,
  );
};

//module Debug {

export class Message {
  constructor(private _date: Date, private _message: string) {}

  get date(): Date {
    return this._date;
  }
  set date(value: Date) {
    this._date = value;
  }

  get message(): string {
    return this._message;
  }
  set message(value: string) {
    this._message = value;
  }
}

export class Messages {
  private isReady = false;

  public messages: Array<Message> = new Array<Message>();

  private area: JQuery = null;

  constructor(private displayLocation: JQuery | string) {
    this.init();
  }

  private init = async () => {
    await Tasks.whenReady();
    await Tasks.delay(1);
    this.area = $(<any>this.displayLocation);
    var area = this.area;
    if (area.length == 0) {
      $('body').append("<ol class='MessageArea' style='display:block;'></ol>");
      this.displayLocation = $('.MessageArea');
    }

    await Tasks.whenTrue(() => {
      return DateTime.serverTime.serverTimeLoaded;
    });

    this.isReady = true;
    this.refreshMessages();
  };

  private refreshMessages = () => {
    if (DateTime.serverTime.serverStartTime != null) {
      DateTime.serverTime.startTime = new Date(
        DateTime.serverTime.serverStartTime.getTime() - DateTime.serverTime.offset,
      );
    }
    var area = this.area;

    this.messages.forEach((item) => {
      var dt = item.date;
      var secondsFromStart = (dt.getTime() - DateTime.serverTime.startTime.getTime()) / 1000;
      dt.setTime(dt.getTime() + DateTime.serverTime.offset);
      var msgTP = DateTime.formatTime(dt);
      var msgPt = item.message;
      var msgElapsed = 'Time Elapsed From Start: ' + DateTime.formatTimeSpan(secondsFromStart);
      console.log(msgTP + ' ' + msgPt + ' - ' + msgElapsed);
      $(area).append(
        "<li><span class='timePart'>" +
          msgTP +
          "</span> - <span class='messagePart'>" +
          msgPt +
          "</span> - <span class='timeElapsedPart'>" +
          msgElapsed +
          '</span></li>',
      );
    });
    this.messages = new Array<Message>();
    try {
      var item = $(area).find('li:last-child');
      var t = item.position().top + item.height() - $(area).height() + $(area).scrollTop();
      $(area).scrollTop(t);
    } catch (err) {}
  };

  public showMessages = () => {
    if (this.isReady) {
      this.refreshMessages();
    }
  };

  public addMessage = (msg: string | Message): void => {
    if (!(msg instanceof Message)) {
      var now = new Date();
      msg = new Message(now, msg as string);
    }

    this.messages.push(msg as Message);

    this.showMessages();
  };
}

export var messages: Messages = new Messages('.MessageArea');

export function debugWrite(msg: string): void {
  messages.addMessage(msg);
}
export function addMessage(when: Date, msg: string) {
  messages.addMessage(new Message(when, msg));
}

//}
