export class EnumEx {
    static getNamesAndValues<T extends number>(e: any) {
        const nms = EnumEx.getNames(e);
        const mpped = nms.map(n => ({ name: n, value: e[n] as T }));


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