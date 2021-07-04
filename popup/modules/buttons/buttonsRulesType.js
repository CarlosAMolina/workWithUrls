import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleDom from '../../modules/dom.js';
import * as ModuleDomRules from '../../modules/dom/rules.js';
import * as ModuleMenuStoredRule from '../../modules/menus/menuStoredRule.js';
import * as ModuleUrlsModifier from '../../modules/urlsModifier.js';


const _elementsIdToEnable = ['pInputOld','pInputNew','inputValueOld','inputValueNew','inputRules','buttonAddRule','buttonClearAllRules'];


class ButtonInputDeobfuscation extends ModuleButtonsInterface.ButtonClicked {

  static get _buttonIdHtml() { return 'buttonInputDeobfuscation'; }

  get run() {
    ModuleUrlsModifier.Rules.getInstance().setRuleTypeDeobfuscate();
    ModuleDomRules.notShowRules();
    ModuleMenuStoredRule.showStoredRulesType(ModuleUrlsModifier.Rules.getInstance());
    ModuleDom.setEnabledArrayElementsById(_elementsIdToEnable);
  }

}


class ButtonInputObfuscation extends ModuleButtonsInterface.ButtonClicked {

  static get _buttonIdHtml() { return 'buttonInputObfuscation'; }

  get run() {
    ModuleUrlsModifier.Rules.getInstance().setRuleTypeObfuscate();
    ModuleDomRules.notShowRules();
    ModuleMenuStoredRule.showStoredRulesType(ModuleUrlsModifier.Rules.getInstance());
    ModuleDom.setEnabledArrayElementsById(_elementsIdToEnable);
  }

}


export {
  ButtonInputObfuscation,
  ButtonInputDeobfuscation,
}
