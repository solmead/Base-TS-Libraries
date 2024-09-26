import * as ApiLibrary from './ApiLibrary';
import * as Debug from './Debug';

declare global {
  interface JQueryStatic {
    disable(state: boolean): void;
    simulate(event?: string, options?: any): void;
    replaceTag(
      item: JQuery<HTMLElement> | HTMLElement | string,
      newTagObj: JQuery<HTMLElement> | HTMLElement | string,
      keepProps: boolean,
    ): any;
    replaceTag(newTagObj: JQuery<HTMLElement> | HTMLElement | string, keepProps: boolean): any;
  }

  interface JQuery {
    submitUsingAjax(options?: IAjaxCallOptions): void;
    onSubmitUseAjax(options?: IAjaxCallOptions): void;
    onClickAjaxGet(options?: IAjaxCallOptions): void;
    onClickAjaxPost(options?: IAjaxCallOptions): void;
    onClickPostAsForm(options?: IAjaxCallOptions): void;
    disable(state: boolean): void;
    simulate(event?: string, options?: any): void;
    replaceTag(
      item: JQuery<HTMLElement> | HTMLElement | string,
      newTagObj: JQuery<HTMLElement> | HTMLElement | string,
      keepProps: boolean,
    ): any;
    replaceTag(newTagObj: JQuery<HTMLElement> | HTMLElement | string, keepProps: boolean): any;
  }
}

export interface IAjaxCallOptions {
  beforeCall: (item: JQuery | HTMLElement, form: JQuery | HTMLElement) => boolean;
  afterResponse?: (item: JQuery | HTMLElement, data: any) => any;
}
export function createAjaxOptions(
  beforeCall: (item: JQuery | HTMLElement, form: JQuery | HTMLElement) => boolean,
  afterResponse?: (form: JQuery | HTMLElement, data: any) => any,
): IAjaxCallOptions {
  return {
    beforeCall,
    afterResponse,
  };
}

function checkOptions(options?: IAjaxCallOptions): IAjaxCallOptions {
  const defaults: IAjaxCallOptions = {
    beforeCall: null,
    afterResponse: null,
  };
  const settings = $.extend({}, defaults, options) as IAjaxCallOptions;

  if (!settings.beforeCall) {
    settings.beforeCall = (item: JQuery | HTMLElement): boolean => {
      return false;
    };
  }
  if (!settings.afterResponse) {
    settings.afterResponse = (item: JQuery | HTMLElement, data: any): any => {
      return;
    };
  }

  return settings;
}

export function AddScript(fileName: string): Promise<void> {
  Debug.debugWrite("AddScript: " + fileName);
  const scr = document.createElement('script');
  const head = document.head || document.getElementsByTagName('head')[0];
  scr.src = fileName;
  scr.async = false; // optionally
  const p = new Promise<void>((resolve) => {
      scr.addEventListener('load', () => {
          resolve();
      });
  });
  head.insertBefore(scr, head.firstChild);

  return p;
}
export async function AddCss(fileName: string): Promise<void> {
  Debug.debugWrite("AddCss: " + fileName);

  const head = document.head || document.getElementsByTagName('head')[0];
  
  const style = document.createElement('link')
  style.href = fileName
  style.type = 'text/css'
  style.rel = 'stylesheet'
  head.append(style);


}


if (jQuery) {
  if ($) {
    $.extend({
      replaceTag: (
        currentElem: JQuery<HTMLElement> | HTMLElement | string,
        newTagObj: JQuery<HTMLElement> | HTMLElement | string,
        keepProps: boolean,
      ) => {
        const $currentElem = $(currentElem as any);
        const $newTag = $(newTagObj as any).clone();
        if (keepProps) {
          $.each($currentElem[0].attributes, (index, it) => {
            $newTag.attr(it.name, it.value);
          });
        }
        $currentElem.wrapAll($newTag);
        $currentElem.contents().unwrap();
        // return node; (Error spotted by Frank van Luijn)
        return this; // Suggested by ColeLawrence
      },
    });

    $.fn.extend({
      replaceTag: (newTagObj: JQuery<HTMLElement> | HTMLElement | string, keepProps: boolean) => {
        // "return" suggested by ColeLawrence
        const elem = this as JQuery<HTMLElement>;
        return elem.each(() => {
          jQuery.replaceTag(elem, newTagObj, keepProps);
        });
      },
    });
  }
  jQuery.fn.extend({
    disable: function (state: boolean) {
      const items = $(this);
      return items.each((i, it) => {
        const $this = $(it);
        if ($this.is('input, button, textarea, select')) ($this[0] as any).disabled = state;
        else $this.toggleClass('disabled', state);
        try {
          $this.prop('disabled', state);
        } catch {}
      });
    },
  });

  jQuery.fn.submitUsingAjax = function (options?: IAjaxCallOptions) {
    const settings = checkOptions(options);
    const form = this;
    const clickedItem = this;
    if (settings.beforeCall(null, this)) {
      return;
    }
    const clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr('action'));
    const formData = $(this).serialize();
    ApiLibrary.postCall(clickUrl, null, formData, (data: any) => {
      settings.afterResponse(clickedItem, data);
    });
  };

  jQuery.fn.onSubmitUseAjax = function (options?: IAjaxCallOptions) {
    const settings = checkOptions(options);
    const form = this;

    $(form)
      .find("[type='submit']")
      .click(function () {
        $("[type='submit']", $(this).parents('form')).removeAttr('clicked');
        $(this).attr('clicked', 'true');
      });

    $(form).submit(function (evt) {
      evt.preventDefault();
      const clickedItem = $(this).find('[type=submit][clicked=true]');

      if (settings.beforeCall(clickedItem, this)) {
        return;
      }
      $(form).find("input[type='submit'],button[type='submit']").disable(true);
      const clickUrl = ApiLibrary.addFormatToUrl($(form).attr('action'));
      $(this).append(
        "<input type='hidden' name='" + clickedItem.attr('name') + "' value='" + clickedItem.val() + "'/>",
      );
      const formData = $(this).serialize();

      ApiLibrary.postCall(clickUrl, null, formData, (data: any) => {
        settings.afterResponse(clickedItem, data);
        $(form).find("input[type='submit'],button[type='submit']").disable(false);
      });
    });
  };

  jQuery.fn.onClickAjaxGet = function (options?: IAjaxCallOptions) {
    const settings = checkOptions(options);
    const item = this;
    $(item).click(function (evt) {
      if (!evt.isDefaultPrevented()) {
        evt.preventDefault();
        const clickedItem = this;
        if (settings.beforeCall(clickedItem, null)) {
          return;
        }
        const clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr('href'));
        ApiLibrary.getCall(clickUrl, null, (data: any) => {
          settings.afterResponse(clickedItem, data);
        });
      }
    });
  };

  jQuery.fn.onClickAjaxPost = function (options?: IAjaxCallOptions) {
    const settings = checkOptions(options);
    const item = this;
    $(item).click(function (evt) {
      if (!evt.isDefaultPrevented()) {
        evt.preventDefault();
        const clickedItem = this;
        if (settings.beforeCall(clickedItem, this)) {
          return;
        }
        const clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr('href'));
        ApiLibrary.postCall(clickUrl, null, null, (data: any) => {
          settings.afterResponse(this, data);
        });
      }
    });
  };

  jQuery.fn.onClickPostAsForm = function (options?: IAjaxCallOptions) {
    const settings = checkOptions(options);
    const item = this;
    $(item).click(function (evt) {
      if (!evt.isDefaultPrevented()) {
        evt.preventDefault();
        const clickedItem = this;
        if (settings.beforeCall(clickedItem, this)) {
          return;
        }
        const clickUrl = $(clickedItem).attr('href');

        const doc: string = "<form action='" + clickUrl + "' method='post'></form>";

        const form: JQuery = $(doc).appendTo(document.body);
        $(form).submit();
      }
    });
  };
}
