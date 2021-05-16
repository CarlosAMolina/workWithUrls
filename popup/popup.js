/* References.
- Local storage.
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local
*/


import * as ModuleButtonsFactory from '../popup/modules/buttons/buttonsFactory.js';
import * as ModuleButtonsInterface from '../popup/modules/buttons/buttonsInterface.js';
import * as ModuleButtonsExceptions from '../popup/modules/buttons/buttonsExceptions.js';
import * as ModuleDom from '../popup/modules/dom.js';
import * as ModuleMenuStoredRule from '../popup/modules/menus/menuStoredRule.js';
import * as ModuleRule from '../popup/modules/rules/rule.js';
import * as ModuleRulesInputParser from '../popup/modules/rules/inputParser.js';
import * as ModuleRulesInputReader from '../popup/modules/rules/inputReader.js';
import * as ModuleSleep from '../popup/modules/sleep.js';
import * as ModuleStorageGeneral from '../popup/modules/storage/general.js';
import * as ModuleStorageLazyLoading from '../popup/modules/storage/lazyLoading.js';
import * as ModuleStorageRules from '../popup/modules/storage/rules.js';
import * as ModuleUrlsModifier from '../popup/modules/urlsModifier.js';


// Global constants or variables.
let rules = new ModuleUrlsModifier.Rules();


/*
param urlsModifier: module urlsModifier class urlsModifier instance.
*/
function modifyText(urlsModifier){
  let urls = ModuleDom.getValueElementById('inputUrls').split('\n');
  urls = urlsModifier.modifyUrls(urls).join('\n');
  ModuleDom.setValueToElementById(urls, 'inputUrls');
}

function reportError(error) {
  console.error(`Error: ${error}`);
}


/*
:param rules: Rules.
*/
async function showStoredRulesType(rules){
  console.log(`Init showStoredRulesType() of type ${rules.ruleType}`);
  rules = await ModuleStorageRules.getRules(rules);
  console.log(`Rules of type ${rules.ruleType}:`);
  console.log(rules.ruleTransformationsToUseStringRepresentation);
  for (let rule of rules.ruleTransformationsToUse){
    await ModuleMenuStoredRule.showMenuStoredRule(rule, rules);
  }
}

/* Open an url and catches possible exception.
https://developer.mozilla.org/en-US/docs/Web/API/Window/open
:param url: str, url to check.
:return null.
*/
function openUrl(url){
  try{
    const windowObjectReference = window.open(url);
    console.log('Done open url \'' + url + '\'. Window object reference: ' + windowObjectReference)
  }
  catch(error){
    reportError(error);
  }
}


/* Open URLs and its paths if option checked.
:param: null.
:return: null.
*/
async function openUrls(){
  const lazyLoadingTime = await ModuleStorageLazyLoading.getStorageLazyLoading();
  // Get URLs at the input box.
  let urls = ModuleDom.getValueElementById('inputUrls').split('\n');
  console.log('URLs at the input box: ' + urls)
  if (ModuleDom.isCheckedElementById(ModuleButtonsFactory.getButton("buttonOpenPaths").buttonIdHtml)){
    urls = ModuleUrlsModifier.getUrlsWithPaths(urls);
  }
  // Open URLs.
  var urlsLength = urls.length;
  for (var i = 0; i < urlsLength; i++) { 
    var url = urls[i];
    console.log('Init url ' + (i + 1) + '/' + urlsLength + ': \'' + url + '\'');
    // Check if an empty string was provided.
    // It can have the protocol, example added by the 
    // getUrlsWithPaths function.
    if (url == '' || url == ModuleUrlsModifier.PROTOCOL_DEFAULT){
      console.log('Not URL provided. Omitting');
    } else {
      url = ModuleUrlsModifier.getUrlWithProtocol(url);
      // Only wait between URLs.
      if (i != 0){
        console.log('Init. Wait milliseconds: ' + lazyLoadingTime);
        await ModuleSleep.sleepMs(lazyLoadingTime);
        console.log('Done. Wait milliseconds: ' + lazyLoadingTime);
      }
      console.log(url);
      openUrl(url);
    }
  }
}


// Save input boxes info.
async function saveRules(){

  let valuesRules = ModuleRulesInputReader.getReader(
    ModuleDom.isCheckedElementById(ModuleButtonsFactory.getButton("buttonOpenRules").buttonIdHtml)
  ).rules;
  valuesRules = new ModuleRulesInputParser.RulesParser().getValuesRulesWithCorrectFormat(valuesRules);
  for (let [valueOld, valueNew] of valuesRules.entries()) {
    const rule = new ModuleRule.Rule(valueOld, valueNew);
    if (
      await ModuleStorageRules.saveRuleIfNew(rule, rules.ruleType)
    ) {
      ModuleMenuStoredRule.showMenuStoredRule(rule, rules);
    }
    rules = await ModuleStorageRules.getRules(rules);
  }

  //ModuleStorageRules.saveRulesNewFormat(valuesRules, rules.ruleTypeNew); // TODO replace saveRuleIfNew() with this function.

}

// Clear display/storage.
async function clearStorageInfo() {
  for (let rule of rules.ruleTransformationsToUse) {
    await ModuleStorageRules.removeRule(rule, rules.ruleType);
  }
  notShowRules();
  rules = await ModuleStorageRules.getRules(rules);
}


function notShowRules(){
  while (ModuleDom.getInfoContainer().firstChild) {
    ModuleDom.getInfoContainer().removeChild(ModuleDom.getInfoContainer().firstChild);
  }   
}


function copy2clipboard (idWithInfo){
  ModuleDom.getElementById(idWithInfo).select();
  document.execCommand('copy');
}


function copyRules(){
  if(!ModuleDom.isCheckedElementById(ModuleButtonsFactory.getButton("buttonOpenRules").buttonIdHtml)){
    ModuleButtonsFactory.getButton("buttonOpenRules").switchStyleAndStorageOnOff();
  }
  ModuleDom.setValueToElementById(rules.ruleTransformationsToUseStringRepresentation, 'inputRules');
  copy2clipboard ('inputRules');
}


class ButtonCopy extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonCopy');
  } 

  get run() {
    this.logButtonName;
    if (ModuleDom.getValueElementById('inputUrls') !== ''){
      copy2clipboard('inputUrls');
    } else if (rules.isRuleTypeConfigured()){
      copyRules();
    }
  }

}

class ButtonCleanUrl extends ModuleButtonsInterface.ButtonClicked {
  
  constructor() {
    super('buttonCleanUrl');
  } 

  get run() {
    this.logButtonName;
    let urlsModifier = null;
    rules.setRuleTypeDeobfuscate();
    if (ModuleDom.isCheckedElementById(ModuleButtonsFactory.getButton("buttonDecodeUrls").buttonIdHtml)){
      console.log('Choosen option: decode')
      urlsModifier = ModuleUrlsModifier.urlsModifier();
    } else {
      console.log('Choosen option: deofuscation')
      urlsModifier = ModuleUrlsModifier.urlsModifier(rules.ruleTransformationsInstanceToUse);
    }
    modifyText(urlsModifier);
  }

}

class ButtonObfuscate extends ModuleButtonsInterface.ButtonClicked {
  
  constructor() {
    super('buttonObfuscate');
  } 

  get run() {
    this.logButtonName;
    rules.setRuleTypeObfuscate();
    const urlsModifier = ModuleUrlsModifier.urlsModifier(rules.ruleTransformationsInstanceToUse);
    modifyText(urlsModifier);
  }

}

class ButtonOpenUrls extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonOpenUrls');
  } 

  get run() {
    this.logButtonName;
    openUrls();
  }

}

class ButtonInputObfuscation extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonInputObfuscation');
  } 

  get run() {
    rules.setRuleTypeObfuscate();
    notShowRules();
    showStoredRulesType(rules);
    ModuleDom.setEnabledArrayElementsById(['pInputOld','pInputNew','inputValueOld','inputValueNew','inputRules','buttonAddRule','buttonClearAllRules']);
  }

}

class ButtonInputDeobfuscation extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonInputDeobfuscation');
  } 

  get run() {
    rules.setRuleTypeDeobfuscate();
    notShowRules();
    showStoredRulesType(rules);
    ModuleDom.setEnabledArrayElementsById(['pInputOld','pInputNew','inputValueOld','inputValueNew','inputRules','buttonAddRule','buttonClearAllRules']);
  }

}

class ButtonAddRule extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonAddRule');
  } 

  get run() {
    saveRules();
  }

}

class ButtonClearAllRules extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonClearAllRules');
  } 

  get run() {
    browser.tabs.query({active: true, currentWindow: true})
      .then(clearStorageInfo)
      .catch(console.log)
  } 
}


function createClickedButton(buttonIdHtml) {
  //console.log('ID HTML: ' + buttonIdHtml) //TODO only for development
  switch (buttonIdHtml) {
    case new ButtonCopy().buttonIdHtml:
      return new ButtonCopy();
    case new ButtonCleanUrl().buttonIdHtml:
      return new ButtonCleanUrl();
    case new ButtonOpenUrls().buttonIdHtml:
      return new ButtonOpenUrls();
    case new ButtonObfuscate().buttonIdHtml:
      return new ButtonObfuscate();
    case new ButtonInputDeobfuscation().buttonIdHtml:
      return new ButtonInputDeobfuscation();
    case new ButtonInputObfuscation().buttonIdHtml:
      return new ButtonInputObfuscation();
    case new ButtonAddRule().buttonIdHtml:
      return new ButtonAddRule();
    case new ButtonClearAllRules().buttonIdHtml:
      return new ButtonClearAllRules();    
    default:
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
}


async function popupMain() {

  rules = await ModuleStorageRules.getRules(rules);
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


// There was an error executing the script.
// Display the pop-up's error message, and hide the normal UI.
function reportExecuteScriptError(error) {
  ModuleDom.setHiddenElementById('popup-content');
  ModuleDom.setUnhiddenElementById('error-content');
  console.error(`Error: ${error.message}`);
}

try {
  popupMain();
}
catch (error){
  reportExecuteScriptError(error);
}

//TODO: created only for testing.
export {
  modifyText,
  popupMain,
  reportError,
  reportExecuteScriptError,
  showStoredRulesType
};
