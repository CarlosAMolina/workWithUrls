import * as ModuleRulesInputParser from '../popup/modules/rules/inputParser.js';

import chai from 'chai';


describe("Check script inputParser.js:", function() {
  describe("Check class RulesParser: ", function() {
    it("Check function getValuesRulesWithCorrectFormat: ", function() {
      const valuesRules = ['http', 'hXXp', '.', '[.]', 'x'];
      const result = new ModuleRulesInputParser.RulesParser().getValuesRulesWithCorrectFormat(valuesRules);
      const resultExpected = new Map([
            ['http', 'hXXp'],
            ['.', '[.]'],
            ['x', ''],
      ]);
      chai.expect(result).to.deep.equal(resultExpected);
    });
  });
});

