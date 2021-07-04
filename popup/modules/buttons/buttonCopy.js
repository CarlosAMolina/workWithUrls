import * as ModuleButtonsFactory from '../../modules/buttons/buttonsFactory.js';
import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleDom from '../../modules/dom.js';
import * as ModuleUrlsModifier from '../../modules/urlsModifier.js';


class ButtonCopy extends ModuleButtonsInterface.ButtonClicked {

  static get _buttonIdHtml() { return 'buttonCopy'; }

  get run() {
    this.logButtonName;
    if (ModuleDom.getValueElementById('inputUrls') !== ''){
      _copyToClipboard('inputUrls');
    } else if (ModuleUrlsModifier.Rules.getInstance().isRuleTypeConfigured()){
      _copyRules();
    }
  }

}


function _copyToClipboard (idWithInfo){
  ModuleDom.getElementById(idWithInfo).select();
  document.execCommand('copy');
}


function _copyRules(){
  if(!ModuleButtonsFactory.getButton("buttonOpenRules").isOn){
    ModuleButtonsFactory.getButton("buttonOpenRules").switchStyleAndStorageOnOff();
  }
  ModuleDom.setValueToElementById(
    ModuleUrlsModifier.Rules.getInstance().ruleTransformationsToUseStringRepresentation,
    'inputRules'
  );
  _copyToClipboard('inputRules');
}


export {
  ButtonCopy,
}
