/// <reference path="../node_modules/@types/bootstrap/index.d.ts" />
import { ModalOption } from 'bootstrap';
import * as EventHandler from './EventHandler';
import * as SiteInfo from './SiteInfo';
import * as Tasks from './Tasks';
import * as DateTime from './DateTime';

declare global {
  interface Window {
    closeBasePopupDialog: (data?: any) => void;
    showHtmlInDialog(html: string | JQuery, settings: IDialogSettings, parent?: Window): JQuery;
  }
}

Window.prototype.closeBasePopupDialog = (data?: any): void => {
  if (self != top) {
    top.closeBasePopupDialog(data);
    return;
  }
  dialogReturn = data;
  dialogCloseEvents.trigger();
  try {
    $('#globalPopUpDialog_' + lastDialogNumber).dialog('close');
    lastDialogNumber = lastDialogNumber - 1;
  } catch (err) {
    var a = 1;
  }
  try {
    $('#globalPopUpDialog_' + lastDialogNumber).modal('hide');
  } catch (err) {}
  try {
    //$.fancybox.close();
  } catch (err) {}
};
Window.prototype.showHtmlInDialog = (html: string | JQuery, settings: IDialogSettings, parent?: Window): JQuery => {
  return showHtmlInDialog(html, settings, parent);
};

export var lastDialogNumber: number = 1234;
export var dialogReturn: any = null;
export var dialogCloseEvents = new EventHandler.EventHandler<any>();

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
  FancyBox,
  Bootstrap,
}

export interface IDialogSettings {
  dialogType: DialogTypeEnum;
  width?: number;
  height?: number;
  callOnClose?: string;
  onComplete?: () => void;
}

//export interface IFbDialogSettings extends IDialogSettings {
//    noScroll?: boolean;
//    resizable?: boolean;
//}

export interface IBootDialogSettings extends IDialogSettings {
  title?: string;
  item?: JQuery;
  settings?: ModalOption;
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

//export function getFancyBoxDialogSettings(width?: number, height?: number, title?: string, noScroll?: boolean, resizable?: boolean, callOnClose?: string, onComplete?: () => void): IFbDialogSettings {

//    return {
//        dialogType: DialogTypeEnum.FancyBox,
//        width: width,
//        height: height,
//        callOnClose: callOnClose,
//        onComplete: onComplete,
//        noScroll: noScroll,
//        resizable: resizable
//    };

//}
export function getBootstrapDialogSettings(
  settings?: ModalOption,
  callOnClose?: string,
  onComplete?: () => void,
): IBootDialogSettings {
  return {
    dialogType: DialogTypeEnum.Bootstrap,
    width: null,
    height: null,
    callOnClose: callOnClose,
    onComplete: onComplete,
    title: null,
    item: null,
    settings: settings,
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
    width: width,
    height: height,
    callOnClose: callOnClose,
    onComplete: onComplete,
    title: title,
    item: null,
    settings: settings,
  };
}

export function getDefaultDialogSettings(dialogType?: DialogTypeEnum): IDialogSettings {
  if (dialogType == DialogTypeEnum.FancyBox) {
    //return getFancyBoxDialogSettings();
  } else if (dialogType == DialogTypeEnum.Bootstrap) {
    return getBootstrapDialogSettings();
  } else {
    return getJqueryUiDialogSettings();
  }
}

//export function showElementInDialog(item: JQuery, settings: IDialogSettings): JQuery {
//    return null;
//}

export function showHtmlInDialog(html: string | JQuery, options?: IDialogSettings, parent?: Window): JQuery {
  var myParent = parent;
  if (self != top) {
    return top.showHtmlInDialog(html, options, self);
  }
  if (!myParent) {
    myParent = top;
  }
  var baseOptions = getDefaultDialogSettings(options != null ? options.dialogType : null);
  var settings = <IDialogSettings>$.extend(true, {}, baseOptions, options);

  lastDialogNumber = lastDialogNumber + 1;

  if (settings.dialogType == DialogTypeEnum.JQueryDialog) {
    showHtmlInJQDialog(html, <IJQuiDialogSettings>settings, myParent);
  } else if (settings.dialogType == DialogTypeEnum.Bootstrap) {
    showHtmlInBootstrap(html, <IBootDialogSettings>settings, myParent);
  } else {
    //showHtmlInFancyDialog(html, <IFbDialogSettings>settings, myParent);
  }
}

//export function showVideoInDialog(url: string, options?: IDialogSettings) {

//    var id = "video_" + DateTime.getTimeCount();

//    var baseOptions: IDialogSettings = {
//        dialogType: DialogTypeEnum.FancyBox,
//        width: 640,
//        height: 355,
//        callOnClose: null,
//        onComplete: () => {
//            //alert(id + "_PU");
//            $f(id + '_PU', "/WMP/flash/flowplayer-3.2.12.swf", {
//                'key': '#$695a7519d0be6236d25',
//                clip: {
//                    url: url,
//                    autoPlay: true,
//                    autoBuffering: true
//                }
//            });
//        }
//    };
//    var fbSettings = $.extend(true, {}, baseOptions, options);

//    var html: string = '<a href="' + url + '" id="' + id + '_PU' + '" style="display:block; width:' + fbSettings.width + 'px; height:' + fbSettings.height + 'px; padding:0; margin:10px;"></a>';
//    showHtmlInDialog(html, fbSettings);
//};

export function showInDialog(url: string, title: string, options?: IDialogSettings) {
  if (url == '') {
    return;
  }
  if (url.indexOf('?') != -1) {
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
  var mg =
    '<p style="padding: 20px;"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' +
    msg +
    '</p>';

  var diaSettings: IDialogSettings = null;
  if (dialogType == DialogTypeEnum.FancyBox) {
    //diaSettings = getFancyBoxDialogSettings(300, 200, "");
  } else if (dialogType == DialogTypeEnum.Bootstrap) {
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

//function showHtmlInFancyDialog(html: string | JQuery, settings?: IFbDialogSettings, myParent?: Window): JQuery {
//    var dialogNum = lastDialogNumber;

//    //var item = $(html);

//    var Settings: FancyboxOptions = {
//        autoSize: false,
//        'padding': 0,
//        height: 500,
//        width: 700,
//        afterClose: function () {
//            $("#globalPopUpDialog_" + dialogNum).remove();
//            if (settings.callOnClose && settings.callOnClose != "") {
//                var fn = myParent[settings.callOnClose];
//                if (typeof fn === 'function') {
//                    fn(settings, dialogReturn);
//                }
//            }
//        },
//        afterLoad: settings.onComplete
//    };
//    (<any>Settings).autoDimensions = false;

//    Settings.type = 'inline';
//    if (settings.noScroll) {
//        Settings.scrolling = 'no';
//    }
//    if (!(settings.width == null || '' + settings.width == "")) {
//        settings.width = parseInt('' + settings.width);
//        if (settings.width > 0) {
//            Settings.width = settings.width;
//        }
//    }
//    if (!(settings.height == null || '' + settings.height == "")) {
//        settings.height = parseInt('' + settings.height);
//        if (settings.height > 0) {
//            Settings.height = settings.height;
//        }
//    }

//    var maxWidth = $(top).width();
//    if (Settings.width > maxWidth) {
//        Settings.width = maxWidth;
//    }

//    $(document.body).append("<div id='globalPopUpDialog_" + dialogNum + "' style='height: 100%; padding:0; margin:0;'></div>");

//    var pUp = $("#globalPopUpDialog_" + dialogNum);

//    pUp.append($(html));

//    Settings.href = "#globalPopUpDialog_" + dialogNum;

//    $.fancybox(Settings);
//    return pUp;
//}

function showHtmlInBootstrap(html: string | JQuery, settings?: IBootDialogSettings, myParent?: Window): JQuery {
  var dialogNum = lastDialogNumber;

  var modalSettings: ModalOption = {
    backdrop: 'static',
    keyboard: false,
    show: true,
  };

  //var DialogSettings = {
  //    autoOpen: true,
  //    modal: true,
  //    title: settings.title,
  //    width: 700,
  //    height: 500,
  //    close: function () {
  //        $("#globalPopUpDialog_" + dialogNum).remove();
  //        if (settings.callOnClose && settings.callOnClose != "") {
  //            var fn = myParent[settings.callOnClose];
  //            if (typeof fn === 'function') {
  //                fn(settings, dialogReturn);
  //            }
  //        }
  //        dialogReturn = null;
  //    }
  //};

  //if (!(settings.width == null || '' + settings.width == "")) {
  //    settings.width = parseInt('' + settings.width);
  //    if (settings.width > 0) {
  //        DialogSettings.width = settings.width;
  //    }
  //}
  //if (!(settings.height == null || '' + settings.height == "")) {
  //    settings.height = parseInt('' + settings.height);
  //    if (settings.height > 0) {
  //        DialogSettings.height = settings.height;
  //    }
  //}

  //DialogSettings = $.extend(true, {}, settings.settings, DialogSettings);

  //var maxWidth = $(top).width();
  //if (DialogSettings.width > maxWidth) {
  //    DialogSettings.width = maxWidth;
  //}

  $(document.body).append("<div id='globalPopUpDialog_" + dialogNum + "'></div>");

  var pUp = $('#globalPopUpDialog_' + dialogNum);
  var ht = $(<string>html);
  var url = ht.attr('src');
  ht.attr('src', 'about:blank');
  pUp.append(ht);

  var modal = $(pUp).modal(modalSettings);

  modal.on('hidden', () => {
    $('#globalPopUpDialog_' + dialogNum).remove();
    if (settings.callOnClose && settings.callOnClose != '') {
      var fn = <any>myParent[<any>settings.callOnClose];
      if (typeof fn === 'function') {
        fn(settings, dialogReturn);
      }
    }
    dialogReturn = null;
  });

  //pUp.dialog(DialogSettings);
  pUp.find('iframe').attr('src', url);
  return pUp;
}
function showHtmlInJQDialog(html: string | JQuery, settings?: IJQuiDialogSettings, myParent?: Window): JQuery {
  var dialogNum = lastDialogNumber;
  var DialogSettings = {
    autoOpen: true,
    modal: true,
    title: settings.title,
    width: 700,
    height: 500,
    close: function () {
      $('#globalPopUpDialog_' + dialogNum).remove();
      if (settings.callOnClose && settings.callOnClose != '') {
        var fn = <any>myParent[<any>settings.callOnClose];
        if (typeof fn === 'function') {
          fn(settings, dialogReturn);
        }
      }
      dialogReturn = null;
    },
  };

  if (!(settings.width == null || '' + settings.width == '')) {
    settings.width = parseInt('' + settings.width);
    if (settings.width > 0) {
      DialogSettings.width = settings.width;
    }
  }
  if (!(settings.height == null || '' + settings.height == '')) {
    settings.height = parseInt('' + settings.height);
    if (settings.height > 0) {
      DialogSettings.height = settings.height;
    }
  }

  DialogSettings = $.extend(true, {}, settings.settings, DialogSettings);

  var maxWidth = $(top).width();
  if (DialogSettings.width > maxWidth) {
    DialogSettings.width = maxWidth;
  }

  $(document.body).append("<div id='globalPopUpDialog_" + dialogNum + "'></div>");

  var pUp = $('#globalPopUpDialog_' + dialogNum);
  var ht = $(<string>html);
  var url = ht.attr('src');
  ht.attr('src', 'about:blank');
  pUp.append(ht);
  pUp.dialog(DialogSettings);
  pUp.find('iframe').attr('src', url);
  return pUp;
}
