import chai from 'chai';

import * as ModulePopup from '../popup/popup.js'; // TODO not use this import.
import * as ModuleRule from '../popup/modules/rules/rule.js';
import * as ModuleStorageRules from '../popup/modules/storage/rules.js';
import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';


function getRule(valueOld, valueNew) {
  return new ModuleRule.Rule(valueOld, valueNew);
}


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
        return resolve('done');
      });
    },
    get: function(key) {
      return new Promise(function(resolve, reject) {
        resolve(new Object({ }))
      });
    }
  };
}


function mockBrowserStorageLocalRemove(){
  global.browser = {};
  browser.storage = {
    'ro_old_http': 'http',
    'ro_new_http': 'hXXp',
    'ro_old_\.': '\.',
    'ro_new_\.': '[.]',
  };
  browser.storage.local = storageMockRemove();
}

function storageMockRemove() {
  return {
    remove: function(keys) {
      return new Promise(function(resolve, reject) {
        for (let key of keys) {
          delete browser.storage[key];
        }
        return resolve('done');
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
      chai.expect(result.rules['rd'].stringRepresentation).to.equal('hXXp\nhttp');
    });
  });
  describe("Check function saveRuleIfNew:", function() {
    beforeEach(function() {
      mockBrowserStorageLocalSet();
    });
    it("Check expected result:", async function() {
      const rule = getRule('http', 'hXXp');
      await ModuleStorageRules.saveRuleIfNew(rule, 'ro');
      chai.expect(browser.storage['ro_old_http']).to.equal('http');
      chai.expect(browser.storage['ro_new_http']).to.equal('hXXp');
    });
  });
  describe("Check function removeRule:", function() {
    beforeEach(function() {
      mockBrowserStorageLocalRemove();
    });
    it("Check expected result:", async function() {
      const rule = getRule('http', 'hXXp');
      await ModuleStorageRules.removeRule(rule, 'ro');
      chai.expect(browser.storage['ro_old_\.']).to.equal('\.');
      chai.expect(browser.storage['ro_new_\.']).to.equal('[.]');
      chai.expect(browser.storage['ro_old_http']).to.equal(undefined);
      chai.expect(browser.storage['ro_new_http']).to.equal(undefined);
    });
  });
  describe("Check class StorageKeysRule:", function() {
    let storageKeysRule;
    beforeEach(function() {
      storageKeysRule = new ModuleStorageRules.StorageKeysRule(
        getRule('http', 'hXXp'),
        'ro',
      );
    });
    it("Check keyOldPrefix:", async function() {
      chai.expect(storageKeysRule.keyOldPrefix).to.equal('ro_old_');
    });
    it("Check keyNewPrefix:", async function() {
      chai.expect(storageKeysRule.keyNewPrefix).to.equal('ro_new_');
    });
    it("Check keyOld:", async function() {
      chai.expect(storageKeysRule.keyOld).to.equal('ro_old_http');
    });
    it("Check keyNew:", async function() {
      chai.expect(storageKeysRule.keyNew).to.equal('ro_new_http');
    });
    it("Check keysStringRepresentation:", async function() {
      chai.expect(storageKeysRule.keysStringRepresentation).to.equal("'ro_old_http', 'ro_new_http'");
    });
  });
});

