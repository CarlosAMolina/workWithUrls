import * as ModuleButtonsFactory from '../../modules/buttons/buttonsFactory.js';
import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleDom from '../../modules/dom.js';
import * as ModuleTextModifier from '../../modules/textModifier.js';
import * as ModuleUrlsModifier from '../../modules/urlsModifier.js';


class ButtonCleanUrl extends ModuleButtonsInterface.ButtonClicked {
  
  constructor() {
    super('buttonCleanUrl');
  } 

  get run() {
    this.logButtonName;
    let urlsModifier = null;
    ModuleUrlsModifier.Rules.getInstance().setRuleTypeDeobfuscate();
    if (ModuleButtonsFactory.getButton("buttonDecodeUrls").isOn){
      console.log('Choosen option: decode')
      urlsModifier = ModuleUrlsModifier.urlsModifier();
    } else {
      console.log('Choosen option: deofuscation')
      urlsModifier = ModuleUrlsModifier.urlsModifier(
        ModuleUrlsModifier.Rules.getInstance().ruleTransformationsInstanceToUse
      );
    }
    ModuleTextModifier.modifyText(urlsModifier);
  }

}


export {
  ButtonCleanUrl,
}
