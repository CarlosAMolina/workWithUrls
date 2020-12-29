class RuleTypes {

  constructor(){
    this._ruleDeobfuscate = 'rd';
    this._ruleObfuscate = 'ro';
    this._ruleType = null;
    this._ruleTypes = [this._ruleDeobfuscate, this._ruleObfuscate];
  }

  get ruleDeobfuscate() {return this._ruleDeobfuscate;}
  get ruleObfuscate() {return this._ruleObfuscate;}
  get ruleType() {return this._ruleType;}
  get ruleTypes() {return this._ruleTypes;}

  setRuleTypeDeobfuscate() {this._ruleType = this._ruleDeobfuscate;}
  setRuleTypeObfuscate() {this._ruleType = this._ruleObfuscate;}
  isRuleTypeConfigured() {return this._ruleType !== null;}

}


class RuleValue {

  constructor(valueOld, valueNew){
    this._data = {'valueOld': valueOld, 'valueNew': valueNew};
  }

  get valueOld() {return this._data.valueOld;}
  get valueNew() {return this._data.valueNew;}

}


class UrlRule {

  /*
  param ruleValuesOld: list of strings.
  param ruleValuesNew: list of strings.
  */
  constructor(ruleValuesOld, ruleValuesNew) {
    this._ruleValues = this.#getRuleValues(ruleValuesOld, ruleValuesNew);
  }

  get ruleValues() {return this._ruleValues;}

  /*
  param valuesOld: list of strings.
  param valuesNew: list of strings.
  return: list of RuleValue instances.
  */
  #getRuleValues(valuesOld, valuesNew) {
    let ruleValues = []
    if (valuesOld.length != valuesNew.length) {
      throw "Rule's values old length != values new length";
    }
    for (let i = 0; i < valuesOld.length; i++) {
      ruleValues.push(new RuleValue(valuesOld[i], valuesNew[i]));
    }
    return ruleValues;
  }

  getStringRepresentation() {
    let result = '';
    for (const ruleValue of this.ruleValues) {
      result += ruleValue.valueOld + '\n' + ruleValue.valueNew + '\n';
    }
    result = this.#removeTrailingNewLine(result)
    return result
  }

  #removeTrailingNewLine(string){
    return string.replace(/\n$/, "");
  }

}


class Rules {

  constructor() {
    this._rules = {}; 
  }

  get rules() {return this._rules;}

  /*
  param ruleType: str, RuleTypes._ruleType.
  param urlRule: UrlRule instance.
  */
  addTypeAndRule(ruleType, urlRule) {
    this._rules[ruleType] = urlRule;
  }
  //TODO continue here

}


class RulesApplicator {

  /*
  param rule: UrlRule instance.
  */
  constructor(rule) {
    this.rule = rule; 
  }

  /*
  param urls: list of strings.
  return: list of strings.
  */
  applyRulesToUrls(urls){
    let urlsNew = [];
    if (this.rule.ruleValues.length != 0){
      for (const url of urls) {
        for (const ruleValue of this.rule.ruleValues) {
          const regex = new RegExp(ruleValue.valueOld, "g");
          urlsNew.push(url.replace(regex, ruleValue.valueNew));
        }
      }
    }
    return urlsNew;
  }

}


/*
param rule: UrlRule instance.
return: list of strings.
*/
function decodeUrls(urls) {
  let urlsNew = [];
  for (let url2Change of urls) {
    try{
      url2Change = decodeURIComponent(url2Change);
    } catch(e) { // URIError: malformed URI sequence
      url2Change = e;
    }
    urlsNew.push(url2Change);
  }
  return urlsNew;
}


/*
return: function reference.
*/
function urlsRuleApplicator(rule) {
  return new RulesApplicator(rule).applyRulesToUrls;
}


/*
return: function reference.
*/
function urlsDecoder() {
  return decodeUrls;
}


module.exports = {
  decodeUrls,
  RulesApplicator,
  Rules,
  RuleTypes,
  RuleValue,
  UrlRule,
  urlsDecoder,
  urlsRuleApplicator
}

