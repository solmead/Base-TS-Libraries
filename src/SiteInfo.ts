import * as DateTime from './DateTime';
import { Queryable } from './LinqToJs';

export class SiteInfo {
  public sitepath: string = '/';
  public virtualUrl: string = '';
  public applicationUrl: string = '';
  public isCleanHtml: boolean = false;

  public constructor() {
    if (document) {
      const scripts = document.getElementsByTagName('script');
      const lastScript = scripts[scripts.length - 1];
      const scriptName = lastScript?.src ?? '';

      const subDirs = new Queryable<string>(['/JS/', '/BUNDLES/']);

      const indexs = subDirs
        .select((d) => {
          return scriptName.toUpperCase().indexOf(d);
        })
        .where((i) => i > 0);

      if (indexs.any()) {
        const minIdx = indexs.min();
        this.sitepath = scriptName.substring(0, minIdx) + '/';
      }

      const base = window.location.protocol + '//' + window.location.host + '/';
      this.virtualUrl = this.sitepath.replace(base, '');
      this.applicationUrl = base;
      const t = window.location.pathname + window.location.search;

      this.isCleanHtml = t.indexOf('Format=CleanHTML') > -1;
    }
  }

  getParameterByName = (name: string): string => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
}

export let siteInfo: SiteInfo = new SiteInfo();

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
  let cntPiece = 'Cnt=' + DateTime.getTimeCount();
  if (url.indexOf('?') !== -1) {
    cntPiece = '&' + cntPiece;
  } else {
    cntPiece = '?' + cntPiece;
  }
  return fixDoubleSlash(applicationUrl() + url + cntPiece);
}

export function redirect(url: string) {
  window.location.href = url;
}
