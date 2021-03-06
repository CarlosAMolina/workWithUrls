import * as ModuleMockDom from './mockDom.js'; // Global mocks.
import * as ModuleRulesInputReader from '../popup/modules/rules/inputReader.js';
import chai from 'chai';


function mockDomInputRules(values){
  document.getElementById('inputRules').value = values;
}


function mockDomInputRule(valueOld, valueNew){
  document.getElementById('inputValueOld').value = valueOld;
  document.getElementById('inputValueNew').value = valueNew;
}


describe("Check script inputReader.js:", function() {
  describe("Check class OneRuleReader:", function() {
    beforeEach(function() {
      mockDomInputRule('http', 'hXXp')
    });
    it("Check function get rules():", function() {
      chai.expect(
        ModuleRulesInputReader.getReader(false).rules
      ).to.deep.equal(['http', 'hXXp']);
    });
  });
  describe("Check class MultipleRulesReader:", function() {
    beforeEach(function() {
      mockDomInputRules('http\nhXXp\n.\n[.]');
    });
    it("Check function get rules():", function() {
      chai.expect(
        ModuleRulesInputReader.getReader(true).rules
      ).to.deep.equal(['http', 'hXXp', '.', '[.]']);
    });
  });
});

