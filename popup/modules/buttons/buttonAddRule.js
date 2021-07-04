import * as ModuleButtonsFactory from '../../modules/buttons/buttonsFactory.js';
import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleDom from '../../modules/dom.js';
import * as ModuleMenuStoredRule from '../../modules/menus/menuStoredRule.js';
import * as ModuleRule from '../../modules/rules/rule.js';
import * as ModuleRulesInputParser from '../../modules/rules/inputParser.js';
import * as ModuleRulesInputReader from '../../modules/rules/inputReader.js';
import * as ModuleStorageRules from '../../modules/storage/rules.js';
import * as ModuleUrlsModifier from '../../modules/urlsModifier.js';


class ButtonAddRule extends ModuleButtonsInterface.ButtonClicked {

  static get _buttonIdHtml() { return 'buttonAddRule'; }

  get run() {
    _saveRules();
  }

}


// Save input boxes info.
async function _saveRules(){

  let valuesRules = ModuleRulesInputReader.getReader(
    ModuleButtonsFactory.getButton("buttonOpenRules").isOn
  ).rules;
  valuesRules = new ModuleRulesInputParser.RulesParser().getValuesRulesWithCorrectFormat(valuesRules);
  for (let [valueOld, valueNew] of valuesRules.entries()) {
    const rule = new ModuleRule.Rule(valueOld, valueNew);
    if (
      await ModuleStorageRules.saveRuleIfNew(rule, ModuleUrlsModifier.Rules.getInstance().ruleType)
    ) {
      ModuleMenuStoredRule.showMenuStoredRule(rule, ModuleUrlsModifier.Rules.getInstance());
    }
    ModuleUrlsModifier.Rules.setInstance(
      await ModuleStorageRules.getRules(ModuleUrlsModifier.Rules.getInstance())
    );
  }

  //ModuleStorageRules.saveRulesNewFormat(valuesRules, rules.ruleTypeNew); // TODO replace saveRuleIfNew() with this function.

}


export {
  ButtonAddRule,
}
