import chai from 'chai';

import * as ModuleRule from '../popup/modules/rules/rule.js';


describe("Check script rule.js:", function() {
  describe("Check class getters:", function() {
    let rule = new ModuleRule.Rule('http', 'hXXp');
    it("Check get valueOld:", function() {
      chai.expect(rule.valueOld).to.equal('http');
    });
    it("Check get valueNew:", function() {
      chai.expect(rule.valueNew).to.equal('hXXp');
    });
    it("Check get stringRepresentation:", function() {
      console.log(rule.stringRepresentation);
      chai.expect(rule.stringRepresentation).to.equal("Rule(valueOld='http', valueNew='hXXp')");
    });
  });
});

