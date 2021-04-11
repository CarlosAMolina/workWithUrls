import pkgChai from 'chai';

import * as ModuleRulesStorage from '../popup/modules/rules/storage.js';
import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';

const {assert: assert} = pkgChai;

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
        resolve(new Object({ rd_new_hXXp: "http", rd_old_hXXp: "hXXp" }))
      });
    }
  };
}

describe("Check script rules storage.js: ", function() {
  describe("Check function getRules: ", function() {
    beforeEach(function() {
      mockBrowserStorageLocal();
    });
    it("Check expected result: ", async function() {
      let rules = new ModuleUrlsModifier.Rules();
      const result = await ModuleRulesStorage.getRules(rules);
      assert.equal(result.rules['rd'].stringRepresentation, 'hXXp\nhttp');
    });
  });
});

