import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleTextModifier from '../../modules/textModifier.js';
import * as ModuleUrlsModifier from '../../modules/urlsModifier.js';


class ButtonObfuscate extends ModuleButtonsInterface.ButtonClicked {
  
  static get _buttonIdHtml() { return 'buttonObfuscate'; }

  get run() {
    this.logButtonName;
    ModuleUrlsModifier.Rules.getInstance().setRuleTypeObfuscate();
    const urlsModifier = ModuleUrlsModifier.urlsModifier(
      ModuleUrlsModifier.Rules.getInstance().ruleTransformationsInstanceToUse
    );
    ModuleTextModifier.modifyText(urlsModifier);
  }

}


export {
  ButtonObfuscate,
}
