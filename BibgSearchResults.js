// ==UserScript==
// @name         Bing Search
// @namespace    srazzano
// @version      1.0.1
// @description  Bing Wallpaper
// @author       Sonny Razzano aka srazzano
// @include      https://www.bing.com/search*
// @icon         https://raw.githubusercontent.com/srazzano/Images/master/bing64.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {

  'use strict';

  const githubSite = 'https://raw.githubusercontent.com/srazzano/Images/master/image',
        soncoSite = 'https://sonco.synthasite.com/resources/image',
        wallpaperImageText = 'Wallpaper image',
        changeWallpaperTooltip = 'Change Wallpaper',
        changeImageSiteText = 'Image Host Site:',
        buttonSitesTooltip = 'Change between GitHub and Sonco host sites',
        downButton = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAuklEQVR42mNkoAFgHDWUPob+BwJGICCkGZc6XIamAamZ+AwGGQik0oFKZhFrKEj8LRALYjMYauB7IBYGSv8nOkyB+jyA1HawIiSDoQaCgCdQeAfRYYpkwBkgZQwzGMnAs0CuCS59hAzVB1JzYQbDDATiZKChF8kyFGrwSiAVhiS0CmhgOD49xBgqCaSuArEgAyRytIGGPqfIUKjB7UCqAog7gAZWElJPdI4CGrwfaKAjMWqHeN4fOYYCALmCRxW5rmXrAAAAAElFTkSuQmCC',
        upButton = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAsElEQVR42mNkoAFgHDV04Az9////fkZGRkeqGQo0sB1IVQBxB9DgSooNBRooCaSuArEgEL8HYm2gwc8pNXQlkApDEloFNDScbEOBBuoDqblAbIwkfBaIk4EGXyTX0DMwA4GGMAL5/2EGA7kmJBsK1O8BpLbDDEQShxnsCRTeQbShQH0g8bdALIhsIJrBoEgTBnmAWEPTgNRMbAaiGZwOVDKLWEP/4zOQkLphmPeHp6EA2JNHFW0nieAAAAAASUVORK5CYII=',
        headerMenus = $q('#id_h'),
        divThemer = $c('div', {id: 'themerDiv'}),
        btnThemer = $c('button', {id: 'buttonThemer', innerHTML: wallpaperImageText, title: changeWallpaperTooltip, onclick: e => wallpaperButtonChanger(e)}),
        inpThemer = $c('input', {id: 'inputThemer', type: 'number', min: 0, max: 35, value: GM_getValue('wallpaperImage'), oninput: e => wallpaperInputChanger(e)}),
        btnUp = $c('input', {id: 'buttonUp', type: 'image', src: upButton, title: '', onclick: e => wallpaperButtonChanger(e)}),
        btnDown = $c('input', {id: 'buttonDown', type: 'image', src: downButton, title: '', onclick: e => wallpaperButtonChanger(e)}),
        divSites = $c('div', {id: 'divSites'}),
        spnSites = $c('button', {id: 'spanSites', title: buttonSitesTooltip, onclick: () => wallpaperSite()}),
        btnSites = $c('button', {id: 'buttonSites', title: buttonSitesTooltip, onclick: () => wallpaperSite()});

  function $c(type, props) {
    let node = document.createElement(type);
    if (props && typeof props == 'object') for (let prop in props) typeof node[prop] == 'undefined' ? node.setAttribute(prop, props[prop]) : node[prop] = props[prop];
    return node;
  }

  function $q(el, all) {
    if (all) return document.querySelectorAll(el);
    return document.querySelector(el);
  }

  function wallpaper(e) {
    if (e === 0) {
      GM_addStyle(''+
        'body {'+
        '  background: #333 !important;'+
        '}'+
      '');
    } else {
      GM_addStyle(''+
        'body {'+
        '  background: url('+ GM_getValue('imageSite') + e +'.jpg) no-repeat center center fixed !important;'+
        '}'+
      '');
  } }

  function onClose() {
    window.removeEventListener('unload', () => onClose());
  }

  function wallpaperButtonChanger(e) {
    let num = GM_getValue('wallpaperImage');
    switch (e.target.id) {
      case 'buttonThemer': case 'buttonUp':
        num > 34 ? num = 0 : num = parseInt(num + 1);
        break;
      case 'buttonDown':
        num < 1 ? num = 35 : num = parseInt(num - 1);
        break;
    }
    inpThemer.value = num;
    GM_setValue('wallpaperImage', parseInt(num));
    wallpaper(num);
  }

  function wallpaperInputChanger(e) {
    let inp = e.target.value;
    GM_setValue('wallpaperImage', parseInt(inp));
    wallpaper(inp);
  }

  function wallpaperSite() {
    let num = GM_getValue('wallpaperImage'),
        str = GM_getValue('imageSite');
    if (str === githubSite) {
      GM_setValue('imageSite', soncoSite);
      btnSites.innerHTML = 'Sonco';
    } else {
      GM_setValue('imageSite', githubSite);
      btnSites.innerHTML = 'GitHub';
    }
    wallpaper(num);
  }

  if (!GM_getValue('imageSite')) GM_setValue('imageSite', githubSite);
  if (!GM_getValue('wallpaperImage')) GM_setValue('wallpaperImage', 0);

  divThemer.appendChild(btnThemer);
  divThemer.appendChild(inpThemer);
  divThemer.appendChild(btnUp);
  divThemer.appendChild(btnDown);
  divSites.appendChild(spnSites);
  divSites.appendChild(btnSites);
  headerMenus.insertBefore(divThemer, headerMenus.firstChild);
  headerMenus.insertBefore(divSites, headerMenus.firstChild);
  spnSites.innerHTML = changeImageSiteText;
  if (GM_getValue('imageSite') === githubSite) btnSites.innerHTML = 'GitHub';
  else btnSites.innerHTML = 'Sonco';

  window.addEventListener('unload', () => onClose());

  GM_addStyle('' +
    'body {'+
    '  background: url('+ GM_getValue('imageSite') + GM_getValue('wallpaperImage') +'.jpg) no-repeat center center fixed !important;'+
    '}'+
    'body #id_h {'+
    '  display: inline-flex !important;'+
    '}'+
    'body #b_header {'+
    '  border: none !important;'+
    '}'+
    'body #divSites {'+
    '  margin-right: 25px !important;'+
    '}'+
    'body #spanSites,'+
    'body #buttonSites {'+
    '  background-color: transparent !important;'+
    '  border: none !important;'+
    '  color: #FFF !important;'+
    '  cursor: pointer !important;'+
    '  opacity: .7 !important;'+
    '}'+
    'body #buttonSites {'+
    '  padding: 0 !important;'+
    '  width: 48px !important;'+
    '}'+
    'body #spanSites:hover,'+
    'body #buttonSites:hover {'+
    '  opacity: 1 !important;'+
    '}'+
    'body #themerDiv {'+
    '  color: #FFF !important;'+
    '  margin: -1px 16px 0 0 !important;'+
    '}'+
    'body #buttonThemer,'+
    'body #inputThemer {'+
    '  background-color: transparent !important;'+
    '  border: none !important;'+
    '  color: #FFF !important;'+
    '}'+
    'body #buttonThemer {'+
    '  cursor: pointer !important;'+
    '  opacity: .7 !important;'+
    '}'+
    'body #inputThemer {'+
    '  opacity: .7 !important;'+
    '  text-align: center !important;'+
    '  width: 28px !important;'+
    '}'+
    'body #buttonUp,'+
    'body #buttonDown {'+
    '  background-color: transparent !important;'+
    '  color: #FFF !important;'+
    '  opacity: .7 !important;'+
    '  cursor: pointer !important;'+
    '  position: relative !important;'+
    '  top: 6px !important;'+
    '}'+
    'body #buttonThemer:hover,'+
    'body #inputThemer:hover,'+
    'body #inputThemer:focus-within,'+
    'body #buttonUp:hover,'+
    'body #buttonDown:hover {'+
    '  opacity: 1 !important;'+
    '}'+
    'body #inputThemer::-webkit-inner-spin-button,'+
    'body #inputThemer::-webkit-outer-spin-button {'+
    '  display: none !important;'+
    '}'+
    'body #b_results,'+
    'body #b_context,'+
    'body #b_dynRail {'+
    '  background: rgba(0, 0, 0, .5) !important;'+
    '}'+
    'body #b_content li,'+
    'body #b_content a,'+
    'body #b_content div,'+
    'body #b_content h2 {'+
    '  background: none !important;'+
    '}'+
    'body #b_content p {'+
    '  color: #AAA !important;'+
    '}'+
    'body #b_dynRail {'+
    '  margin-left: 60px !important;'+
    '  padding: 0 10px !important;'+
    '}'+
    'body #b_dynRail div {'+
    '  border: none !important;'+
    '}'+
  '');

})();
