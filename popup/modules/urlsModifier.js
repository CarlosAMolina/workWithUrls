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


class UrlsModifier {

  /*
  param urlRule: list UrlRule instance.
  return: list of strings.
  */
  applyRulesToUrls(urls, urlRule){
    let urlsNew = [];
    if (urlRule.ruleValues.length != 0){
      urls.forEach( function(url) {
        urlRule.ruleValues.forEach( function(ruleValue) {
          const regex = new RegExp(ruleValue.valueOld, "g");
          urlsNew.push(url.replace(regex, ruleValue.valueNew));
        });
      });
    }
    return urlsNew;
  }

  /*
  return: list of strings.
  */
  decodeUrls(urls){
    let urlsNew = [];
    urls.forEach( function(url2Change) {
      try{
        url2Change = decodeURIComponent(url2Change);
      } catch(e) { // URIError: malformed URI sequence
        url2Change = e;
      }
      urlsNew.push(url2Change);
    });
    return urlsNew;
  }

}


module.exports = {
  RuleValue,
  UrlRule,
  UrlsModifier
}
