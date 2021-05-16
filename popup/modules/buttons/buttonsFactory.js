import * as ModuleButtonConfiguration from './buttonConfiguration.js';
import * as ModuleButtonConfigurationRules from './buttonConfigurationRules.js';
import * as ModuleButtonsDinamic from './buttonsDinamic.js';
import * as ModuleButtonsExceptions from './buttonsExceptions.js';
import * as ModuleButtonsLazyLoading from './buttonsLazyLoading.js';
import * as ModuleButtonsOnOff from './buttonsOnOff.js';


/*
param buttonId: str.
*/
function getButton(buttonId) {
  //console.log(`Button ID: ${buttonId}`) //Only for development
  switch (buttonId) {
    case "cancel":
      return new ModuleButtonsDinamic.ButtonCancel().button;
    case "delete":
      return new ModuleButtonsDinamic.ButtonDelete().button;
    case "edit":
      return new ModuleButtonsDinamic.ButtonEdit().button;
    case "update":
      return new ModuleButtonsDinamic.ButtonUpdate().button;
    case new ModuleButtonConfiguration.ButtonConfiguration().buttonIdHtml:
      return new ModuleButtonConfiguration.ButtonConfiguration();
    case new ModuleButtonConfigurationRules.ButtonConfigurationRules().buttonIdHtml:
      return new ModuleButtonConfigurationRules.ButtonConfigurationRules();
    case new ModuleButtonsLazyLoading.ButtonAddLazyLoading().buttonIdHtml:
      return new ModuleButtonsLazyLoading.ButtonAddLazyLoading();
    case new ModuleButtonsLazyLoading.ButtonConfigurationLazyLoading().buttonIdHtml:
      return new ModuleButtonsLazyLoading.ButtonConfigurationLazyLoading();
    case new ModuleButtonsOnOff.ButtonDecodeUrls().buttonIdHtml:
      return new ModuleButtonsOnOff.ButtonDecodeUrls();
    case new ModuleButtonsOnOff.ButtonOpenPaths().buttonIdHtml:
      return new ModuleButtonsOnOff.ButtonOpenPaths();
    case new ModuleButtonsOnOff.ButtonOpenRules().buttonIdHtml:
      return new ModuleButtonsOnOff.ButtonOpenRules();
    default:
      throw new ModuleButtonsExceptions.ButtonNameInvalidException(`Invalid buttonId: ${buttonId}`);
  }
}


export {
  getButton,
};
