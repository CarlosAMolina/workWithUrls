import * as ModuleButtonAddRule from './buttonAddRule.js';
import * as ModuleButtonCleanUrl from './buttonCleanUrl.js';
import * as ModuleButtonClearAllRules from './buttonClearAllRules.js';
import * as ModuleButtonConfiguration from './buttonConfiguration.js';
import * as ModuleButtonConfigurationRules from './buttonConfigurationRules.js';
import * as ModuleButtonCopy from './buttonCopy.js';
import * as ModuleButtonObfuscate from './buttonObfuscate.js';
import * as ModuleButtonOpenUrls from './buttonOpenUrls.js';
import * as ModuleButtonsDinamic from './buttonsDinamic.js';
import * as ModuleButtonsExceptions from './buttonsExceptions.js';
import * as ModuleButtonsLazyLoading from './buttonsLazyLoading.js';
import * as ModuleButtonsOnOff from './buttonsOnOff.js';
import * as ModuleButtonsRulesType from './buttonsRulesType.js';


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
    case new ModuleButtonAddRule.ButtonAddRule().buttonIdHtml:
      return new ModuleButtonAddRule.ButtonAddRule();
    case new ModuleButtonCleanUrl.ButtonCleanUrl().buttonIdHtml:
      return new ModuleButtonCleanUrl.ButtonCleanUrl();
    case new ModuleButtonClearAllRules.ButtonClearAllRules().buttonIdHtml:
      return new ModuleButtonClearAllRules.ButtonClearAllRules();    
    case new ModuleButtonCopy.ButtonCopy().buttonIdHtml:
      return new ModuleButtonCopy.ButtonCopy();
    case new ModuleButtonConfiguration.ButtonConfiguration().buttonIdHtml:
      return new ModuleButtonConfiguration.ButtonConfiguration();
    case new ModuleButtonConfigurationRules.ButtonConfigurationRules().buttonIdHtml:
      return new ModuleButtonConfigurationRules.ButtonConfigurationRules();
    case new ModuleButtonObfuscate.ButtonObfuscate().buttonIdHtml:
      return new ModuleButtonObfuscate.ButtonObfuscate();
    case new ModuleButtonOpenUrls.ButtonOpenUrls().buttonIdHtml:
      return new ModuleButtonOpenUrls.ButtonOpenUrls();
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
    case new ModuleButtonsRulesType.ButtonInputDeobfuscation().buttonIdHtml:
      return new ModuleButtonsRulesType.ButtonInputDeobfuscation();
    case new ModuleButtonsRulesType.ButtonInputObfuscation().buttonIdHtml:
      return new ModuleButtonsRulesType.ButtonInputObfuscation();
    default:
      throw new ModuleButtonsExceptions.ButtonNameInvalidException(`Invalid buttonId: ${buttonId}`);
  }
}


export {
  getButton,
};
