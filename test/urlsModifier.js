import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';
import pkgChai from 'chai';

const {assert: assert} = pkgChai;
const mockRuleTransformationValueOld = 'test'
const mockRuleTransformationValueNew = 'changed'
const ruleTransformations = new ModuleUrlsModifier.RuleTransformations([mockRuleTransformationValueOld], [mockRuleTransformationValueNew]);


describe("Check script urlsModifier.js: ", function() {
  describe("Check class RuleTypes: ", function() {
    const ruleTypes = new ModuleUrlsModifier.RuleTypes();
    it("Check function get ruleDeobfuscate: ", function() {
      assert.equal(ruleTypes.ruleDeobfuscate, 'rd');
    });
    it("Check function set ruleDeobfuscate does not exist: ", function() {
      try {
        ruleTypes.ruleDeobfuscate = 'x'
        throw ('An exception should be raised');
      } catch(exception) {
        if (!exception instanceof TypeError) {
          throw exception;
        }
      }
    });
    it("Check function get ruleObfuscate: ", function() {
      assert.equal(ruleTypes.ruleObfuscate, 'ro');
    });
    it("Check function get ruleTypes: ", function() {
      assert.equal(String(ruleTypes.ruleTypes), String(['rd', 'ro']));
    });
  });
  describe("Check class RuleConfigurator: ", function() {
    const ruleConfigurator = new ModuleUrlsModifier.RuleConfigurator();
    const ruleTypes = new ModuleUrlsModifier.RuleTypes();
    function isAllowedRuleTypeDetected(ruleConfiguratorInstance, ruleType) {
      try {
        ruleConfiguratorInstance.ruleType = ruleType
        return true;
      } catch(exception) {
        if (exception.name === ModuleUrlsModifier.RuleTypeInvalidExceptionName) {
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
      const ruleConfigurator = new ModuleUrlsModifier.RuleConfigurator();
      assert.isFalse(ruleConfigurator.isRuleTypeConfigured());
      ruleConfigurator.setRuleTypeObfuscate();
      assert.isTrue(ruleConfigurator.isRuleTypeConfigured());
    });
  });
  describe("Check class RuleTransformation: ", function() {
    const ruleTransformation = new ModuleUrlsModifier.RuleTransformation('old', 'new');
    it("Check function get valueOld: ", function() {
      assert.equal(ruleTransformation.valueOld, 'old');
    });
    it("Check function get valueNew: ", function() {
      assert.equal(ruleTransformation.valueNew, 'new');
    });
  });
  describe("Check class RuleTransformations: ", function() {
    const mockRuleTransformationValuesGeneral = [new ModuleUrlsModifier.RuleTransformation(mockRuleTransformationValueOld, mockRuleTransformationValueNew)]
    it("Check class: ", function() {
      assert.equal(ruleTransformations.ruleTransformations.length, 1);
      assert.equal(ruleTransformations.ruleTransformations[0].valueNew, mockRuleTransformationValuesGeneral[0].valueNew);
      assert.equal(ruleTransformations.ruleTransformations[0].valueOld, mockRuleTransformationValuesGeneral[0].valueOld);
    });
    it("Check function getStringRepresentation: ", function() {
      const stringRepresentation = ruleTransformations.stringRepresentation;
      assert.equal(stringRepresentation, 'test\nchanged');
    });
    it("Check function isThereAnyRule: ", function() {
      let result = ruleTransformations.isThereAnyRule();
      assert.isTrue(result);
      const ruleTransformationsNoRule = new ModuleUrlsModifier.RuleTransformations([], []);
      result = ruleTransformationsNoRule.isThereAnyRule();
      assert.isFalse(result);
    });
  });
  describe("Check class RulesApplicator: ", function() {
    it("Check function modifyUrls, with rules: ", function() {
      const ruleTransformations = new ModuleUrlsModifier.RuleTransformations(
        ['http', '\\.'],
        ['hXXp', '[.]']
      )
      const rulesApplicator = new ModuleUrlsModifier.RulesApplicator(ruleTransformations);
      const urls = ['https://www.test1.com', 'www.test2.com/path/file.txt'];
      const result = rulesApplicator.modifyUrls(urls);
      const urls_result = ['hXXps://www[.]test1[.]com', 'www[.]test2[.]com/path/file[.]txt'];
      assert.equal(String(result), String(urls_result));
    });
    it("Check function modifyUrls, without rules: ", function() {
      const ruleTransformations = new ModuleUrlsModifier.RuleTransformations([],[])
      const rulesApplicator = new ModuleUrlsModifier.RulesApplicator(ruleTransformations);
      const urls = ['https://www.test1.com', 'www.test2.com/path/file.txt'];
      const result = rulesApplicator.modifyUrls(urls);
      assert.equal(String(result), String(urls));
    });

  });
  describe("Check class UrlsDecoder: ", function() {
    const urlsDecoder = new ModuleUrlsModifier.UrlsDecoder();
    it("Check function modifyUrls: ", function() {
      const urls = [
        'http%3A%2F%2Fexample.com%2Fabcd%3Flanguage%3DEN',
        'https%3A%2F%2Fgithub.com%2FCarlosAMolina%2FworkWithUrls%2F'
      ];
      const urls_result = [
        'http://example.com/abcd?language=EN',
        'https://github.com/CarlosAMolina/workWithUrls/'
      ];
      const result = urlsDecoder.modifyUrls(urls);
      assert.equal(String(result), String(urls_result));
    });
    it("Check function modifyUrls, malformed url: ", function() {
      const urls = [
        'nonEncodedUrl.com',
        'https%3A%2F%2Fgithub.com%2FCarlosAMolina%2FworkWithUrls%2F'
      ];
      const urls_result = [
        'nonEncodedUrl.com',
        'https://github.com/CarlosAMolina/workWithUrls/'
      ];
      const result = urlsDecoder.modifyUrls(urls);
      assert.equal(String(result), String(urls_result));
    });
  });
  describe("Check function urlsModifier: ", function() {
    it("Check function runs without exceptions for UrlsDecoder: ", function() {
      const urlsModifier = ModuleUrlsModifier.urlsModifier();
      assert.equal(typeof urlsModifier, 'object');
    });
    it("Check function runs without exceptions for RulesApplicator: ", function() {
      const urlsModifier = ModuleUrlsModifier.urlsModifier(ruleTransformations);
      assert.isFunction(urlsModifier.modifyUrls);
      const result = urlsModifier.modifyUrls(['test']);
      assert.equal(String(result), String([mockRuleTransformationValueNew]));
    });
  });
  describe("Check class Rules: ", function() {
    const rules = new ModuleUrlsModifier.Rules();
    const ruleType = 'rd'
    it("Check function addTypeAndRule: ", function() {
      rules.ruleType = ruleType;
      rules.addTypeAndRule(ruleType, ruleTransformations);
      assert.equal(rules.ruleTransformationsToUse, ruleTransformations.ruleTransformations);
    });
    it("Check Rules._ruleConfigurator._ruleTypes: ", function() {
      assert.equal(String(rules.ruleTypes), String(new ModuleUrlsModifier.RuleTypes().ruleTypes));
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

