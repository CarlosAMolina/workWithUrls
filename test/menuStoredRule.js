import { beforeEach } from "mocha";
import { describe } from "mocha";
import { it } from "mocha";
import chai from "chai";

import * as ModuleDom from "../popup/modules/dom.js";
import * as ModuleMockDom from "./mockDom.js"; // Global mocks.
import * as ModuleMenuStoredRule from "../popup/modules/menus/menuStoredRule.js";
import * as ModuleRule from "../popup/modules/rules/rule.js";
import * as ModuleUrlsModifier from "../popup/modules/urlsModifier.js";

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
    it("Check function runs without exceptions: ", function () {
      const rule = new ModuleRule.Rule("old value", "new value");
      let rules = new ModuleUrlsModifier.Rules();
      ModuleMenuStoredRule.showMenuStoredRule(rule, rules);
      const newResult = ModuleDom.getInfoContainer().innerHTML;
      const expectedResult =
        '<div><div class="section ruleConfig"><button title="Delete" class="button squareButton"><img src="/icons/trash.svg"></button><button title="Edit" class="button squareButton"><img src="/icons/edit.svg"></button><p>old value ---&gt; new value</p></div><div class="section ruleConfig hidden"><button title="Update" class="button squareButton"><img src="/icons/ok.svg"></button><button title="Cancel update" class="button squareButton"><img src="/icons/cancel.svg"></button><input type="text"><input type="text"></div></div>';
      chai.expect(expectedResult).to.equal(newResult);
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
