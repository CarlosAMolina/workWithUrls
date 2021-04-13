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

export {
  getRules,
};
