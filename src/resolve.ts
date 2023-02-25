
// tslint:disable-next-line:no-var-keyword
var System:any = System || {};

(function () {
    const endsWithFileExtension = /\/?\.[a-zA-Z]{2,}$/;
    const originalResolve = System.constructor.prototype.resolve;

    // tslint:disable-next-line:only-arrow-functions
    System.constructor.prototype.resolve = function () {
      this.test = "";
      // apply original resolve to make sure importmaps are resolved first
      const url = originalResolve.apply(this, arguments);
      // append .js file extension if url is missing a file extension
      return endsWithFileExtension.test(url) ? url : url + ".js";
    };
  })();