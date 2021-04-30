import chai from 'chai';

import * as ModuleStorageLazyLoading from '../popup/modules/storage/lazyLoading.js';

function mockBrowserStorageLocal(){
  global.browser = {};
  browser.storage = {};
  browser.storage.local = storageMock();
}

// Storage Mock
// https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests
function storageMock() {
  return {
    get: function(key) {
      return new Promise(function(resolve, reject) {
        resolve(new Object({ idLazyLoadingTime: 3000 }))
      });
    }
  };
}

describe("Check script storage/lazyLoading.js: ", function() {
  beforeEach(function() {
    mockBrowserStorageLocal();
  });
  describe("Check function getStorageLazyLoading: ", function() {
    it("Check expected result: ", async function() {
      const result = await ModuleStorageLazyLoading.getStorageLazyLoading();
      chai.expect(result).to.equal(3000);
    });
  });
});

