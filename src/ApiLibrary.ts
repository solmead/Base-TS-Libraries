import * as DateTime from './DateTime';
import * as SiteInfo from './SiteInfo';
import * as Debug from './Debug';
import { toDates } from './ts-transformer-dates'

export enum callTypes {
  GET,
  PUT,
  POST,
}

export interface IApiCallError {
  textStatus: string;
  errorThrown: string;
  responseText: string;
  responseObj: any;
}

export function addDataToUrl(url: string, name: string, value: string): string {
  if (url.indexOf(name + '=') >= 0) {
    url = url.replace(name + '=', name + 'Old=');
  }

  if (url.indexOf('?') >= 0) {
    url = url + '&' + name + '=' + value;
  } else {
    url = url + '?' + name + '=' + value;
  }

  return url;
}
export function addFormatToUrl(url: string): string {
  return addDataToUrl(url, 'Format', 'JSON');
}

export function addAntiForgeryToken(data: any) {
  return data;
}

export function apiCall(
  type: callTypes,
  url: string,
  sendData: any,
  successCallback?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any,
  errorCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any,
  beforeSend?: (jqXHR: JQueryXHR) => any,
): void {
  let cntPiece = 'Cnt=' + DateTime.getTimeCount();
  if (url.indexOf('?') !== -1) {
    cntPiece = '&' + cntPiece;
  } else {
    cntPiece = '?' + cntPiece;
  }
  let fUrl = url + cntPiece;
  if (url.indexOf('://') <= 0) {
    if (url.indexOf(SiteInfo.virtualUrl()) === 0) {
      url = url.replace(SiteInfo.virtualUrl(), '');
    }
    if (url.lastIndexOf('/', 0) === 0) {
      url = url.substring(1);
    }
    if (url.indexOf(SiteInfo.virtualUrl()) === 0) {
      url = url.replace(SiteInfo.virtualUrl(), '');
    }
    fUrl = SiteInfo.getVirtualURL(url) + cntPiece;
  }

  fUrl = fUrl.replaceAll('//', '/').replaceAll(':/', '://');

  let pd = true;
  let sd = sendData;
  let contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
  if (sendData instanceof Blob) {
    contentType = 'application/octet-stream';
    pd = false;
  } else if (typeof sendData === 'object') {
    contentType = 'application/json; charset=utf-8';
    sd = JSON.stringify(sendData);
  }
  if ($) {
    $.ajax({
      url: fUrl,
      processData: pd,
      beforeSend: (request: JQueryXHR) => {
        if (beforeSend) {
          beforeSend(request);
        }
      },
      type: callTypes[type],
      data: sd,
      dataType: 'json',
      contentType,
      success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
        if (successCallback) {
          if (typeof data === "object") {
            data = toDates(data);
          }
          successCallback(data, textStatus, jqXHR);
        }
      },
      error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
        if (errorCallback) {
          errorCallback(jqXHR, textStatus, errorThrown);
        }
      },
    });
  }
}

export function getCallAsync<TT>(url: string, seqNum?: number, sendData: any = null): Promise<TT> {
  return new Promise<TT>((resolve, reject) => {
    getCall(
      url,
      seqNum,
      sendData,
      (data: TT, seq?: number) => {
        resolve(data);
      },
      (jqXHR: JQueryXHR, extStatus: string, errorThrown: string) => {
        reject(Error(jqXHR, extStatus, errorThrown));
      },
    );
  });
}

export function putCallAsync<TT>(url: string, seqNum?: number, sendData?: any): Promise<TT> {
  return new Promise<TT>((resolve, reject) => {
    putCall(
      url,
      seqNum,
      sendData,
      (data: TT, seq?: number) => {
        resolve(data);
      },
      (jqXHR: JQueryXHR, extStatus: string, errorThrown: string) => {
        reject(Error(jqXHR, extStatus, errorThrown));
      },
    );
  });
}
export function postCallAsync<TT>(url: string, seqNum?: number, sendData?: any): Promise<TT> {
  return new Promise<TT>((resolve, reject) => {
    postCall(
      url,
      seqNum,
      sendData,
      (data: TT, seq?: number) => {
        resolve(data);
      },
      (jqXHR: JQueryXHR, extStatus: string, errorThrown: string) => {
        reject(Error(jqXHR, extStatus, errorThrown));
      },
    );
  });
}

export function getCall(
  url: string,
  seqNum?: number,
  sendData?: any,
  successCallback?: (data: any, seq?: number) => any,
  errorCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any,
): void {
  if (!seqNum) {
    seqNum = DateTime.getTimeCount();
  }
  apiCall(
    callTypes.GET,
    url,
    sendData,
    (data, textStatus, request) => {
      const seq = parseInt(request.getResponseHeader('seq'), 10);
      if (successCallback) {
        successCallback(data, seq);
      }
    },
    errorCallback,
    (request) => {
      request.setRequestHeader('seq', '' + seqNum);
    },
  );
}

export function putCall(
  url: string,
  seqNum?: number,
  sendData?: any,
  successCallback?: (data: any, seq?: number) => any,
  errorCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any,
) {
  if (!seqNum) {
    seqNum = DateTime.getTimeCount();
  }
  sendData = sendData || {};
  addAntiForgeryToken(sendData);

  apiCall(
    callTypes.PUT,
    url,
    sendData,
    (data, textStatus, request) => {
      const seq: number = parseInt(request.getResponseHeader('seq'), 10);

      if (successCallback) {
        successCallback(data, seq);
      }
    },
    errorCallback,
    (request) => {
      request.setRequestHeader('seq', '' + seqNum);
    },
  );
}

export function postCall(
  url: string,
  seqNum?: number,
  sendData?: any,
  successCallback?: (data: any, seq?: number) => any,
  errorCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any,
) {
  if (!seqNum) {
    seqNum = DateTime.getTimeCount();
  }
  sendData = sendData || {};
  addAntiForgeryToken(sendData);

  apiCall(
    callTypes.POST,
    url,
    sendData,
    (data, textStatus, request) => {
      const seq = parseInt(request.getResponseHeader('seq'), 10);
      if (successCallback) {
        successCallback(data, seq);
      }
    },
    errorCallback,
    (request) => {
      request.setRequestHeader('seq', '' + seqNum);
    },
  );
}

function Error(jqXHR: JQueryXHR, textStatus: string, errorThrown: string): IApiCallError {
  Debug.debugWrite(errorThrown);

  const err = {} as IApiCallError;

  err.errorThrown = errorThrown;
  err.textStatus = textStatus;
  err.responseText = jqXHR.responseText;
  err.responseObj = jqXHR.responseJSON;

  return err;
}
