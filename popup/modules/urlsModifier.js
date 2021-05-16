import * as ModuleRule from './rules/rule.js';

const PROTOCOL_DEFAULT = 'http://'

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

  // TODO delete old type and use this new rules type values
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


class RuleTransformationsCreator {

  /*
  param valuesOld: list of strings.
  param valuesNew: list of strings.
  return: list of Rule instances.
  */
  getRuleTransformations(valuesOld, valuesNew) {
    let ruleTransformations = []
    if (valuesOld.length != valuesNew.length) {
      throw RangeError("Rule's values old length != values new length");
    }
    for (let i = 0; i < valuesOld.length; i++) {
      ruleTransformations.push(new ModuleRule.Rule(valuesOld[i], valuesNew[i]));
    }
    return ruleTransformations;
  }

}


class RuleTransformations extends RuleTransformationsCreator {

  /*
  param ruleValuesOld: list of strings.
  param ruleValuesNew: list of strings.
  */
  constructor(ruleValuesOld, ruleValuesNew) {
    super();
    this._ruleTransformations = this.getRuleTransformations(ruleValuesOld, ruleValuesNew);
  }

  get ruleTransformations() {return this._ruleTransformations;}

  get stringRepresentation() {
    let result = '';
    for (const rule of this.ruleTransformations) {
      result += `${rule.valueOld}\n${rule.valueNew}\n`;
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


/*Singleton.
*/
class Rules extends RuleConfigurator{

  constructor() {
    super();
    this._rules = {}; 
    if (!Rules._instance) {
      Rules._instance = this;
    }
    return Rules._instance;
  }

  static getInstance() {
    return this._instance;
  }

  static setInstance(instance) {
    Rules._instance = instance;
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

  /*
  param rule: Rule.
  */
  addRule(rule) {
    this.ruleTransformationsToUse.push(rule);
  }

  /*
  param rule: Rule instance.
  */
  deleteRule(rule) {
    let indexToDelete = -1;
    let match = false;
    for (const ruleStored of this.ruleTransformationsToUse) {
      indexToDelete += 1;
      if (
        ruleStored.valueOld === rule.valueOld
        && ruleStored.valueNew === rule.valueNew
      ) {
        match = true;
        break;
      }
    }
    if (match && indexToDelete !== -1) {
      this.ruleTransformationsToUse.splice(indexToDelete, 1);
    }
  }

  /*
  param ruleToChange: Rule.
  param ruleNew: Rule.
  */
  updateRule(ruleToChange, ruleNew) {
    this.deleteRule(ruleToChange)
    this.addRule(ruleNew)
  }

  initializeRules() {
    this._rules = {};
  }

}


class RulesApplicator {

  /*
  param rule: RuleTransformations instance.
  */
  constructor(ruleTransformations) {
    this._ruleTransformations = ruleTransformations; 
  }

  /*
  param urls: list of strings.
  return: list of strings.
  */
  modifyUrls(urls){
    return urls.map(url => this.getUrlApplyRuleTransformationsToUrl(url));
  }

  getUrlApplyRuleTransformationsToUrl(url) {
    for (const rule of this._ruleTransformations.ruleTransformations) {
      url = this.getUrlApplyRuleToUrl(rule, url);
    }
    return url;
  }

  getUrlApplyRuleToUrl(rule, url){
      return url.replace(this.getRegex(rule.valueOld), rule.valueNew);
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


/* Get all URLs quitting last part path until no more parts available.
Example. For 'http://github.com/CarlosAMolina' two URLs will be 
created: 'http://github.com/CarlosAMolina' and 'http://github.com'.
:param urls: list of strings, URLs to work with.
:return urls_paths: list of strings, all possible URLs omitting
  parts of the paths.
*/
function getUrlsWithPaths(urls){
  // Variable with results.
  let urls_paths = []
  for (let url of urls) {
    // Quit last slash.
    if (url.slice(-1) == '/'){
      url = url.substring(0, url.length -1);
    }
    // Loop all parts of the path until no more parts.
    while (url.slice(-1) != '/') {
      url = getUrlWithProtocol(url)
      urls_paths.push(url)
      if ( url.indexOf('/') != -1 ){
        // Quit last path parth.
        url = url.slice(0, url.lastIndexOf('/'));
      }
      else {
        // Character to stop the while loop.
        url = '/';
      }
    }
  }
  console.log(`URLs with all paths: ${urls_paths}`)
  return urls_paths;
}


/* If the URL has not got protocol, add one.
:param url: str, url to check.
:return url: str, url with protocol.
*/
function getUrlWithProtocol(url){
  if (url.substring(0, 4).toLowerCase() != 'http'){
    return PROTOCOL_DEFAULT + url;
  }
  return url;
}


export {
  getUrlsWithPaths,
  getUrlWithProtocol,
  PROTOCOL_DEFAULT,
  RuleConfigurator,
  Rules,
  RulesApplicator,
  RuleTransformations,
  RuleTypeInvalidExceptionName,
  RuleTypes,
  UrlsDecoder,
  urlsModifier
};
