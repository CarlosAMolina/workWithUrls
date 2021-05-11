/* Get Lazy Loading time value at the storage.
:param: no param.
:return: int.
*/
async function getStorageLazyLoading(){
  let lazyLoadingTime = 0;
  let resultGetStorage = {};
  try {
    resultGetStorage = await browser.storage.local.get('idLazyLoadingTime');
  } catch(e) {
    console.error(e)
  }
  if ( (typeof resultGetStorage.idLazyLoadingTime == 'undefined') ){
    console.log('Not previous stored lazy loading time value stored');
  } else{
    lazyLoadingTime = resultGetStorage.idLazyLoadingTime;
  }
  console.log(`Lazy loading time to use: ${lazyLoadingTime}`);
  return lazyLoadingTime;
}

/*Save Lazy Loading wait time.
:param lazyLoadingTimeToSave: int, milliseconds.
:return true: bool, function done correctly.
*/
function setStorageLazyLoading(lazyLoadingTimeToSave){
  console.log(`Saving loading time: '${lazyLoadingTimeToSave}'`);
  var storingInfo = browser.storage.local.set({['idLazyLoadingTime']:lazyLoadingTimeToSave});
  storingInfo.then(() => {
  }, console.error);
  return true;
}


export {
  getStorageLazyLoading,
  setStorageLazyLoading
};
