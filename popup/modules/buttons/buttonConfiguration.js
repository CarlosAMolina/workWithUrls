import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleDom from '../../modules/dom.js';

class ButtonConfiguration extends ModuleButtonsInterface.ButtonClicked {

  static get _buttonIdHtml() { return 'buttonShowConfig'; }

  get run() {
    this.logButtonName;
    ModuleDom.showOrHideArrayElementsById(['menuConfig']);
    if (!ModuleDom.isHiddenElementById('menuRules')) {
      ModuleDom.setHiddenElementById('menuRules');
    }
  }

}

export {
  ButtonConfiguration,
}
