import { ModalOption } from 'bootstrap';
import * as EventHandler from './EventHandler';

declare global {
  interface Window {
    closeBasePopupDialog: (data?: any) => void;
    changeDialogIFrameHeight: (height: number) => void;
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
  Window.prototype.changeDialogIFrameHeight = (height: number): void => {
    // tslint:disable-next-line:no-console
    console.log('changeDialogIFrameHeight called');
    if (self !== top) {
      // tslint:disable-next-line:no-console
      console.log('changeDialogIFrameHeight not top, calling top.changeDialogIFrameHeight');
      top.changeDialogIFrameHeight(height);
      return;
    }

    const dlg = $('#globalPopUpDialog_' + lastDialogNumber);
    if (dlg.length === 0) {
      // tslint:disable-next-line:no-console
      console.log('changeDialogIFrameHeight dlg ' + lastDialogNumber + ' not found');
    }
    const iFrame = dlg.find('iframe');
    if (iFrame.length === 0) {
      // tslint:disable-next-line:no-console
      console.log('changeDialogIFrameHeight iFrame in dlg ' + lastDialogNumber + ' not found');
    }
    // tslint:disable-next-line:no-console
    console.log('changeDialogIFrameHeight height ' + height + '');

    if (height < 50) {
      height = 200;

      // tslint:disable-next-line:no-console
      console.log('changeDialogIFrameHeight adjusted height to ' + height + ' (shouldnt happen)');
    }

    iFrame.height(height);

    try {
      dlg.modal('handleUpdate');
    } catch (err) {}
  };
}

export let lastDialogNumber: number = 1234;
export let dialogReturn: any = null;
export const dialogCloseEvents = new EventHandler.EventHandler<any>();

export function changeDialogIFrameHeight(height: number) {
  window.changeDialogIFrameHeight(height);
}

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
  footer?: JQuery;
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
  title?: string | JQuery,
  footer?: string | JQuery,
): IBootDialogSettings {
  if (title != null && (typeof title === 'string' || title instanceof String)) {
    title = $("<span>" + title + "</span>");
  }

  if (footer != null && (typeof footer === 'string' || footer instanceof String)) {
    footer = $("<span>" + footer + "</span>");
  }


  return {
    dialogType: DialogTypeEnum.Bootstrap,
    width: null,
    height: null,
    callOnClose,
    onComplete,
    title: title as JQuery,
    // item: null,
    settings,
    footer: footer as JQuery,
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
    return showHtmlInJQDialog(html, settings, myParent);
  } else if (settings.dialogType === DialogTypeEnum.Bootstrap) {
    return showHtmlInBootstrap(html, settings, myParent);
  }
}

export function showInDialog(url: string, title: string, options?: IDialogSettings): JQuery {
  if (url === '') {
    return;
  }
  if (url.indexOf('?') !== -1) {
    url = url + '&Format=CleanHTML';
  } else {
    url = url + '?Format=CleanHTML';
  }

  return showHtmlInDialog(
    $(
      "<iframe style='border:0px; width:100%; height: 99%; overflow: auto;'  seamless='seamless' class='dialog' title='" +
        title +
        "' />",
    ).attr('src', url),
    options,
  );
}

export function confirmDialogAsync(msg: string, dialogType?: DialogTypeEnum): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    confirmDialog(msg, dialogType, (success: boolean): void => {
      resolve(success);
    });
  });
}

export function confirmDialog(msg: string, dialogType?: DialogTypeEnum, callback?: (success: boolean) => void): JQuery {
  const mg =
    '<p style="padding: 20px;"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' +
    msg +
    '</p>';

  let diaSettings: IDialogSettings = null;
  if (dialogType === DialogTypeEnum.Bootstrap) {
    let callReturned = false;

    const buttons = $(`<div>
      <button type="button" class="btn btn-primary">Ok</button>
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>`);

    const bootSettings = getBootstrapDialogSettings(
      null,
      null,
      () => {
        if (callback && !callReturned) {
          callback(false);
        }
      },
      'Confirm',
      buttons,
    );
    const okBtn = buttons.find('.btn-primary');
    okBtn.on('click', () => {
      callReturned = true;
      if (callback) {
        callback(true);
      }
      window.closeBasePopupDialog(null);
    });

    diaSettings = bootSettings;
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

  return showHtmlInDialog(mg, diaSettings);
}

function showHtmlInBootstrap(html: string | JQuery, settings?: IBootDialogSettings, myParent?: Window): JQuery {
  const dialogNum = lastDialogNumber;

  const modalSettings: ModalOption = {
    backdrop: 'static',
    keyboard: false,
    show: true,
  };

  const mSettings = $.extend(true, {}, modalSettings, settings.settings);

  const dialogContent =
    `<div id='globalPopUpDialog_` +
    dialogNum +
    `' class='modal fade' tabindex='-1' aria-labelledby='' aria-hidden='true'>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
            </div>
        </div>
    </div>`;

  $(document.body).append(dialogContent);

  const pUp = $('#globalPopUpDialog_' + dialogNum);
  let contArea = pUp.find('.modal-content');

  let ht = $(html as any);

  if (settings?.title !== null || settings?.footer !== null) {
    const headerArea = $(`<div class="modal-header">
      </div>`);
    const bodyArea = $(`<div class="modal-body">
      </div>`);
    const footerArea = $(`<div class="modal-footer">
      </div>`);

      headerArea.append(settings.title)
          .append(`<button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>`);
  //bodyArea.append(body);
    footerArea.append(settings.footer);

    contArea.append(headerArea);
    contArea.append(bodyArea);
    contArea.append(footerArea);


    contArea = bodyArea;
  } else {
  }

  const iframe = ht.find('iframe');

  const url = iframe.attr('src');
  if (url !== null && url !== '' && url !== undefined) {
    iframe.attr('src', 'about:blank');
  }

  contArea.append(ht);

  // const myModal = new bootstrap.Modal(pUp[0], mSettings)
  const modal = $(pUp).modal(mSettings);
  modal.modal('show');

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

  if (url !== null && url !== '' && url !== undefined) {
    iframe.attr('src', url);
  }
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
