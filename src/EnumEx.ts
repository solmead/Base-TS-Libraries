export class EnumEx {
  static getNamesAndValues<T extends number>(e: any) {
    const nms = EnumEx.getNames(e);
    const mpped = nms.map((n) => ({ name: n, value: e[n] as T }));

    return mpped;
  }

  static getNames(e: any): Array<string> {
    return EnumEx.getObjValues(e).filter((v) => typeof v === 'string') as Array<string>;
  }

  static getValues<T extends number>(e: any): Array<T> {
    return EnumEx.getObjValues(e).filter((v) => typeof v === 'number') as Array<T>;
  }

  private static getObjValues(e: any): Array<number | string> {
    return Object.keys(e).map((k) => e[k]);
  }
}
