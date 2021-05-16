import * as ModuleButtonsExceptions from '../popup/modules/buttons/buttonsExceptions.js';
import * as ModuleButtonsFactory from '../popup/modules/buttons/buttonsFactory.js';
import * as ModuleDom from '../popup/modules/dom.js';
import * as ModuleStorageRules from '../popup/modules/storage/rules.js';
import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';


try {
  popupMain();
}
catch (error){
  reportExecuteScriptError(error);
}


async function popupMain() {

  let rules = new ModuleUrlsModifier.Rules();
  ModuleUrlsModifier.Rules.setInstance(
    await ModuleStorageRules.getRules(ModuleUrlsModifier.Rules.getInstance())
  );
  ModuleButtonsFactory.getButton("buttonDecodeUrls").setStylePrevious();
  ModuleButtonsFactory.getButton("buttonOpenPaths").setStylePrevious();
  ModuleButtonsFactory.getButton("buttonOpenRules").setStylePrevious();

  document.addEventListener('click', (e) => {
    const buttonIdHtml = getIdHtmlOfClickedButtonOrImageFromEventClick(e);
    const buttonClicked = createClickedButton(buttonIdHtml)
    if (buttonClicked){
      buttonClicked.run;
      ModuleButtonsFactory.getButton("buttonOpenRules").showOrHideRuleOrRules();
    }// else { //TODO logs only for development
    //  console.error("Invalid clicked button:");
    //  console.error(e.target);
    //  console.error(e.target.classList);
    //}
  });

}


function getIdHtmlOfClickedButtonOrImageFromEventClick(eventClick){
  return eventClick.target.id || eventClick.target.parentElement.id;
}


function createClickedButton(buttonIdHtml) {
  //console.log('ID HTML: ' + buttonIdHtml) //TODO only for development
  try {
    return ModuleButtonsFactory.getButton(buttonIdHtml);
  } catch(exception) {
    if (exception.name !== ModuleButtonsExceptions.ButtonNameInvalidException.name) {
      throw exception;
    } else {
      console.log(`The clicked element is not a button: ${buttonIdHtml}`);
    }
  }
}


// There was an error executing the script.
// Display the pop-up's error message, and hide the normal UI.
function reportExecuteScriptError(error) {
  ModuleDom.setHiddenElementById('popup-content');
  ModuleDom.setUnhiddenElementById('error-content');
  console.error(`Error: ${error.message}`);
}


//TODO: created only for testing.
export {
  popupMain,
  reportExecuteScriptError,
};
