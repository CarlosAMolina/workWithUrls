import * as ModuleButtonsFactory from '../modules/buttons/buttonsFactory.js';
import * as ModuleDom from './dom.js';
import * as ModuleSleep from '../modules/sleep.js';
import * as ModuleStorageLazyLoading from '../modules/storage/lazyLoading.js';
import * as ModuleUrlsModifier from '../modules/urlsModifier.js';

/* Open URLs and its paths if option checked.
*/
async function openUrls(){
  const lazyLoadingTime = await ModuleStorageLazyLoading.getStorageLazyLoading();
  // Get URLs at the input box.
  let urls = ModuleDom.getValueElementById('inputUrls').split('\n');
  console.log(`URLs at the input box: ${urls}`)
  if (ModuleButtonsFactory.getButton("buttonOpenPaths").isOn){
    urls = ModuleUrlsModifier.getUrlsWithPaths(urls);
  }
  // Open URLs.
  var urlsLength = urls.length;
  for (var i = 0; i < urlsLength; i++) { 
    var url = urls[i];
    console.log(`Init url ${i+1}/${urlsLength}: '${url}'`);
    // Check if an empty string was provided.
    // It can have the protocol, example added by the 
    // getUrlsWithPaths function.
    if (url == '' || url == ModuleUrlsModifier.PROTOCOL_DEFAULT){
      console.log('Not URL provided. Omitting');
    } else {
      url = ModuleUrlsModifier.getUrlWithProtocol(url);
      // Only wait between URLs.
      if (i != 0){
        console.log(`Init. Wait milliseconds: ${lazyLoadingTime}`);
        await ModuleSleep.sleepMs(lazyLoadingTime);
        console.log(`Done. Wait milliseconds: ${lazyLoadingTime}`);
      }
      console.log(url);
      _openUrl(url);
    }
  }
}


/* Open an url and catches possible exception.
https://developer.mozilla.org/en-US/docs/Web/API/Window/open
:param url: str, url to check.
:return null.
*/
function _openUrl(url){
  try{
    const windowObjectReference = window.open(url);
    console.log(`Done open url '${url}'. Window object reference:`);
    console.log(windowObjectReference);
  }
  catch(error){
    console.error(error);
  }
}


export {
  openUrls,
};
