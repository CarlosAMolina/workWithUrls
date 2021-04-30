import * as ModuleButtonsDocumentCreator from './buttonsDocumentCreator.js';
import * as ModuleButtonsExceptions from './buttonsExceptions.js';
import * as ModuleButtonsOnOff from './buttonsOnOff.js';

/*
param buttonName: str.
*/
function getButton(buttonName) {
  //console.log(`Button name: ${buttonName}`) //Only for development
  switch (buttonName) {
    case "cancel":
      return new ModuleButtonsDocumentCreator.ButtonCancel().button;
    case "decodeUrls":
      return new ModuleButtonsOnOff.ButtonDecodeUrls();
    case "delete":
      return new ModuleButtonsDocumentCreator.ButtonDelete().button;
    case "edit":
      return new ModuleButtonsDocumentCreator.ButtonEdit().button;
    case "openPaths":
      return new ModuleButtonsOnOff.ButtonOpenPaths();
    case "openRules":
      return new ModuleButtonsOnOff.ButtonOpenRules();
    case "update":
      return new ModuleButtonsDocumentCreator.ButtonUpdate().button;
    default:
      throw new ModuleButtonsExceptions.ButtonNameInvalidException(`Invalid buttonName: ${buttonName}`);
  }
}


export {
  getButton
};
