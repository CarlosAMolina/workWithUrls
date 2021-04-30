import * as ModuleButtonsDinamic from './buttonsDinamic.js';
import * as ModuleButtonsExceptions from './buttonsExceptions.js';
import * as ModuleButtonsOnOff from './buttonsOnOff.js';

/*
param buttonName: str.
*/
function getButton(buttonName) {
  //console.log(`Button name: ${buttonName}`) //Only for development
  switch (buttonName) {
    case "cancel":
      return new ModuleButtonsDinamic.ButtonCancel().button;
    case "decodeUrls":
      return new ModuleButtonsOnOff.ButtonDecodeUrls();
    case "delete":
      return new ModuleButtonsDinamic.ButtonDelete().button;
    case "edit":
      return new ModuleButtonsDinamic.ButtonEdit().button;
    case "openPaths":
      return new ModuleButtonsOnOff.ButtonOpenPaths();
    case "openRules":
      return new ModuleButtonsOnOff.ButtonOpenRules();
    case "update":
      return new ModuleButtonsDinamic.ButtonUpdate().button;
    default:
      throw new ModuleButtonsExceptions.ButtonNameInvalidException(`Invalid buttonName: ${buttonName}`);
  }
}


export {
  getButton
};
