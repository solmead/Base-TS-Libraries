/* tslint:disable:max-classes-per-file */
import * as Tasks from './Tasks';
import * as DateTime from './DateTime';

declare global {
  interface String {
    replaceAll(str1: string, str2: string, ignore?: boolean): string;
  }
}

String.prototype.replaceAll = function (str1: string, str2: string, ignore?: boolean) {
  return this.replace(
    new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), ignore ? 'gi' : 'g'),
    typeof str2 === 'string' ? str2.replace(/\$/g, '$$$$') : str2,
  );
};

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
    this.addMessage('Script Loaded in Browser');
    await Tasks.whenReady();
    this.addMessage('Page Loaded in Browser');
    DateTime.serverTime.raiseMessageEvent.addListener((msg) => {
      this.addMessage(msg);
    });

    await Tasks.delay(1);
    if ($) {
      this.area = $(this.displayLocation as any);
      const area = this.area;
      if (area.length === 0) {
        $('body').append("<ol class='MessageArea' style='display:block;'></ol>");
        this.displayLocation = $('.MessageArea');
      }
      await Tasks.whenTrue(() => {
        return DateTime.serverTime.serverTimeLoaded;
      });
    }

    this.isReady = true;
    this.refreshMessages();
  };

  private refreshMessages = () => {
    if (DateTime.serverTime.serverStartTime != null) {
      DateTime.serverTime.startTime = new Date(
        DateTime.serverTime.serverStartTime.getTime() - DateTime.serverTime.offset,
      );
    }
    const area = this.area;

    this.messages.forEach((item) => {
      const dt = item.date;
      const secondsFromStart = (dt.getTime() - DateTime.serverTime.startTime.getTime()) / 1000;
      dt.setTime(dt.getTime() + DateTime.serverTime.offset);
      const msgTP = DateTime.formatTime(dt);
      const msgPt = item.message;
      const msgElapsed = 'Time Elapsed From Start: ' + DateTime.formatTimeSpan(secondsFromStart);

      if ($) {
        // tslint:disable-next-line:no-console
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
      }
    });
    this.messages = new Array<Message>();
    try {
      if ($) {
        const item = $(area).find('li:last-child');
        const t = item.position().top + item.height() - $(area).height() + $(area).scrollTop();
        $(area).scrollTop(t);
      }
    } catch (err) {}
  };

  public showMessages = () => {
    if (this.isReady) {
      this.refreshMessages();
    }
  };

  public addMessage = (msg: string | Message): void => {
    if (!(msg instanceof Message)) {
      const now = new Date();
      msg = new Message(now, msg as string);
    }

    this.messages.push(msg as Message);

    this.showMessages();
  };
}

export const messages: Messages = new Messages('.MessageArea');

export function debugWrite(msg: string): void {
  messages.addMessage(msg);
}
export function addMessage(when: Date, msg: string) {
  messages.addMessage(new Message(when, msg));
}
