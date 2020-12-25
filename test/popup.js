const assert = require("chai").assert;
const fs = require('fs');
const jsdom = require("jsdom");
const path = require("path");
mockDomDocument(readFile(path.resolve(__dirname, '../popup/popup.html')));
mockBrowserStorageLocal();
const popup = require('../popup/popup.js');
const inputUrlsTest = 'test1.com\ntest2.com';
const mockRuleValueOld = 'test'
const mockRuleValueNew = 'changed'
const mockRuleValuesGeneral = [new popup.RuleValue(mockRuleValueOld, mockRuleValueNew)]
const urlRule = new popup.UrlRule([mockRuleValueOld], [mockRuleValueNew]);
const urlsModifier = new popup.UrlsModifier();


function mockDomDocument(html){
  //https://stackoverflow.com/questions/32126003/node-js-document-is-not-defined
  const { JSDOM } = jsdom;
  global.document = new JSDOM(html).window.document;
}

function mockDomInputUrls(){
  document.getElementById('inputUrls').value = inputUrlsTest
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
  describe("Check class RuleValue: ", function() {
    ruleValue = new popup.RuleValue('old', 'new');
    it("Check function get valueOld: ", function() {
      assert.equal(ruleValue.valueOld, 'old');
    });
    it("Check function get valueNew: ", function() {
      assert.equal(ruleValue.valueNew, 'new');
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
      mockDomInputUrls();
      result = popup.modifyText(urlRule)
      assert.equal(result, undefined);
    });
  });
  describe("Check class Dom: ", function() {
    const dom = new popup.Dom();
    it("Check function getUrls: ", function() {
      mockDomInputUrls();
      assert.equal(dom.getUrls(), inputUrlsTest);
    });
    it("Check function setUrls: ", function() {
      const inputUrlsNew = 'new1.com\nnew2.com'
      dom.setUrls(inputUrlsNew)
      assert.equal(dom.getUrls(), inputUrlsNew);
    });
  });
  describe("Check class UrlRule: ", function() {
    it("Check class: ", function() {
      assert.equal(urlRule.ruleValues.length, 1);
      assert.equal(urlRule.ruleValues[0].valueNew, mockRuleValuesGeneral[0].valueNew);
      assert.equal(urlRule.ruleValues[0].valueOld, mockRuleValuesGeneral[0].valueOld);
    });
  });
  describe("Check class UrlsModifier: ", function() {
    it("Check function applyRulesToUrls: ", function() {
      const urls = ['test1.com', 'test2.com'];
      const urls_result = 'changed1.com\nchanged2.com';
      result = urlsModifier.applyRulesToUrls(urls, urlRule);
      assert.equal(result, urls_result);
    //  mockDomInputUrls()
    //  const ruleValuesMockedObfuscate = {valuesOld: ['test'], valuesNew: ['obfuscated']}
    //  const urls = ['test1.com', 'test2.com']
    //  result = popup.modifyText.applyRulesToUrls(urls)
    //  console.log(result + '<---')
    //  assert.equal(result, undefined);
    });
  });
});

