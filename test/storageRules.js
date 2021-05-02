import pkgChai from 'chai';

import * as ModulePopup from '../popup/popup.js'; // TODO not use this import.
import * as ModuleRule from '../popup/modules/rules/rule.js';
import * as ModuleStorageRules from '../popup/modules/storage/rules.js';
import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';

const {assert: assert} = pkgChai;

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
        resolve(new Object({ rd_new_hXXp: "http", rd_old_hXXp: "hXXp" }))
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
        return resolve('done')
      });
    },
    get: function(key) {
      return new Promise(function(resolve, reject) {
        resolve(new Object({ }))
      });
    }
  };
}

describe("Check script storage/rules.js:", function() {
  describe("Check function getRules:", function() {
    beforeEach(function() {
      mockBrowserStorageLocalGet();
    });
    it("Check expected result:", async function() {
      let rules = new ModuleUrlsModifier.Rules();
      const result = await ModuleStorageRules.getRules(rules);
      assert.equal(result.rules['rd'].stringRepresentation, 'hXXp\nhttp');
    });
  });
  describe("Check function saveRuleIfNew:", function() {
    beforeEach(function() {
      mockBrowserStorageLocalSet();
    });
    it("Check expected result:", async function() {
      const rule = new ModuleRule.Rule('http', 'hXXp');
      await ModuleStorageRules.saveRuleIfNew(rule, 'ro');
      assert.equal(browser.storage['ro_old_http'], 'http');
      assert.equal(browser.storage['ro_new_http'], 'hXXp');
    });
  });
  // TODO, move the function showStoredRulesType to the storage/rules.js file.
  describe("Check function showStoredRulesType:", function() {
    it("Check expected result:", async function() {
      let rules = new ModuleUrlsModifier.Rules();
      rules.setRuleTypeDeobfuscate()
      ModulePopup.showStoredRulesType(rules);
      //TODO assert not done
    });
  });
});

