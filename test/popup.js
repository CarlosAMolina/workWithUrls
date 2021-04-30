import * as ModuleMockDom from './mockDom.js'; // Global mocks.
import * as ModulePopup from '../popup/popup.js';
import chai from 'chai';


function mockDomInputUrls(valueToMock){
  document.getElementById('inputUrls').value = valueToMock;
}

function mockBrowserStorageLocal(){
  global.browser = {};
  browser.storage = {};
  browser.storage.local = storageMock();
}

// Storage Mock
// https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests
function storageMock() {
  return {
    setItem: function(key, value) {
      browser.storage[key] = value || '';
    },
    get: function(key) {
      return new Promise(function(resolve, reject) {
        resolve('start of new Promise');
      });
    },
    removeItem: function(key) {
      delete browser.storage[key];
    },
    get length() {
      return Object.keys(browser.storage).length;
    },
    key: function(i) {
      const keys = Object.keys(browser.storage);
      return keys[i] || null;
    }
  };
}


describe("Check script popup.js: ", function() {
  const inputUrlsTest = 'test1.com\ntest2.com';
  const mockRuleTransformationValueOld = 'test'
  const mockRuleTransformationValueNew = 'changed'
  mockBrowserStorageLocal();
  describe("Check function popupMain: ", function() {
    ModulePopup.popupMain(); // Functon instance, required to access inner functions.
    describe("Check function getOpenPaths: ", function() {
      it("Check function runs without exceptions: ", function() {
        console.log("Not checked") // TODO
      });
    });
    describe("Check functions that modify document: ", function() {
      describe("Check function updateValue: ", function() {
        it("Check function runs without exceptions: ", function() {
          console.log("Not checked") // TODO: hideInfo, showOrHideInfo...
        });
      });
    });
  });
  describe("Check function modifyText: ", function() {
    it("Check function runs without exceptions: ", function() {
      mockDomInputUrls(inputUrlsTest);
      class MockUrlsRuleApplicator { modifyUrls(){ return ['url1.com', 'url2.com'] } };
      const mockUrlsRuleApplicator = new MockUrlsRuleApplicator();
      const result = ModulePopup.modifyText(mockUrlsRuleApplicator);
      chai.expect(result).to.equal(undefined);
    });
  });
  describe("Check function reportError: ", function() {
    it("Check function runs without exceptions: ", function() {
      // TODO incorrect test.
      const result = ModulePopup.reportError('Testing error');
      chai.expect(result).to.equal(undefined);
    });
  });
  describe("Check function reportExecuteScriptError: ", function() {
    it("Check function runs without exceptions: ", function() {
      const result = ModulePopup.reportExecuteScriptError("Error message")
      chai.expect(result).to.equal(undefined);
    });
  });
  describe("Check function showStoredInfo: ", function() {
    // TODO incorrect test.
    it("Check function runs without exceptions: ", function() {
      const values2save = ['value 1', 'value 2']
      const result = ModulePopup.showStoredInfo(values2save);
      chai.expect(typeof result).to.equal('undefined');
    });
    describe("Check function updateValue: ", function() {
      it("Check function runs without exceptions: ", function() {
        console.log("Not checked") // TODO
      });
    });
  });
});

