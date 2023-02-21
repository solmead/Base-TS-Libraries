import * as DateTime from './DateTime';
import { Queryable } from './LinqToJs';

//module SiteInfo {

export class SiteInfo {
  public sitepath: string = '/';
  public virtualUrl: string = '';
  public applicationUrl: string = '';
  public isCleanHtml: boolean = false;

  public constructor() {
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length - 1];
    var scriptName = lastScript.src;

    var subDirs = new Queryable<string>(['/JS/', '/BUNDLES/']);

    var indexs = subDirs
      .select((d) => {
        return scriptName.toUpperCase().indexOf(d);
      })
      .where((i) => i > 0);

    if (indexs.any()) {
      var minIdx = indexs.min();
      this.sitepath = scriptName.substring(0, minIdx) + '/';
    }

    var base = window.location.protocol + '//' + window.location.host + '/';
    this.virtualUrl = this.sitepath.replace(base, '');
    this.applicationUrl = base;
    var t = window.location.pathname + window.location.search;

    this.isCleanHtml = t.indexOf('Format=CleanHTML') > -1;
  }

  getParameterByName = (name: string): string => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
}

export var siteInfo: SiteInfo = new SiteInfo();

function fixDoubleSlash(path: string): string {
  path = path.replaceAll('//', '/');
  path = path.replaceAll(':/', '://');
  return path;
}

export function virtualUrl(): string {
  return siteInfo.virtualUrl;
}
export function applicationUrl(): string {
  return siteInfo.applicationUrl;
}
export function isCleanHtml(): boolean {
  return siteInfo.isCleanHtml;
}

export function refreshPage() {
  redirect(getFullURL(window.location.pathname + window.location.search));
}

export function getParameterByName(name: string): string {
  return siteInfo.getParameterByName(name);
}

export function getVirtualURL(url: string): string {
  return fixDoubleSlash(applicationUrl() + virtualUrl() + url);
}

export function getFullURL(url: string): string {
  var cntPiece = 'Cnt=' + DateTime.getTimeCount();
  if (url.indexOf('?') != -1) {
    cntPiece = '&' + cntPiece;
  } else {
    cntPiece = '?' + cntPiece;
  }
  return fixDoubleSlash(applicationUrl() + url + cntPiece);
}

export function redirect(url: string) {
  window.location.href = url;
}

//}
