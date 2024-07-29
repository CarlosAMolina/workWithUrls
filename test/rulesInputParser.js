import { describe } from "mocha";
import { it } from "mocha";
import chai from "chai";

import * as ModuleRulesInputParser from "../popup/modules/rules/inputParser.js";


describe("Check script inputParser.js:", function () {
  describe("Check class RulesParser: ", function () {
    it("Check function getValuesRulesWithCorrectFormat: ", function () {
      const valuesRules = ["http", "hXXp", ".", "[.]", "x"];
      const result =
        new ModuleRulesInputParser.RulesParser().getValuesRulesWithCorrectFormat(
          valuesRules,
        );
      const resultExpected = new Map([
        ["http", "hXXp"],
        [".", "[.]"],
        ["x", ""],
      ]);
      chai.expect(result).to.deep.equal(resultExpected);
    });
  });
});
