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


describe("Popup tests using ASSERT interface from CHAI module: ", function() {
  describe("Check reportError Function: ", function() {
    it("Check the returned value using: assert.equal(value,'value'): ", function() {
      result = popup.popupMain.reportError('Testing error');
      assert.equal(result, undefined);
    });
  });
});

