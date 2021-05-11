import * as ModuleUrlsModifier from '../urlsModifier.js';


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
    var keysRuleOld = Object.keys(storedItems).filter(key => key.includes(ruleType+'_old_')); //array
    var rules2SaveOld = keysRuleOld.map(keysRuleOld => storedItems[keysRuleOld]); // array
    var keysRuleNew = Object.keys(storedItems).filter(key => key.includes(ruleType+'_new_')); //array
    var rules2SaveNew = keysRuleNew.map(keysRuleNew => storedItems[keysRuleNew]); // array
    let ruleTransformations = new ModuleUrlsModifier.RuleTransformations(rules2SaveOld, rules2SaveNew); 
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

  const ids2save = [
    `${ruleType}_old_${rule.valueOld}`,
    `${ruleType}_new_${rule.valueOld}`
  ];
  
  let storedItem;
  try {
    // Empty object if the searched value is not stored.
    storedItem = await browser.storage.local.get(ids2save[0]);
  } catch(e) {
    console.error(e)
    return false;
  }
  const searchInStorage = Object.keys(storedItem); // array with the searched value if it is stored
  if(searchInStorage.length < 1) { // searchInStorage.length < 1 -> no stored
    saveInfo(ids2save, rule);
    return true;
  }
  return false;

  function saveInfo(ids2save, rule) {
    console.log(`Init saveInfo(). ids2save: '${ids2save}'. rule: ${rule.stringRepresentation}`);
    var storingInfo = browser.storage.local.set(
      {
        [ids2save[0]]: rule.valueOld,
        [ids2save[1]]: rule.valueNew
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
  let removing = browser.storage.local.remove(
      [
        ruleType+'_old_'+rule.valueOld,
        ruleType+'_new_'+rule.valueOld
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
  saveRulesNewFormat
};
