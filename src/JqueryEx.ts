import * as ApiLibrary from './ApiLibrary';

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

//module JqueryEx {

export interface IAjaxCallOptions {
  beforeCall: (item: JQuery | HTMLElement, form: JQuery | HTMLElement) => boolean;
  afterResponse?: (item: JQuery | HTMLElement, data: any) => any;
}
export function createAjaxOptions(
  beforeCall: (item: JQuery | HTMLElement, form: JQuery | HTMLElement) => boolean,
  afterResponse?: (form: JQuery | HTMLElement, data: any) => any,
): IAjaxCallOptions {
  return {
    beforeCall: beforeCall,
    afterResponse: afterResponse,
  };
}

function checkOptions(options?: IAjaxCallOptions): IAjaxCallOptions {
  var defaults: IAjaxCallOptions = {
    beforeCall: null,
    afterResponse: null,
  };
  var settings = $.extend({}, defaults, options) as IAjaxCallOptions;

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

$.extend({
  replaceTag: function (
    currentElem: JQuery<HTMLElement> | HTMLElement | string,
    newTagObj: JQuery<HTMLElement> | HTMLElement | string,
    keepProps: boolean,
  ) {
    var $currentElem = $(<any>currentElem);
    var i,
      $newTag = $(<any>newTagObj).clone();
    if (keepProps) {
      //{{{
      //var newTag = $newTag[0];
      //newTag.className = currentElem.className;
      //$.extend(newTag.classList, currentElem.classList);
      $.each($currentElem[0].attributes, function (index, it) {
        $newTag.attr(it.name, it.value);
      });
      //$.extend(newTag.attributes, currentElem.attributes);
    } //}}}
    $currentElem.wrapAll($newTag);
    $currentElem.contents().unwrap();
    // return node; (Error spotted by Frank van Luijn)
    return this; // Suggested by ColeLawrence
  },
});

$.fn.extend({
  replaceTag: function (newTagObj: JQuery<HTMLElement> | HTMLElement | string, keepProps: boolean) {
    // "return" suggested by ColeLawrence
    var elem = <JQuery<HTMLElement>>this;
    return elem.each(function () {
      jQuery.replaceTag(elem, newTagObj, keepProps);
    });
  },
});

jQuery.fn.extend({
  disable: function (state: boolean) {
    var items = $(this);
    return items.each(function () {
      var $this = $(this);
      if ($this.is('input, button, textarea, select')) (<any>$this[0]).disabled = state;
      else $this.toggleClass('disabled', state);

      $(this).prop('disabled', state);
    });
  },
});

jQuery.fn.submitUsingAjax = function (options?: IAjaxCallOptions) {
  var settings = checkOptions(options);
  var form = this;
  var clickedItem = this;
  if (settings.beforeCall(null, this)) {
    return;
  }
  var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr('action'));
  var formData = $(this).serialize();
  ApiLibrary.postCall(clickUrl, null, formData, (data: any) => {
    settings.afterResponse(clickedItem, data);
  });
};

jQuery.fn.onSubmitUseAjax = function (options?: IAjaxCallOptions) {
  var settings = checkOptions(options);
  var form = this;

  $(form)
    .find("[type='submit']")
    .click(function () {
      $("[type='submit']", $(this).parents('form')).removeAttr('clicked');
      $(this).attr('clicked', 'true');
    });

  $(form).submit(function (evt) {
    evt.preventDefault();
    var clickedItem = $(this).find('[type=submit][clicked=true]');
    //var clickedItem = this;

    if (settings.beforeCall(clickedItem, this)) {
      return;
    }
    $(form).find("input[type='submit'],button[type='submit']").disable(true);
    var clickUrl = ApiLibrary.addFormatToUrl($(form).attr('action'));
    $(this).append("<input type='hidden' name='" + clickedItem.attr('name') + "' value='" + clickedItem.val() + "'/>");
    var formData = $(this).serialize();

    ApiLibrary.postCall(clickUrl, null, formData, (data: any) => {
      settings.afterResponse(clickedItem, data);
      $(form).find("input[type='submit'],button[type='submit']").disable(false);
    });
  });
};

jQuery.fn.onClickAjaxGet = function (options?: IAjaxCallOptions) {
  var settings = checkOptions(options);
  var item = this;
  $(item).click(function (evt) {
    if (!evt.isDefaultPrevented()) {
      evt.preventDefault();
      var clickedItem = this;
      if (settings.beforeCall(clickedItem, null)) {
        return;
      }
      var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr('href'));
      ApiLibrary.getCall(clickUrl, null, (data: any) => {
        settings.afterResponse(clickedItem, data);
      });
    }
  });
};

jQuery.fn.onClickAjaxPost = function (options?: IAjaxCallOptions) {
  var settings = checkOptions(options);
  var item = this;
  $(item).click(function (evt) {
    if (!evt.isDefaultPrevented()) {
      evt.preventDefault();
      var clickedItem = this;
      if (settings.beforeCall(clickedItem, this)) {
        return;
      }
      var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr('href'));
      ApiLibrary.postCall(clickUrl, null, null, (data: any) => {
        settings.afterResponse(this, data);
      });
    }
  });
};

jQuery.fn.onClickPostAsForm = function (options?: IAjaxCallOptions) {
  var settings = checkOptions(options);
  var item = this;
  $(item).click(function (evt) {
    if (!evt.isDefaultPrevented()) {
      evt.preventDefault();
      var clickedItem = this;
      if (settings.beforeCall(clickedItem, this)) {
        return;
      }
      var clickUrl = $(clickedItem).attr('href');
      //ApiLibrary.addFormatToUrl($(clickedItem).attr("href"));
      var doc: string = "<form action='" + clickUrl + "' method='post'></form>";

      var form: JQuery = $(doc).appendTo(document.body);
      $(form).submit();
    }
  });
};

//}
