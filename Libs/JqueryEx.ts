
import * as ApiLibrary from './ApiLibrary'


declare global {
    interface JQueryStatic {
        disable(state: boolean);
        simulate(event?: string, options?: any): void;
        replaceTag(item: JQuery | string, newTagObj: JQuery | string, keepProps: boolean): any;
        replaceTag(newTagObj: JQuery | string, keepProps: boolean): any;
    }

    interface JQuery {
        submitUsingAjax(options?: IAjaxCallOptions): void;
        onSubmitUseAjax(options?: IAjaxCallOptions): void;
        onClickAjaxGet(options?: IAjaxCallOptions): void;
        onClickAjaxPost(options?: IAjaxCallOptions): void;
        onClickPostAsForm(options?: IAjaxCallOptions): void;
        disable(state: boolean);
        simulate(event?: string, options?: any): void;
        replaceTag(item: JQuery | string, newTagObj: JQuery | string, keepProps: boolean): any;
        replaceTag(newTagObj: JQuery | string, keepProps: boolean): any;

    }
}

//module JqueryEx {

    export interface IAjaxCallOptions {
        beforeCall: (item: JQuery, form: JQuery) => boolean;
        afterResponse?: (item: JQuery, data: any) => any;
    }
    export function createAjaxOptions(beforeCall: (item: JQuery, form: JQuery) => boolean,
        afterResponse?: (form: JQuery, data: any) => any): IAjaxCallOptions {
        return {
            beforeCall: beforeCall,
            afterResponse: afterResponse
        };
    }

    function checkOptions(options?: IAjaxCallOptions): IAjaxCallOptions {
        var defaults: IAjaxCallOptions = {
            beforeCall: null,
            afterResponse: null
        };
        var settings = $.extend({}, defaults, options) as IAjaxCallOptions;

        if (!settings.beforeCall) {
            settings.beforeCall = (item: JQuery): boolean => {
                return false;
            };
        }
        if (!settings.afterResponse) {
            settings.afterResponse = (item: JQuery, data: any): any => {
                return;
            };
        }

        return settings;
    }

    $.extend({
        replaceTag: function (currentElem, newTagObj, keepProps) {
            var $currentElem = $(currentElem);
            var i, $newTag = $(newTagObj).clone();
            if (keepProps) {//{{{
                //var newTag = $newTag[0];
                //newTag.className = currentElem.className;
                //$.extend(newTag.classList, currentElem.classList);
                $.each(currentElem.attributes, function (index, it) {
                    $newTag.attr(it.name, it.value);
                });
                //$.extend(newTag.attributes, currentElem.attributes);
            }//}}}
            $currentElem.wrapAll($newTag);
            $currentElem.contents().unwrap();
            // return node; (Error spotted by Frank van Luijn)
            return this; // Suggested by ColeLawrence
        }
    });

    $.fn.extend({
        replaceTag: function (newTagObj, keepProps) {
            // "return" suggested by ColeLawrence
            return this.each(function () {
                jQuery.replaceTag(this, newTagObj, keepProps);
            });
        }
    });

    jQuery.fn.extend({
        disable: function (state: boolean) {
            var items = this;
            return items.each(function () {
                var $this = $(this);
                if ($this.is('input, button, textarea, select'))
                    this.disabled = state;
                else
                    $this.toggleClass('disabled', state);

                $(this).prop("disabled", state);

            });
        }
    });

    jQuery.fn.submitUsingAjax = function (options?: IAjaxCallOptions) {
        var settings = checkOptions(options);
        var form = this;
        var clickedItem = this;
        if (settings.beforeCall(null, this)) {
            return;
        }
        var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr("action"));
        var formData = $(this).serialize();
        ApiLibrary.postCall(clickUrl, null, formData, (data: any) => {
            settings.afterResponse(clickedItem, data);
        });
    }

    jQuery.fn.onSubmitUseAjax = function (options?: IAjaxCallOptions) {
        var settings = checkOptions(options);
        var form = this;

        $(form).find("[type='submit']").click(function () {
            $("[type='submit']", $(this).parents("form")).removeAttr("clicked");
            $(this).attr("clicked", "true");
        });

        $(form).submit(function (evt) {
            evt.preventDefault();
            var clickedItem = $(this).find("[type=submit][clicked=true]")
            //var clickedItem = this;

            if (settings.beforeCall(clickedItem, this)) {
                return;
            }
            $(form).find("input[type='submit'],button[type='submit']").disable(true);
            var clickUrl = ApiLibrary.addFormatToUrl($(form).attr("action"));
            $(this).append("<input type='hidden' name='" + clickedItem.attr('name') + "' value='" + clickedItem.val() + "'/>");
            var formData = $(this).serialize();

            ApiLibrary.postCall(clickUrl, null, formData, (data: any) => {
                settings.afterResponse(clickedItem, data);
                $(form).find("input[type='submit'],button[type='submit']").disable(false);
            });
        });
    }

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
                var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr("href"));
                ApiLibrary.getCall(clickUrl, null, (data: any) => {
                    settings.afterResponse(clickedItem, data);
                });
            }
        });
    }

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
                var clickUrl = ApiLibrary.addFormatToUrl($(clickedItem).attr("href"));
                ApiLibrary.postCall(clickUrl, null, null, (data: any) => {
                    settings.afterResponse(this, data);
                });
            }
        });
    }

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
                var clickUrl = $(clickedItem).attr("href");
                //ApiLibrary.addFormatToUrl($(clickedItem).attr("href"));
                var doc: string = "<form action='" + clickUrl + "' method='post'></form>";

                var form: JQuery = $(doc).appendTo(document.body);
                $(form).submit();
            }
        });
    }



//}