const RuleTypeInvalidExceptionName = "RuleTypeInvalidException"

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw#Throw_an_object
function RuleTypeInvalidException(message) {
  this.message = message;
  this.name = RuleTypeInvalidExceptionName;
}


class RuleTypes {

  constructor(){
    this._ruleDeobfuscate = 'rd';
    this._ruleObfuscate = 'ro';
    this._ruleTypes = [this._ruleDeobfuscate, this._ruleObfuscate];
  }

  get ruleDeobfuscate() {return this._ruleDeobfuscate;}
  get ruleObfuscate() {return this._ruleObfuscate;}
  get ruleTypes() {return this._ruleTypes;}

}


class RuleConfigurator extends RuleTypes{

  constructor(){
    super();
    this._ruleType = null;
  }

  get ruleType() {
    this.assertRuleTypeConfigured();
    return this._ruleType;
  }

  // TODO delete and use new rules type values
  get ruleTypeNew() {
    if (this._ruleType == this.ruleDeobfuscate) {
      return 'rulesDeobfuscation'
    } else if (this._ruleType == this.ruleObfuscate) {
      return 'rulesObfuscation'
    }
    throw 'Invalid rule type'
  }

  set ruleType(ruleType) {
    this.assertRuleTypeAllowed(ruleType);
    switch(ruleType) {
      case this._ruleDeobfuscate:
        this.setRuleTypeDeobfuscate();
        break;
      case this._ruleObfuscate:
        this.setRuleTypeObfuscate();
        break;
    }
  }

  setRuleTypeObfuscate() {this._ruleType = this._ruleObfuscate;}
  setRuleTypeDeobfuscate() {this._ruleType = this._ruleDeobfuscate;}

  isRuleTypeConfigured() {return this._ruleType !== null;}

  assertRuleTypeConfigured() {
    if (!this.isRuleTypeConfigured()) {
      throw ReferenceError("Rule type not configured");
    }
  }

  assertRuleTypeAllowed(ruleType) {
    if (!this._ruleTypes.includes(ruleType)) {
      throw new RuleTypeInvalidException("Incorrect rule type: " + ruleType + ". Allowed values: " + this._ruleTypes);
    }
  }

}


class RuleTransformation {

  constructor(valueOld, valueNew){
    this._data = {'valueOld': valueOld, 'valueNew': valueNew};
  }

  get valueOld() {return this._data.valueOld;}
  get valueNew() {return this._data.valueNew;}

}


class RuleTransformationsCreator {

  /*
  param valuesOld: list of strings.
  param valuesNew: list of strings.
  return: list of RuleTransformation instances.
  */
  getRuleTransformations(valuesOld, valuesNew) {
    let ruleTransformations = []
    if (valuesOld.length != valuesNew.length) {
      throw RangeError("Rule's values old length != values new length");
    }
    for (let i = 0; i < valuesOld.length; i++) {
      ruleTransformations.push(new RuleTransformation(valuesOld[i], valuesNew[i]));
    }
    return ruleTransformations;
  }

}


class RuleTransformations extends RuleTransformationsCreator {

  /*
  param ruleTransformationValuesOld: list of strings.
  param ruleTransformationValuesNew: list of strings.
  */
  constructor(ruleTransformationValuesOld, ruleTransformationValuesNew) {
    super();
    this._ruleTransformations = this.getRuleTransformations(ruleTransformationValuesOld, ruleTransformationValuesNew);
  }

  get ruleTransformations() {return this._ruleTransformations;}

  get stringRepresentation() {
    let result = '';
    for (const ruleTransformation of this.ruleTransformations) {
      result += ruleTransformation.valueOld + '\n' + ruleTransformation.valueNew + '\n';
    }
    result = this.removeTrailingNewLine(result)
    return result
  }

  isThereAnyRule(){
    return this.ruleTransformations.length != 0
  }

  removeTrailingNewLine(string){
    return string.replace(/\n$/, "");
  }

}


class Rules extends RuleConfigurator{

  constructor() {
    super();
    this._rules = {}; 
  }

  get rules() {return this._rules;}

  get ruleTransformationsInstanceToUse() {
    return this._rules[this.ruleType];
  }

  get ruleTransformationsToUse() {
    return this.ruleTransformationsInstanceToUse.ruleTransformations;
  }

  get ruleTransformationsToUseStringRepresentation() {
    return this.ruleTransformationsInstanceToUse.stringRepresentation;
  }

  /*
  param ruleType: str, RuleTypes._ruleType.
  param ruleTransformations: RuleTransformations instance.
  */
  addTypeAndRule(ruleType, ruleTransformations) {
    this.assertRuleTypeAllowed(ruleType);
    this._rules[ruleType] = ruleTransformations;
  }

  initializeRules() {
    this._rules = {};
  }

}


class RulesParser {

  /*
  :param valuesRules: array of strings.
  :return Map().
  */
  getValuesRulesWithCorrectFormat(valuesRules) {
    let valuesRulesFormatted = new Map();
    for (let i = 0; i < valuesRules.length; i+=2) {
      const valueOld = valuesRules[i];
      const valueNew = isNewValueSpecified(valuesRules[i+1]) ? valuesRules[i+1] : '';
      valuesRulesFormatted.set(valueOld, valueNew);
    }
    return valuesRulesFormatted;

    /*
    :param newValue: str.
    :return: bool.
    */
    function isNewValueSpecified(newValue) {
      return typeof newValue !== 'undefined';
    }
  }

}


class RulesApplicator {

  /*
  param rule: RuleTransformations instance.
  */
  constructor(rule) {
    this.rule = rule; 
  }

  /*
  param urls: list of strings.
  return: list of strings.
  */
  modifyUrls(urls){
    return urls.map(url => this.getUrlApplyRuleTransformationsToUrl(url));
  }

  getUrlApplyRuleTransformationsToUrl(url) {
    for (const ruleTransformation of this.rule.ruleTransformations) {
      url = this.getUrlApplyRuleTransformationToUrl(ruleTransformation, url);
    }
    return url;
  }

  getUrlApplyRuleTransformationToUrl(ruleTransformation, url){
      return url.replace(this.getRegex(ruleTransformation.valueOld), ruleTransformation.valueNew);
  }

  getRegex(ruleValue){
      return new RegExp(ruleValue, "g");

  }

}


class UrlsDecoder {

  /*
  param urls: list of strings.
  return: list of strings.
  */
  modifyUrls(urls) {
    return urls.map(url => this.decodeUrl(url));
  }

  decodeUrl(url) {
    try{
      url = decodeURIComponent(url);
    } catch(e) { // URIError: malformed URI sequence
      console.error(e);
    }
    return url;
  }

}


function urlsModifier(rule) {
  if (typeof rule !== 'undefined') {
    return new RulesApplicator(rule);
  } else {
    return new UrlsDecoder();
  }
}


export {
  RulesApplicator,
  RulesParser,
  Rules,
  RuleConfigurator,
  RuleTransformation,
  RuleTransformations,
  RuleTypes,
  RuleTypeInvalidExceptionName,
  UrlsDecoder,
  urlsModifier
};
