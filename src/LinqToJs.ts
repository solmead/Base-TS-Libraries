﻿declare global {
  interface Array<T> {
    asQueryable(): Queryable<T>;
    remove(item: T): void;
  }

  interface IEnumerable<T> extends Array<T> {}

  interface IList<T> extends Array<T> {}
  interface List<T> extends Array<T> {}
  interface Dictionary<T1, T2> extends Object {}
}

export class Queryable<T> {
  constructor(private array?: Array<any>) {
    if (this.array == null) {
      this.array = new Array<T>();
    }
  }

  private equals(x: any, y: any): boolean {
    if (x === y) return true;
    // if both x and y are null or undefined and exactly the same

    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    // if they are not strictly equal, they both need to be Objects

    if (x.constructor !== y.constructor) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

    for (const p in x) {
      if (!x.hasOwnProperty(p)) continue;
      // other properties were tested using x.constructor === y.constructor

      if (!y.hasOwnProperty(p)) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

      if (x[p] === y[p]) continue;
      // if they have the same strict value or identity then they are equal

      if (typeof x[p] !== 'object') return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

      if (!this.equals(x[p], y[p])) return false;
      // Objects and Arrays must be tested recursively
    }

    for (const p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
      // allows x[ p ] to be set to undefined
    }
    return true;
  }

  add = (item: T): void => {
    this.array.push(item);
  };

  remove = (item: T): void => {
    this.array.remove(item);
  };

  push = (item: T): void => {
    this.array.push(item);
  };

  toArray = (): Array<T> => {
    return this.array.slice(0);
  };

  get length(): number {
    return this.array.length;
  }
  get count(): number {
    return this.array.length;
  }

  distinct = (compareFunction?: (obj1: T, obj2: T) => boolean): Queryable<T> => {
    const lst = new Queryable<T>();
    this.forEach((t) => {
      if (!lst.contains(t, compareFunction)) {
        lst.add(t);
      }
    });

    return lst;
  };

  where = (whereClause: (obj: T) => boolean): Queryable<T> => {
    if (!whereClause) {
      return new Queryable<T>(this.array.slice(0));
    }
    const lst2: Array<any> = [];
    this.array.forEach((item) => {
      if (whereClause(item)) {
        lst2.push(item);
      }
    });
    return new Queryable<T>(lst2);
  };

  any = (whereClause?: (obj: T) => boolean): boolean => {
    if (!whereClause) {
      return this.array.length > 0;
    }
    return this.where(whereClause).any();
  };

  forEach = (func: (obj: T) => any): boolean => {
    const list = this.array;
    if (func == null) {
      return false;
    }
    $.each(list, (i: number, item: T) => {
      func(item);
    });
    return true;
  };

  sum = (func?: (obj: T) => number): number => {
    if (!func) {
      func = (obj: T): number => {
        return obj as number;
      };
    }
    let cnt: number = 0;
    this.forEach((item) => {
      cnt = cnt + func(item);
    });
    return cnt;
  };
  max = (func?: (obj: T) => number): number => {
    if (!func) {
      func = (obj: T): number => {
        return obj as number;
      };
    }
    let mx: number = func(this.first());
    this.forEach((item) => {
      const v: number = func(item);
      if (mx < v) {
        mx = v;
      }
    });
    return mx;
  };
  min = (func?: (obj: T) => number): number => {
    if (!func) {
      func = (obj: T): number => {
        return obj as number;
      };
    }
    let mx: number = func(this.first());
    this.forEach((item) => {
      const v: number = func(item);
      if (mx > v) {
        mx = v;
      }
    });
    return mx;
  };

  select = <T2>(selectItem: (obj: T) => T2): Queryable<T2> => {
    if (selectItem == null) {
      return new Queryable<T2>(this.array.slice(0));
    }
    return new Queryable<T2>(this.array.map(selectItem));
  };

  orderBy = (orderBy: (obj: T) => any, isDescending = false): Queryable<T> => {
    return this.orderByFunction((ob1, ob2) => {
      const v1 = orderBy(ob1);
      const v2 = orderBy(ob2);
      if (v1 > v2) {
        return 1;
      }
      if (v1 < v2) {
        return -1;
      }
      return 0;
    }, isDescending);
  };

  orderByFunction = (orderBy?: (obj1: T, obj2: T) => number, isDescending = false): Queryable<T> => {
    isDescending = !!isDescending;
    if (orderBy == null) {
      return new Queryable<T>(this.array.slice(0));
    }
    let clone = this.array.slice(0);
    clone.sort(orderBy);
    if (isDescending) {
      clone = clone.reverse();
    }
    return new Queryable<T>(clone);
  };

  reverse = (): Queryable<T> => {
    return new Queryable<T>(this.array.reverse());
  };

  skip = (count: number): Queryable<T> => {
    if (this.length < count) {
      return new Queryable<T>([]);
    }
    this.array.splice(0, count);
    return new Queryable<T>(this.array.slice(0));
  };

  take = (count: number): Queryable<T> => {
    if (this.length === 0) {
      return new Queryable<T>([]);
    }
    if (count > this.length) {
      count = this.length;
    }
    this.array.splice(count - 1, this.length - count);
    return new Queryable<T>(this.array.slice(0));
  };

  first = (): T => {
    if (this.length === 0) {
      return null;
    }
    return this.array[0];
  };
  last = (): T => {
    if (this.length === 0) {
      return null;
    }
    return this.array[this.length - 1];
  };

  findItem = (selectItem: (obj: T) => boolean): T => {
    return this.where(selectItem).first();
  };

  find = (selectItem: (obj: T) => boolean): T => {
    return this.where(selectItem).first();
  };

  contains = (item: T, compareFunction?: (obj1: T, obj2: T) => boolean): boolean => {
    if (!compareFunction) {
      compareFunction = this.equals;
    }
    return this.where((item2: any) => compareFunction(item, item2)).any();
  };

  union = (arr: Array<T> | Queryable<T>): Queryable<T> => {
    if (arr instanceof Queryable) {
      return new Queryable<T>(this.array.concat((arr as Queryable<T>).toArray()));
    } else {
      return new Queryable<T>(this.array.concat(arr));
    }
  };

  intersect = (arr: Array<T> | Queryable<T>, compareFunction?: (obj1: T, obj2: T) => boolean): Queryable<T> => {
    if (!compareFunction) {
      compareFunction = this.equals;
    }
    let q: Queryable<T> = null;
    if (arr instanceof Queryable) {
      q = arr as Queryable<T>;
    } else {
      q = new Queryable<T>(this.array.concat(arr));
    }
    const lst2: Array<any> = [];
    this.forEach((item: any) => {
      if (q.contains(item, compareFunction)) {
        lst2.push(item);
      }
    });
    return new Queryable<T>(lst2);
  };

  difference = (arr: Array<T> | Queryable<T>, compareFunction?: (obj1: T, obj2: T) => boolean): Queryable<T> => {
    if (!compareFunction) {
      compareFunction = this.equals;
    }
    let q: Queryable<T> = null;
    if (arr instanceof Queryable) {
      q = arr as Queryable<T>;
    } else {
      q = new Queryable<T>(this.array.concat(arr));
    }
    const lst2: Array<any> = [];
    this.forEach((item: any) => {
      if (!q.contains(item, compareFunction)) {
        lst2.push(item);
      }
    });
    return new Queryable<T>(lst2);
  };

  copy = (): Queryable<T> => {
    return new Queryable<T>(this.array.slice(0));
  };
  asQueryable = (): Queryable<T> => {
    return new Queryable<T>(this.array.slice(0));
  };
  indexOf = (item: T): number => {
    return this.array.indexOf(item);
  };
}

Array.prototype.asQueryable = function (): Queryable<any> {
  return new Queryable<any>(this);
};
Array.prototype.remove = function (item: any): void {
  const index = this.indexOf(item);
  if (index > -1) {
    this.splice(index, 1);
  }
};
