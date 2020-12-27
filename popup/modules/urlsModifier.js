class RuleValue {

  constructor(valueOld, valueNew){
    this._data = {valueOld: valueOld, valueNew: valueNew};
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
    this.ruleValues = this.#getRuleValues(ruleValuesOld, ruleValuesNew);
  }

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
  RuleValue,
  UrlRule,
  urlsDecoder,
  urlsRuleApplicator
}

