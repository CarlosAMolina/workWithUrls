import * as ModuleDom from './dom.js';



/*
param urlsModifier: module urlsModifier class urlsModifier instance.
*/
function modifyText(urlsModifier){
  let urls = ModuleDom.getValueElementById('inputUrls').split('\n');
  urls = urlsModifier.modifyUrls(urls).join('\n');
  ModuleDom.setValueToElementById(urls, 'inputUrls');
}

export {
  modifyText,
};
