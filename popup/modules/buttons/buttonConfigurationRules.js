import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleDom from '../../modules/dom.js';

class ButtonConfigurationRules extends ModuleButtonsInterface.ButtonClicked {

  static _buttonIdHtml = 'buttonConfigRules';

  get run() {
    ModuleDom.showOrHideArrayElementsById(['menuRules']);
  }

}


export {
  ButtonConfigurationRules,
}
