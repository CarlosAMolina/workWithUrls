const assert = require("chai").assert;
const m_urlsModifier = require('../popup/modules/urlsModifier.js');
const mockRuleTransformationValueOld = 'test'
const mockRuleTransformationValueNew = 'changed'
const ruleTransformations = new m_urlsModifier.RuleTransformations([mockRuleTransformationValueOld], [mockRuleTransformationValueNew]);


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
  });
  describe("Check class RuleConfigurator: ", function() {
    const ruleConfigurator = new m_urlsModifier.RuleConfigurator();
    const ruleTypes = new m_urlsModifier.RuleTypes();
    function isAllowedRuleTypeDetected(ruleConfiguratorInstance, ruleType) {
      try {
        ruleConfiguratorInstance.ruleType = ruleType
        return true;
      } catch(exception) {
        if (exception.name === m_urlsModifier.RuleTypeInvalidExceptionName) {
          return false
        } else {
          throw exception
        }
      }
    }
    it("Check function set ruleType raises RuleTypes.assertRuleTypeConfigured: ", function() {
      try {
        console.log(ruleConfigurator.ruleType);
        throw ('An exception should be raised');
      } catch(exception) {
        if (!exception instanceof ReferenceError) {
          throw exception;
        }
      }
    });
    it("Check function set ruleType use deobfuscate option: ", function() {
      assert.equal(ruleConfigurator.ruleType = ruleTypes.ruleDeobfuscate, ruleTypes.ruleDeobfuscate);
    });
    it("Check function set ruleType use obfuscate option: ", function() {
      assert.equal(ruleConfigurator.ruleType = ruleTypes.ruleObfuscate, ruleTypes.ruleObfuscate);
    });
    it("Check function set ruleType check #assertRuleTypeAllowed with invalid value: ", function() {
      assert.isFalse(isAllowedRuleTypeDetected(ruleConfigurator, 'invented'));
    });
    it("Check function setRuleTypeDeobfuscate: ", function() {
      ruleConfigurator.setRuleTypeDeobfuscate()
      assert.equal(ruleConfigurator.ruleType, ruleTypes.ruleDeobfuscate);
    });
    it("Check function setRuleTypeObfuscate: ", function() {
      ruleConfigurator.setRuleTypeObfuscate()
      assert.equal(ruleConfigurator.ruleType, ruleTypes.ruleObfuscate);
    });
    it("Check function isRuleTypeConfigured: ", function() {
      const ruleConfigurator = new m_urlsModifier.RuleConfigurator();
      assert.isFalse(ruleConfigurator.isRuleTypeConfigured());
      ruleConfigurator.setRuleTypeObfuscate();
      assert.isTrue(ruleConfigurator.isRuleTypeConfigured());
    });
  });
  describe("Check class RuleTransformation: ", function() {
    const ruleTransformation = new m_urlsModifier.RuleTransformation('old', 'new');
    it("Check function get valueOld: ", function() {
      assert.equal(ruleTransformation.valueOld, 'old');
    });
    it("Check function get valueNew: ", function() {
      assert.equal(ruleTransformation.valueNew, 'new');
    });
  });
  describe("Check class RuleTransformations: ", function() {
    const mockRuleTransformationValuesGeneral = [new m_urlsModifier.RuleTransformation(mockRuleTransformationValueOld, mockRuleTransformationValueNew)]
    it("Check class: ", function() {
      assert.equal(ruleTransformations.ruleTransformations.length, 1);
      assert.equal(ruleTransformations.ruleTransformations[0].valueNew, mockRuleTransformationValuesGeneral[0].valueNew);
      assert.equal(ruleTransformations.ruleTransformations[0].valueOld, mockRuleTransformationValuesGeneral[0].valueOld);
    });
    it("Check function getStringRepresentation: ", function() {
      stringRepresentation = ruleTransformations.stringRepresentation;
      assert.equal(stringRepresentation, 'test\nchanged');
    });
  });
  describe("Check class RulesApplicator: ", function() {
    const rulesApplicator = new m_urlsModifier.RulesApplicator(ruleTransformations);
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
    const ruleType = 'rd'
    it("Check function addTypeAndRule: ", function() {
      rules.ruleType = ruleType;
      rules.addTypeAndRule(ruleType, ruleTransformations);
      assert.equal(rules.ruleTransformationsToUse, ruleTransformations.ruleTransformations);
    });
    it("Check Rules._ruleConfigurator._ruleTypes: ", function() {
      assert.equal(String(rules.ruleTypes), String(new m_urlsModifier.RuleTypes().ruleTypes));
    });
    it("Check function initializeRules: ", function() {
      rules.ruleType = ruleType;
      rules.addTypeAndRule(ruleType, ruleTransformations);
      assert.equal(rules.ruleTransformationsToUse.length, 1);
      rules.initializeRules()
      assert.equal(String(rules.rules), String({}));
    });
    it("Check set ruleType: ", function() {
      rules.ruleType = ruleType;
      assert.equal(rules.ruleType, ruleType);
    });
    it("Check get ruleTransformationsToUse: ", function() {
      rules.ruleType = ruleType
      rules.addTypeAndRule(ruleType, ruleTransformations);
      assert.equal(rules.ruleTransformationsToUse, ruleTransformations.ruleTransformations);
    });
    it("Check get ruleTransformationsToUseStringRepresentation: ", function() {
      rules.ruleType = ruleType
      rules.addTypeAndRule(ruleType, ruleTransformations);
      assert.equal(rules.ruleTransformationsToUseStringRepresentation, mockRuleTransformationValueOld + '\n' + mockRuleTransformationValueNew)
    });
  });
});

