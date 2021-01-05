import * as ModulePopup from '../popup/popup.js';
import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';
import fs from "fs";
import jsdom from 'jsdom';
import path from "path";
import pkgChai from 'chai';


//https://stackoverflow.com/questions/32126003/node-js-document-is-not-defined
function mockDomDocument(html){
  const { JSDOM } = jsdom;
  global.document = new JSDOM(html).window.document;
}

function mockDomInputUrls(valueToMock){
  document.getElementById('inputUrls').value = valueToMock;
}

function readFile(path) {
  try {
    const data = fs.readFileSync(path, 'utf8')
    return data
  } catch (exception) {
    console.error(exception)
    return exception
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
  const {assert: assert} = pkgChai;
  const __dirname = path.resolve();
  const inputUrlsTest = 'test1.com\ntest2.com';
  const mockRuleTransformationValueOld = 'test'
  const mockRuleTransformationValueNew = 'changed'
  const popupHtmlPath = path.resolve(__dirname, 'popup/popup.html');
  const popupHtml = readFile(popupHtmlPath);
  mockDomDocument(popupHtml);
  mockBrowserStorageLocal();
  describe("Check function popupMain: ", function() {
    ModulePopup.popupMain(); // Functon instance, required to access inner functions.
    describe("Check function initializePopup: ", function() {
      it("Check function runs without exceptions: ", function() {
        const result = ModulePopup.popupMain.initializePopup();
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
        const result = ModulePopup.popupMain.getRules();
        assert.equal(result, undefined);
      });
    });
    describe("Check function getStorageLazyLoading: ", function() {
      it("Check function runs without exceptions: ", function() {
        const result = ModulePopup.popupMain.getStorageLazyLoading();
        assert.equal(result, undefined);
      });
    });
    describe("Check function reportError: ", function() {
      it("Check function runs without exceptions: ", function() {
        const result = ModulePopup.popupMain.reportError('Testing error');
        assert.equal(result, undefined);
      });
    });
    describe("Check function showStoredInfo: ", function() {
      it("Check function runs without exceptions: ", function() {
        const values2save = ['value 1', 'value 2']
        const result = ModulePopup.popupMain.showStoredInfo(values2save);
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
      const result = ModulePopup.reportExecuteScriptError("Error message")
      assert.equal(result, undefined);
    });
  });
  describe("Check function modifyText: ", function() {
    it("Check function runs without exceptions: ", function() {
      mockDomInputUrls(inputUrlsTest);
      const ruleTransformations = new ModuleUrlsModifier.RuleTransformations([mockRuleTransformationValueOld], [mockRuleTransformationValueNew]);
      const functionModifyUrls = function mock(){ return ['url1.com', 'url2.com'] };
      const result = ModulePopup.modifyText(functionModifyUrls)
      assert.equal(result, undefined);
    });
  });
  describe("Check class Dom: ", function() {
    const dom = new ModulePopup.Dom();
    it("Check function getUrls: ", function() {
      mockDomInputUrls(inputUrlsTest);
      assert.equal(dom.getUrls(), inputUrlsTest);
    });
    it("Check function setUrls: ", function() {
      const inputUrlsNew = 'new1.com\nnew2.com'
      dom.setUrls(inputUrlsNew)
      assert.equal(dom.getUrls(), inputUrlsNew);
    });
    it("Check function isCheckedBoxDecode: ", function() {
      document.getElementById('boxDecode').checked = true;
      assert.isTrue(dom.isCheckedBoxDecode());
      document.getElementById('boxDecode').checked = false;
      assert.isFalse(dom.isCheckedBoxDecode());
    });
    it("Check function getInfoContainer: ", function() {
      const result = dom.getInfoContainer();
      assert.typeOf(result, "HTMLDivElement");
    });
  });
});

