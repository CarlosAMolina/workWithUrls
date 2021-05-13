/* References.
- Local storage.
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local
*/


import * as ModuleButtonsFactory from '../popup/modules/buttons/buttonsFactory.js';
import * as ModuleButtonsInterface from '../popup/modules/buttons/buttonsInterface.js';
import * as ModuleDom from '../popup/modules/dom.js';
import * as ModuleRule from '../popup/modules/rules/rule.js';
import * as ModuleRulesInputParser from '../popup/modules/rules/inputParser.js';
import * as ModuleRulesInputReader from '../popup/modules/rules/inputReader.js';
import * as ModuleSleep from '../popup/modules/sleep.js';
import * as ModuleStorageGeneral from '../popup/modules/storage/general.js';
import * as ModuleStorageLazyLoading from '../popup/modules/storage/lazyLoading.js';
import * as ModuleStorageRules from '../popup/modules/storage/rules.js';
import * as ModuleUrlsModifier from './modules/urlsModifier.js';


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

class EntryValue {

  /*
  :param rule: Rule.
  */
  constructor(rule) {
    this._rule = rule;
  }


  get entry() {
    let entry = document.createElement('p');
    entry.setAttribute('style','margin-left: 75px');
    entry.textContent = this._rule.valueOld + ' ---> ' + this._rule.valueNew;
    return entry;
  }
}

class InputEntryValue {
  get entry() {
    let entry = document.createElement('input');
    entry.setAttribute('class','input');
    entry.setAttribute('style','width:30%');
    return entry;
  }
}

class ElementClearFix {
  get element() {
    let element = document.createElement('div'); // for background color and correct position
    element.setAttribute('class','clearfix');
    return element;
  }
}

/* Display info.
:param rule: Rule.
*/

function showStoredInfo(rule) {

  // Display box.
  let deleteBtn = ModuleButtonsFactory.getButton("delete");
  let editBtn = ModuleButtonsFactory.getButton("edit");
  let entryValue = new EntryValue(rule).entry;
  let entry = document.createElement('div');
  let entryDisplay = document.createElement('div');
  entryDisplay.appendChild(deleteBtn);
  entryDisplay.appendChild(editBtn);
  entryDisplay.appendChild(entryValue);
  entryDisplay.appendChild(new ElementClearFix().element);
  entry.appendChild(entryDisplay);

  ModuleDom.getInfoContainer().appendChild(entry);

  // edit box
  let cancelBtn = ModuleButtonsFactory.getButton("cancel");
  let entryEdit = document.createElement('div');
  let entryEditInputValueOld = new InputEntryValue().entry;
  let entryEditInputValueNew = new InputEntryValue().entry; 
  let updateBtn = ModuleButtonsFactory.getButton("update");
  entryEdit.appendChild(entryEditInputValueOld);
  entryEdit.appendChild(entryEditInputValueNew);
  entryEdit.appendChild(updateBtn);
  entryEdit.appendChild(cancelBtn);
  entryEdit.appendChild(new ElementClearFix().element);
  entry.appendChild(entryEdit);

  entryEdit.style.display = 'none';
  entryEditInputValueOld.value = rule.valueOld;
  entryEditInputValueNew.value = rule.valueNew;

  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    storageRemoveRule(rule, rules.ruleType);
    rules.deleteRule(rule)
  })

  // set up listeners for the buttons

  entryValue.addEventListener('click',() => {
    entryDisplay.style.display = 'none';
    entryEdit.style.display = 'block';
  })

  editBtn.addEventListener('click',() => {
    entryDisplay.style.display = 'none';
    entryEdit.style.display = 'block';
  })

  cancelBtn.addEventListener('click',() => {
    entryDisplay.style.display = 'block';
    entryEdit.style.display = 'none';
  })

  updateBtn.addEventListener('click',() => {
    const ruleNew = new ModuleRule.Rule(entryEditInputValueOld.value, entryEditInputValueNew.value);
    _updateRule(rule, ruleNew, rules.ruleType);
  });

  async function _updateRule(rule, ruleNew, ruleType) {
    const storageKeysRuleNew = new ModuleStorageRules.StorageKeysRule(ruleNew, ruleType);
    if (
      (await ModuleStorageGeneral.isKeyStored(storageKeysRuleNew.keyOld) === false)
      || (
        (rule.valueOld == ruleNew.valueOld)
        && (rule.valueNew != ruleNew.valueNew)
      )
    ) {
        storageRemoveRule(rule, ruleType);
        storageSaveRuleIfNew(ruleNew, ruleType);
        rules.updateRule(rule, ruleNew);
        entry.parentNode.removeChild(entry);
        showStoredInfo(ruleNew);
      }
  }

  async function storageRemoveRule(rule, ruleType) {
    await ModuleStorageRules.removeRule(rule, ruleType);
  }

  async function storageSaveRuleIfNew(rule, ruleType) {
    await ModuleStorageRules.saveRuleIfNew(rule, ruleType);
  }

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
    showStoredInfo(rule);
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
  if (ModuleDom.isCheckedElementById(ModuleButtonsFactory.getButton("openPaths").buttonIdHtml)){
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

/*
return number int or false.
*/
function getValidLazyLoadingTimeToSaveAndNotifyBadValue(){
  let lazyLoadingTimeToSave = ModuleDom.getValueElementById('inputLazyLoading');
  // Convert input to type number.
  // Example: 1a -> 1, 1.1 -> 1, a1 -> Nan
  lazyLoadingTimeToSave = parseInt(lazyLoadingTimeToSave);
  // Check value is a number.
  if (isNaN(lazyLoadingTimeToSave)) {
    console.log('Error. Lazy loading time is not a number');
    ModuleDom.setStyleBoxErrorToElementById('inputLazyLoading');
    lazyLoadingTimeToSave = false;
  }
  else {
    // Quit possible previous red error border.
    ModuleDom.unsetStyleBoxErrorToElementById('inputLazyLoading');
    // Set value >= 0. Type number.
    lazyLoadingTimeToSave = Math.abs(lazyLoadingTimeToSave)
    console.log('Lazy loading time to save: \'' + lazyLoadingTimeToSave + '\'');
    ModuleDom.setValueToElementById(lazyLoadingTimeToSave, 'inputLazyLoading');
  }
  return lazyLoadingTimeToSave
}


// Save input boxes info.
async function saveRules(){

  let valuesRules = ModuleRulesInputReader.getReader(
    ModuleDom.isCheckedElementById(ModuleButtonsFactory.getButton("openRules").buttonIdHtml)
  ).rules;
  valuesRules = new ModuleRulesInputParser.RulesParser().getValuesRulesWithCorrectFormat(valuesRules);
  for (let [valueOld, valueNew] of valuesRules.entries()) {
    const rule = new ModuleRule.Rule(valueOld, valueNew);
    if (
      await ModuleStorageRules.saveRuleIfNew(rule, rules.ruleType)
    ) {
      showStoredInfo(rule);
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
  if(!ModuleDom.isCheckedElementById(ModuleButtonsFactory.getButton("openRules").buttonIdHtml)){
    ModuleButtonsFactory.getButton("openRules").switchStyleAndStorageOnOff();
  }
  ModuleDom.setValueToElementById(rules.ruleTransformationsToUseStringRepresentation, 'inputRules');
  copy2clipboard ('inputRules');
}


class ButtonConfigurationLazyLoading extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonConfigLazyLoading');
  } 

  get run() {
    this.runAsync();
  }

  async runAsync(){
    const lazyLoadingTime = await ModuleStorageLazyLoading.getStorageLazyLoading();
    ModuleDom.showOrHideArrayElementsById(['menuLazyLoading']);
    ModuleDom.setValueToElementById(lazyLoadingTime, 'inputLazyLoading');
  }

}

class ButtonConfigurationRules extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonConfigRules');
  } 

  get run() {
    ModuleDom.showOrHideArrayElementsById(['menuRules']);
  }

}

class ButtonConfiguration extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonShowConfig');
  } 

  get run() {
    this.logButtonName;
    ModuleDom.showOrHideArrayElementsById(['menuConfig']);
    if (!ModuleDom.isHiddenElementById('menuRules')) {
      ModuleDom.setHiddenElementById('menuRules');
    }
  }

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
    if (ModuleDom.isCheckedElementById(ModuleButtonsFactory.getButton("decodeUrls").buttonIdHtml)){
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

class ButtonAddLazyLoading extends ModuleButtonsInterface.ButtonClicked {

  constructor() {
    super('buttonAddLazyLoading');
  } 

  get run() {
    const lazyLoadingTimeToSave = getValidLazyLoadingTimeToSaveAndNotifyBadValue();
    if (lazyLoadingTimeToSave !== false) {
      ModuleStorageLazyLoading.setStorageLazyLoading(lazyLoadingTimeToSave);
    }
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
    case new ButtonConfiguration().buttonIdHtml:
      return new ButtonConfiguration();
    case new ButtonCopy().buttonIdHtml:
      return new ButtonCopy();
    case new ButtonCleanUrl().buttonIdHtml:
      return new ButtonCleanUrl();
    case new ButtonOpenUrls().buttonIdHtml:
      return new ButtonOpenUrls();
    case new ButtonObfuscate().buttonIdHtml:
      return new ButtonObfuscate();
    case ModuleButtonsFactory.getButton("openPaths").buttonIdHtml:
      return ModuleButtonsFactory.getButton("openPaths");
    case new ButtonConfigurationLazyLoading().buttonIdHtml:
      return new ButtonConfigurationLazyLoading();
    case new ButtonAddLazyLoading().buttonIdHtml:
      return new ButtonAddLazyLoading();
    case new ButtonConfigurationRules().buttonIdHtml:
      return new ButtonConfigurationRules();
    case new ButtonInputDeobfuscation().buttonIdHtml:
      return new ButtonInputDeobfuscation();
    case new ButtonInputObfuscation().buttonIdHtml:
      return new ButtonInputObfuscation();
    case ModuleButtonsFactory.getButton("decodeUrls").buttonIdHtml:
      return ModuleButtonsFactory.getButton("decodeUrls");
    case ModuleButtonsFactory.getButton("openRules").buttonIdHtml:
      return ModuleButtonsFactory.getButton("openRules");
    case new ButtonAddRule().buttonIdHtml:
      return new ButtonAddRule();
    case new ButtonClearAllRules().buttonIdHtml:
      return new ButtonClearAllRules();    
    default:
      return false;
  }
}


async function popupMain() {

  rules = await ModuleStorageRules.getRules(rules);
  ModuleButtonsFactory.getButton("decodeUrls").setStylePrevious();
  ModuleButtonsFactory.getButton("openPaths").setStylePrevious();
  ModuleButtonsFactory.getButton("openRules").setStylePrevious();

  document.addEventListener('click', (e) => {
    const buttonIdHtml = getIdHtmlOfClickedButtonOrImageFromEventClick(e);
    const buttonClicked = createClickedButton(buttonIdHtml)
    if (buttonClicked){
      buttonClicked.run;
      ModuleButtonsFactory.getButton("openRules").showOrHideRuleOrRules();
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
  showStoredInfo,
  showStoredRulesType
};
