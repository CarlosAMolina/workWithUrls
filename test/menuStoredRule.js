import * as ModuleMenuStoredRule from '../popup/modules/menus/menuStoredRule.js';
import * as ModuleRule from '../popup/modules/rules/rule.js';
import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';

import chai from 'chai';


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
});

