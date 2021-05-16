/* References.
- Local storage:
  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local
*/

import * as ModuleUrlsModifier from '../urlsModifier.js';


class StorageKeysRule {

  /*
  :param rule: Rule.
  :return ruleType: str.
  */
  constructor(rule, ruleType) {
    this._rule = rule;
    this._ruleType = ruleType;
  }

  get keyOldPrefix() {
    return `${this._ruleType}_old_`
  }

  get keyNewPrefix() {
    return `${this._ruleType}_new_`
  }

  get keyOld() {
    return `${this._ruleType}_old_${this._rule.valueOld}`
  }

  get keyNew() {
    return `${this._ruleType}_new_${this._rule.valueOld}`
  }

  get keysStringRepresentation() {
    return `'${this.keyOld}', '${this.keyNew}'`;
  }

}

/*
:param rules: Rules.
:return rules: Rules.
*/
async function getRules(rules){
  console.log('Init getRules()');
  let storedItems = {};
  try {
    storedItems = await browser.storage.local.get(null);
    console.log('All stored items:');
    console.log(storedItems);
  } catch(e) {
    console.error(e)
    return {};
  }
  rules.initializeRules();
  for (const ruleType of rules.ruleTypes) {
    const storageKeysRule = new StorageKeysRule(undefined, ruleType);
    const keysRuleOld = Object.keys(storedItems).filter(key => key.includes(storageKeysRule.keyOldPrefix)); //array
    const rules2SaveOld = keysRuleOld.map(keysRuleOld => storedItems[keysRuleOld]); // array
    const keysRuleNew = Object.keys(storedItems).filter(key => key.includes(storageKeysRule.keyNewPrefix)); //array
    const rules2SaveNew = keysRuleNew.map(keysRuleNew => storedItems[keysRuleNew]); // array
    const ruleTransformations = new ModuleUrlsModifier.RuleTransformations(rules2SaveOld, rules2SaveNew); 
    rules.addTypeAndRule(ruleType, ruleTransformations);
  }
    console.log('Rules:')
    console.log(rules.rules)
  return rules;
}

/*
:param rule: Rule.
:param ruleType: str. 
:return bool.
*/
async function saveRuleIfNew(rule, ruleType){

  const storageKeysRule = new StorageKeysRule(rule, ruleType);
  
  let storedItem;
  try {
    // Empty object if the searched value is not stored.
    storedItem = await browser.storage.local.get(storageKeysRule.keyOld);
  } catch(e) {
    console.error(e)
    return false;
  }
  const searchInStorage = Object.keys(storedItem); // array with the searched value if it is stored
  if(searchInStorage.length < 1) { // searchInStorage.length < 1 -> no stored
    _saveInfo(rule, storageKeysRule);
    return true;
  }
  return false;

  function _saveInfo(rule, storageKeysRule) {
    console.log(
      `Init saveInfo(). Keys to save: ${storageKeysRule.keysStringRepresentation}. rule: ${rule.stringRepresentation}`
    );
    var storingInfo = browser.storage.local.set(
      {
        [storageKeysRule.keyOld]: rule.valueOld,
        [storageKeysRule.keyNew]: rule.valueNew
      }
    );
    storingInfo.then(() => {
    }, console.error);
  }

}

/*
:param rule: Rule.
:param ruleType: str.
*/
async function removeRule(rule, ruleType){
  console.log(`Init removeRule(): ${rule.stringRepresentation}, type ${ruleType}`);
  const storageKeysRule = new StorageKeysRule(rule, ruleType);
  let removing = browser.storage.local.remove(
    [
      storageKeysRule.keyOld,
      storageKeysRule.keyNew
    ]
  );
  removing.then(() => {
  }, console.error);
}

// TODO test, use async and use this function when the new rules format is implemented
/*
:param valuesRules.
:param ruleType: str.
*/
function saveRulesNewFormat(valuesRules, ruleType) {
  var gettingRulesType = browser.storage.local.get(ruleType);
  gettingRulesType.then((storedRulesType) => {
    console.log("Init get rulesNewFormat: ");
    let rulesNew = storedRulesType[ruleType];
    if (typeof rulesNew === 'undefined'){
      rulesNew = new Map();
    }
    console.log(rulesNew);
    for (let [valueOld, valueNew] of valuesRules.entries()) {
      rulesNew.set(valueOld, valueNew);
    }
    console.log(`Init saveInfoNewFormat(). Key: ${ruleType}. Values:`)
    console.log(rulesNew)
    var storingInfo = browser.storage.local.set({[ruleType]:rulesNew});
    storingInfo.then(() => {
    }, console.error);
  }, console.error);
}

export {
  getRules,
  removeRule,
  saveRuleIfNew,
  saveRulesNewFormat,
  StorageKeysRule
};
