import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleOpenUrls from '../../modules/openUrls.js';


class ButtonOpenUrls extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonOpenUrls');
  } 

  get run() {
    this.logButtonName;
    ModuleOpenUrls.openUrls();
  }

}


export {
  ButtonOpenUrls,
}
