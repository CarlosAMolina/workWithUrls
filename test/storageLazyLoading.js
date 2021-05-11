import chai from 'chai';

import * as ModuleStorageLazyLoading from '../popup/modules/storage/lazyLoading.js';

function mockBrowserStorageLocalGet(){
  global.browser = {};
  browser.storage = {};
  browser.storage.local = storageMockGet();
}

// Storage Mock
// https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests
function storageMockGet() {
  return {
    get: function(key) {
      return new Promise(function(resolve, reject) {
        resolve(new Object({ idLazyLoadingTime: 3000 }))
      });
    }
  };
}

function mockBrowserStorageLocalSet(){
  global.browser = {};
  browser.storage = {};
  browser.storage.local = storageMockSet();
}

function storageMockSet() {
  return {
    set: function(infoToStore) {
      return new Promise(function(resolve, reject) {
        for (let [key, value] of Object.entries(infoToStore)) {
          browser.storage[key] = value || ''
        }
        return resolve('done');
      });
    }
  };
}

describe("Check script storage/lazyLoading.js: ", function() {
  describe("Check function getStorageLazyLoading: ", function() {
    beforeEach(function() {
      mockBrowserStorageLocalGet();
    });
    it("Check expected result: ", async function() {
      const result = await ModuleStorageLazyLoading.getStorageLazyLoading();
      chai.expect(result).to.equal(3000);
    });
  });
  describe("Check function setStorageLazyLoading: ", function() {
    beforeEach(function() {
      mockBrowserStorageLocalSet();
    });
    it("Check expected result: ", async function() {
      await ModuleStorageLazyLoading.setStorageLazyLoading(1000);
      chai.expect(browser.storage['idLazyLoadingTime']).to.equal(1000);
    });
  });

});

