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
  console.log('Lazy loading time to use: ' + lazyLoadingTime);
  return lazyLoadingTime;
}


export {
  getStorageLazyLoading
};
