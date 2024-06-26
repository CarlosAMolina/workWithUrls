import * as ModuleDom from "../popup/modules/dom.js";
import * as ModuleMockDom from "./mockDom.js"; // Global mocks.
import * as ModuleMenuStoredRule from "../popup/modules/menus/menuStoredRule.js";
import * as ModuleMenuStoredRuleNew from "../popup/modules/menus/menuStoredRuleNew.js";
import * as ModuleRule from "../popup/modules/rules/rule.js";
import * as ModuleUrlsModifier from "../popup/modules/urlsModifier.js";

import chai from "chai";

function mockBrowserStorageLocalGet() {
  global.browser = {};
  browser.storage = {};
  browser.storage.local = storageMockGet();
}

// Storage Mock
// https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests
function storageMockGet() {
  return {
    get: function (key) {
      return new Promise(function (resolve, reject) {
        resolve(new Object({ rd_new_hXXp: "http", rd_old_hXXp: "hXXp" }));
      });
    },
  };
}

describe("Check script menuStoredRule.js: ", function () {
  describe("Check function showMenuStoredRule: ", function () {
    // TODO deprecate with the new version
    it("Check function runs without exceptions: ", function () {
      const rule = new ModuleRule.Rule("http", "hXXp");
      let rules = new ModuleUrlsModifier.Rules();
      ModuleMenuStoredRule.showMenuStoredRule(rule, rules);
      const result = ModuleDom.getInfoContainer().innerHTML;
      const expectedResult =
        '<div><div><button title="Delete" class="floatLeft button" style="width: 30px; height: 30px; background: url(/icons/trash.png) no-repeat center;"></button><button title="Edit" class="floatLeft button" style="width: 30px; height: 30px; background: url(/icons/edit.png) no-repeat center;"></button><p style="margin-left: 75px">http ---&gt; hXXp</p><div class="clearfix"></div></div><div style="display: none;"><input class="input" style="width:30%"><input class="input" style="width:30%"><button title="Update" class="floatLeft button" style="width: 30px; height: 30px; background: url(/icons/ok.png) no-repeat center;"></button><button title="Cancel update" class="floatLeft button" style="width: 30px; height: 30px; background: url(/icons/cancel.png) no-repeat center;"></button><div class="clearfix"></div></div></div>';
      chai.expect(expectedResult).to.equal(result);
    });
    // TODO drop only
    it.only("Check function runs without exceptions: ", function () {
      const rule = new ModuleRule.Rule("old value", "new value");
      let rules = new ModuleUrlsModifier.Rules();
      ModuleMenuStoredRuleNew.showMenuStoredRule(rule, rules);
      const newResult = ModuleDom.getInfoContainer().innerHTML;
      const expectedNewResult =
        '<div class="section configRule"><button title="Delete" class="buttonNew squareButton"><img src="/icons/trash.png"></button><button title="Edit" class="buttonNew squareButton"><img src="/icons/edit.png"></button><p>old value ---&gt; new value</p>';
      chai.expect(expectedNewResult).to.equal(newResult);
    });
    describe("Check function updateValue: ", function () {
      it("Check function runs without exceptions: ", function () {
        console.log("Not checked"); // TODO
      });
    });
  });
  describe("Check function showStoredRulesType:", function () {
    beforeEach(function () {
      mockBrowserStorageLocalGet();
    });
    it("Check expected result:", async function () {
      let rules = new ModuleUrlsModifier.Rules();
      rules.setRuleTypeDeobfuscate();
      ModuleMenuStoredRule.showStoredRulesType(rules);
      //TODO assert not done
    });
  });
});
