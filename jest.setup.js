/*
import $ from 'jquery';

export {}


declare module globalThis {
    var $: JQueryStatic;
}


globalThis.$ = $;

// If you want to mock bootstrap
globalThis.$.fn.modal = jest.fn(() => $());
globalThis.$.fn.carousel = jest.fn(() => $());
globalThis.$.fn.tooltip = jest.fn(() => $());



global.window = window
//global.$ = require('jquery');
*/

//import $ from 'jquery';
global.$ = null; //typeof import('jquery');;
global.jQuery = global.$;

//global.$.fn = {};

//global.$.fn.modal = jest.fn(() => $());
//global.$.fn.carousel = jest.fn(() => $());
//global.$.fn.tooltip = jest.fn(() => $());
//global.$.extend = jest.fn(() => $());