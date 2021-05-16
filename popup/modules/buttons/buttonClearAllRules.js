import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleDomRules from '../../modules/dom/rules.js';
import * as ModuleStorageRules from '../../modules/storage/rules.js';
import * as ModuleUrlsModifier from '../../modules/urlsModifier.js';


class ButtonClearAllRules extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonClearAllRules');
  } 

  get run() {
    browser.tabs.query({active: true, currentWindow: true})
      .then(clearStorageInfo)
      .catch(console.error)
  } 
}


// Clear display/storage.
async function clearStorageInfo() {
  for (let rule of ModuleUrlsModifier.Rules.getInstance().ruleTransformationsToUse) {
    await ModuleStorageRules.removeRule(
      rule,
      ModuleUrlsModifier.Rules.getInstance().ruleType
    );
  }
  ModuleDomRules.notShowRules();
  ModuleUrlsModifier.Rules.setInstance(
    await ModuleStorageRules.getRules(ModuleUrlsModifier.Rules.getInstance())
  );
}


export {
  ButtonClearAllRules,
}
