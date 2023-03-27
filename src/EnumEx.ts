export class EnumEx {
    static getNamesAndValues<T extends number>(e: any) {
        var nms = EnumEx.getNames(e);
        var mpped = nms.map(n => ({ name: n, value: e[n] as T }));

        var a = 1;

        return mpped;
    }

  static getNames(e: any): string[] {
        return EnumEx.getObjValues(e).filter(v => typeof v === "string") as string[];
    }

    static getValues<T extends number>(e: any):T[] {
        return EnumEx.getObjValues(e).filter(v => typeof v === "number") as T[];
    }

    private static getObjValues(e: any): (number | string)[] {
        return Object.keys(e).map(k => e[k]);
    }
}