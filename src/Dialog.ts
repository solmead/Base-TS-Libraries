import { ModalOption } from 'bootstrap';
import * as EventHandler from './EventHandler';

declare global {
  interface Window {
    closeBasePopupDialog: (data?: any) => void;
    showHtmlInDialog(html: string | JQuery, settings: IDialogSettings, parent?: Window): JQuery;
  }
}
if (Window != null) {
  Window.prototype.closeBasePopupDialog = (data?: any): void => {
    if (self !== top) {
      top.closeBasePopupDialog(data);
      return;
    }
    dialogReturn = data;
    dialogCloseEvents.trigger();
    try {
      $('#globalPopUpDialog_' + lastDialogNumber).dialog('close');
      lastDialogNumber = lastDialogNumber - 1;
    } catch (err) {}
    try {
      $('#globalPopUpDialog_' + lastDialogNumber).modal('hide');
    } catch (err) {}
  };

  Window.prototype.showHtmlInDialog = (html: string | JQuery, settings: IDialogSettings, parent?: Window): JQuery => {
    return showHtmlInDialog(html, settings, parent);
  };
}

export let lastDialogNumber: number = 1234;
export let dialogReturn: any = null;
export const dialogCloseEvents = new EventHandler.EventHandler<any>();

export function resetPage() {
  setTimeout(() => {
    window.location.reload();
  }, 100);
}
export function closeDialog() {
  window.closeBasePopupDialog('');
  resetPage();
}

export enum DialogTypeEnum {
  JQueryDialog,
  Bootstrap,
}

export interface IDialogSettings {
  dialogType: DialogTypeEnum;
  width?: number;
  height?: number;
  callOnClose?: string;
  onComplete?: () => void;
}

export interface IBootDialogSettings extends IDialogSettings {
  title?: JQuery;
  // item?: JQuery;
  settings?: ModalOption;
  footer?: JQuery
}

export interface IJQuiDialogSettings extends IDialogSettings {
  title?: string;
  item?: JQuery;
  settings?: JQueryUI.DialogOptions;
}

export function showBlockUI(msg?: string) {
  if (msg == null) {
    msg = ' Processing...';
  }
  $.blockUI({ message: '<h1><span class="spinner">&nbsp;&nbsp;</span>' + msg + '</h1>' });
}
export function hideBlockUI() {
  $.unblockUI();
}

export function getBootstrapDialogSettings(
  settings?: ModalOption,
  callOnClose?: string,
  onComplete?: () => void,
): IBootDialogSettings {
  return {
    dialogType: DialogTypeEnum.Bootstrap,
    width: null,
    height: null,
    callOnClose,
    onComplete,
    title: null,
    // item: null,
    settings,
    footer: null,

  };
}
export function getJqueryUiDialogSettings(
  width?: number,
  height?: number,
  title?: string,
  settings?: JQueryUI.DialogOptions,
  callOnClose?: string,
  onComplete?: () => void,
): IJQuiDialogSettings {
  return {
    dialogType: DialogTypeEnum.JQueryDialog,
    width,
    height,
    callOnClose,
    onComplete,
    title,
    item: null,
    settings,
  };
}

export function getDefaultDialogSettings(dialogType?: DialogTypeEnum): IDialogSettings {
  if (dialogType === DialogTypeEnum.Bootstrap) {
    return getBootstrapDialogSettings();
  } else {
    return getJqueryUiDialogSettings();
  }
}

export function showHtmlInDialog(html: string | JQuery, options?: IDialogSettings, parent?: Window): JQuery {
  let myParent = parent;
  if (self !== top) {
    return top.showHtmlInDialog(html, options, self);
  }
  if (!myParent) {
    myParent = top;
  }
  const baseOptions = getDefaultDialogSettings(options != null ? options.dialogType : null);
  const settings = $.extend(true, {}, baseOptions, options);

  lastDialogNumber = lastDialogNumber + 1;

  if (settings.dialogType === DialogTypeEnum.JQueryDialog) {
    showHtmlInJQDialog(html, settings, myParent);
  } else if (settings.dialogType === DialogTypeEnum.Bootstrap) {
    showHtmlInBootstrap(html, settings, myParent);
  }
}

export function showInDialog(url: string, title: string, options?: IDialogSettings) {
  if (url === '') {
    return;
  }
  if (url.indexOf('?') !== -1) {
    url = url + '&Format=CleanHTML';
  } else {
    url = url + '?Format=CleanHTML';
  }

  showHtmlInDialog(
    $(
      "<iframe style='border:0px; width:100%; height: 99%; overflow: auto;'  seamless='seamless' class='dialog' title='" +
        title +
        "' />",
    ).attr('src', url),
    options,
  );
}

export function confirmDialog(msg: string, dialogType?: DialogTypeEnum, callback?: (success: boolean) => void) {
  const mg =
    '<p style="padding: 20px;"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' +
    msg +
    '</p>';

  let diaSettings: IDialogSettings = null;
  if (dialogType === DialogTypeEnum.Bootstrap) {
    diaSettings = getBootstrapDialogSettings();
  } else {
    diaSettings = getJqueryUiDialogSettings(300, 200, '', {
      resizable: false,
      buttons: {
        Ok: () => {
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
        },
      },
    });
  }

  showHtmlInDialog(mg, diaSettings);
}

function showHtmlInBootstrap(html: string | JQuery, settings?: IBootDialogSettings, myParent?: Window): JQuery {
  const dialogNum = lastDialogNumber;

  const modalSettings: ModalOption = {
    backdrop: 'static',
    keyboard: false,
    show: true,
  };

  const mSettings = $.extend(true, {}, modalSettings, settings.settings);

  $(document.body).append("<div id='globalPopUpDialog_" + dialogNum + "'></div>");

  const pUp = $('#globalPopUpDialog_' + dialogNum);

  let ht = $(html as any);

  if (settings?.title !== null || settings?.footer !== null) {
    const body = ht;
    const baseHtml = `<div class="modal" tabindex="-1">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                          </div>
                          <div class="modal-body">
                          </div>
                          <div class="modal-footer">
                          </div>
                        </div>
                      </div>
                    </div>`;
    ht = $(baseHtml);
    ht.find(".modal-header").append(settings.title);
    ht.find(".modal-body").append(body);
    ht.find(".modal-footer").append(settings.footer);

      
  } 

  var iframe = pUp.find('iframe');



  const url = iframe.attr('src');
  if (url!=null && url!="") {
    iframe.attr('src', 'about:blank');
  }

  pUp.append(ht);

  const modal = $(pUp).modal(mSettings);

  modal.on('hidden', () => {
    $('#globalPopUpDialog_' + dialogNum).remove();
    if (settings.callOnClose && settings.callOnClose !== '') {
      const fn = myParent[settings.callOnClose as any] as any;
      if (typeof fn === 'function') {
        fn(settings, dialogReturn);
      }
    }
    if (settings.onComplete != null) {
      settings.onComplete();
    }
    dialogReturn = null;
  });

  iframe.attr('src', url);
  return pUp;
}
function showHtmlInJQDialog(html: string | JQuery, settings?: IJQuiDialogSettings, myParent?: Window): JQuery {
  const dialogNum = lastDialogNumber;
  let DialogSettings = {
    autoOpen: true,
    modal: true,
    title: settings.title,
    width: 700,
    height: 500,
    close: () => {
      $('#globalPopUpDialog_' + dialogNum).remove();
      if (settings.callOnClose && settings.callOnClose !== '') {
        const fn = myParent[settings.callOnClose as any] as any;
        if (typeof fn === 'function') {
          fn(settings, dialogReturn);
        }
      }
      if (settings.onComplete != null) {
        settings.onComplete();
      }
      dialogReturn = null;
    },
  };

  if (!(settings.width === null || '' + settings.width === '')) {
    settings.width = parseInt('' + settings.width, 10);
    if (settings.width > 0) {
      DialogSettings.width = settings.width;
    }
  }
  if (!(settings.height === null || '' + settings.height === '')) {
    settings.height = parseInt('' + settings.height, 10);
    if (settings.height > 0) {
      DialogSettings.height = settings.height;
    }
  }

  DialogSettings = $.extend(true, {}, settings.settings, DialogSettings);

  const maxWidth = $(top).width();
  if (DialogSettings.width > maxWidth) {
    DialogSettings.width = maxWidth;
  }

  $(document.body).append("<div id='globalPopUpDialog_" + dialogNum + "'></div>");

  const pUp = $('#globalPopUpDialog_' + dialogNum);
  const ht = $(html as any);
  const url = ht.attr('src');
  ht.attr('src', 'about:blank');
  pUp.append(ht);
  pUp.dialog(DialogSettings);
  pUp.find('iframe').attr('src', url);
  return pUp;
}
