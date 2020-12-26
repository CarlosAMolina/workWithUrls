const assert = require("chai").assert;
const m_urlsModifier = require('../popup/modules/urlsModifier.js');
const mockRuleValueOld = 'test'
const mockRuleValueNew = 'changed'
const urlRule = new m_urlsModifier.UrlRule([mockRuleValueOld], [mockRuleValueNew]);
const urlsModifier = new m_urlsModifier.UrlsModifier();


describe("Check script urlsModifier.js: ", function() {
  describe("Check class RuleValue: ", function() {
    const ruleValue = new m_urlsModifier.RuleValue('old', 'new');
    it("Check function get valueOld: ", function() {
      assert.equal(ruleValue.valueOld, 'old');
    });
    it("Check function get valueNew: ", function() {
      assert.equal(ruleValue.valueNew, 'new');
    });
  });
  describe("Check class UrlRule: ", function() {
    it("Check class: ", function() {
      const mockRuleValuesGeneral = [new m_urlsModifier.RuleValue(mockRuleValueOld, mockRuleValueNew)]
      assert.equal(urlRule.ruleValues.length, 1);
      assert.equal(urlRule.ruleValues[0].valueNew, mockRuleValuesGeneral[0].valueNew);
      assert.equal(urlRule.ruleValues[0].valueOld, mockRuleValuesGeneral[0].valueOld);
    });
  });
  describe("Check class UrlsModifier: ", function() {
    it("Check function applyRulesToUrls: ", function() {
      const urls = ['test1.com', 'test2.com'];
      const urls_result = ['changed1.com', 'changed2.com'];
      result = urlsModifier.applyRulesToUrls(urls, urlRule);
      assert.equal(String(result), String(urls_result));
    });
    it("Check function decodeUrls: ", function() {
      const urls = ['%3Fx%3Dtest1.com', '%3Fx%3Dtest2.com'];
      const urls_result = [ '?x=test1.com', '?x=test2.com' ];
      result = urlsModifier.decodeUrls(urls, urlRule);
      assert.equal(String(result), String(urls_result));
    });
  });
});

