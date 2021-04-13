import pkgChai from 'chai';

import * as ModulePopup from '../popup/popup.js'; // TODO not use this import.
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
  beforeEach(function() {
    mockBrowserStorageLocal();
  });
  describe("Check function getRules: ", function() {
    it("Check expected result: ", async function() {
      let rules = new ModuleUrlsModifier.Rules();
      const result = await ModuleRulesStorage.getRules(rules);
      assert.equal(result.rules['rd'].stringRepresentation, 'hXXp\nhttp');
    });
  });
  // TODO, move the function showStoredRulesType to the rules/storage.js file.
  describe("Check function showStoredRulesType: ", function() {
    it("Check expected result: ", async function() {
      let rules = new ModuleUrlsModifier.Rules();
      rules.setRuleTypeDeobfuscate()
      ModulePopup.showStoredRulesType(rules);
    });
  });
});

