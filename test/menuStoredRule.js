import * as ModuleMenuStoredRule from '../popup/modules/menus/menuStoredRule.js';
import * as ModuleRule from '../popup/modules/rules/rule.js';
import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';

import chai from 'chai';


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


describe("Check script menuStoredRule.js: ", function() {
  describe("Check function showMenuStoredRule: ", function() {
    // TODO incorrect test.
    it("Check function runs without exceptions: ", function() {
      const rule = new ModuleRule.Rule('http', 'hXXp');
      let rules = new ModuleUrlsModifier.Rules();
      const result = ModuleMenuStoredRule.showMenuStoredRule(rule, rules);
      chai.expect(typeof result).to.equal('undefined');
    });
    describe("Check function updateValue: ", function() {
      it("Check function runs without exceptions: ", function() {
        console.log("Not checked") // TODO
      });
    });
  });
  describe("Check function showStoredRulesType:", function() {
    beforeEach(function() {
      mockBrowserStorageLocalGet();
    });
    it("Check expected result:", async function() {
      let rules = new ModuleUrlsModifier.Rules();
      rules.setRuleTypeDeobfuscate()
      ModuleMenuStoredRule.showStoredRulesType(rules);
      //TODO assert not done
    });
  });
});

