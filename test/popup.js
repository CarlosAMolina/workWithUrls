const assert = require("chai").assert;
const fs = require('fs');
const jsdom = require("jsdom");
const path = require("path");
mockDomDocument(readFile(path.resolve(__dirname, '../popup/popup.html')))
mockBrowserStorageLocal()
const popup = require('../popup/popup.js');


function mockDomDocument(html){
  //https://stackoverflow.com/questions/32126003/node-js-document-is-not-defined
  const { JSDOM } = jsdom;
  global.document = new JSDOM(html).window.document;
}

function readFile(path) {
  try {
    const data = fs.readFileSync(path, 'utf8')
    return data
  } catch (err) {
    console.error(err)
    return error
  }
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
  describe("Check function popupMain: ", function() {
    describe("Check function initializePopup: ", function() {
      it("Check function runs without exceptions: ", function() {
        result = popup.popupMain.initializePopup();
        assert.equal(result, undefined);
      });
      describe("Check function getOpenPaths: ", function() {
        it("Check function runs without exceptions: ", function() {
          console.log("Not checked") // TODO
        });
      });
    });
    describe("Check function getRules: ", function() {
      it("Check function runs without exceptions: ", function() {
        result = popup.popupMain.getRules();
        assert.equal(result, undefined);
      });
    });
    describe("Check function getStorageLazyLoading: ", function() {
      it("Check function runs without exceptions: ", function() {
        result = popup.popupMain.getStorageLazyLoading();
        assert.equal(result, undefined);
      });
    });
    describe("Check function reportError: ", function() {
      it("Check function runs without exceptions: ", function() {
        result = popup.popupMain.reportError('Testing error');
        assert.equal(result, undefined);
      });
    });
    describe("Check function showStoredInfo: ", function() {
      it("Check function runs without exceptions: ", function() {
        var values2save = ['value 1', 'value 2']
        result = popup.popupMain.showStoredInfo(values2save);
        assert.equal(result, undefined);
      });
      describe("Check function updateValue: ", function() {
        it("Check function runs without exceptions: ", function() {
          console.log("Not checked") // TODO
        });
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
  describe("Check function reportExecuteScriptError: ", function() {
    it("Check function runs without exceptions: ", function() {
      result = popup.reportExecuteScriptError("Error message")
      assert.equal(result, undefined);
    });
  });
  describe("Check function modifyText: ", function() {
    it("Check function runs without exceptions: ", function() {
      const ruleValuesMocked = {valuesOld: {}}
      result = popup.modifyText(ruleValuesMocked)
      assert.equal(result, undefined);
    });
  });
});

