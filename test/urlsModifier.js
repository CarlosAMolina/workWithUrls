const assert = require("chai").assert;
const m_urlsModifier = require('../popup/modules/urlsModifier.js');
const mockRuleValueOld = 'test'
const mockRuleValueNew = 'changed'
const urlRule = new m_urlsModifier.UrlRule([mockRuleValueOld], [mockRuleValueNew]);


describe("Check script urlsModifier.js: ", function() {
  describe("Check class RuleTypes: ", function() {
    const ruleTypes = new m_urlsModifier.RuleTypes();
    it("Check function get ruleDeobfuscate: ", function() {
      assert.equal(ruleTypes.ruleDeobfuscate, 'rd');
    });
    it("Check function set ruleDeobfuscate does not exist: ", function() {
      ruleTypes.ruleDeobfuscate = 'x'
      assert.equal(ruleTypes.ruleDeobfuscate, 'rd');
    });
    it("Check function get ruleObfuscate: ", function() {
      assert.equal(ruleTypes.ruleObfuscate, 'ro');
    });
    it("Check function get ruleTypes: ", function() {
      assert.equal(String(ruleTypes.ruleTypes), String(['rd', 'ro']));
    });
    it("Check function setRuleTypeDeobfuscate: ", function() {
      ruleTypes.setRuleTypeDeobfuscate()
      assert.equal(ruleTypes.ruleType, ruleTypes.ruleDeobfuscate);
    });
    it("Check function setRuleTypeObfuscate: ", function() {
      ruleTypes.setRuleTypeObfuscate()
      assert.equal(ruleTypes.ruleType, ruleTypes.ruleObfuscate);
    });
    it("Check function isRuleTypeConfigured: ", function() {
      const ruleTypes = new m_urlsModifier.RuleTypes();
      assert.isFalse(ruleTypes.isRuleTypeConfigured());
      ruleTypes.setRuleTypeObfuscate();
      assert.isTrue(ruleTypes.isRuleTypeConfigured());
    });
  });
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
    const mockRuleValuesGeneral = [new m_urlsModifier.RuleValue(mockRuleValueOld, mockRuleValueNew)]
    it("Check class: ", function() {
      assert.equal(urlRule.ruleValues.length, 1);
      assert.equal(urlRule.ruleValues[0].valueNew, mockRuleValuesGeneral[0].valueNew);
      assert.equal(urlRule.ruleValues[0].valueOld, mockRuleValuesGeneral[0].valueOld);
    });
    it("Check function getStringRepresentation: ", function() {
      stringRepresentation = urlRule.getStringRepresentation()
      assert.equal(stringRepresentation, 'test\nchanged');
    });
  });
  describe("Check class RulesApplicator: ", function() {
    const rulesApplicator = new m_urlsModifier.RulesApplicator(urlRule);
    it("Check function applyRulesToUrls: ", function() {
      const urls = ['test1.com', 'test2.com'];
      const urls_result = ['changed1.com', 'changed2.com'];
      result = rulesApplicator.applyRulesToUrls(urls);
      assert.equal(String(result), String(urls_result));
    });
  });
  describe("Check function decodeUrls: ", function() {
    it("Check function decodeUrls: ", function() {
      const urls = ['%3Fx%3Dtest1.com', '%3Fx%3Dtest2.com'];
      const urls_result = [ '?x=test1.com', '?x=test2.com' ];
      result = m_urlsModifier.decodeUrls(urls);
      assert.equal(String(result), String(urls_result));
    });
  });
  describe("Check function urlsDecoder: ", function() {
    it("Check function runs without exceptions: ", function() {
      result = m_urlsModifier.urlsDecoder();
      assert.isFunction(result)
    });
  });
  describe("Check function urlsRuleApplicator: ", function() {
    it("Check function runs without exceptions: ", function() {
      result = m_urlsModifier.urlsRuleApplicator({});
      assert.isFunction(result)
    });
  });
  describe("Check class Rules: ", function() {
    const rules = new m_urlsModifier.Rules();
    const ruleType = 'test'
    it("Check function addTypeAndRule: ", function() {
      rules.addTypeAndRule(ruleType, urlRule);
      assert.equal(rules.rules[ruleType], urlRule);
    });
  });
});

