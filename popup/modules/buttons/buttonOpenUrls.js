import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleOpenUrls from '../../modules/openUrls.js';


class ButtonOpenUrls extends ModuleButtonsInterface.ButtonClicked {

  static _buttonIdHtml = 'buttonOpenUrls';

  get run() {
    this.logButtonName;
    ModuleOpenUrls.openUrls();
  }

}


export {
  ButtonOpenUrls,
}
