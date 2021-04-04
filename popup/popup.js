/* References.
- Local storage.
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local
*/


import * as ModuleButtons from '../popup/modules/buttons.js';
import * as ModuleDom from '../popup/modules/dom.js';
import * as ModuleSleep from '../popup/modules/sleep.js';
import * as ModuleUrlsModifier from './modules/urlsModifier.js';


// Global constants or variables.
const PROTOCOL_DEFAULT = 'http://'
let rules = new ModuleUrlsModifier.Rules();


/*
param urlsModifier: module urlsModifier class urlsModifier instance.
*/
function modifyText(urlsModifier){
  let urls = ModuleDom.getValueElementById('inputUrls').split('\n');
  urls = urlsModifier.modifyUrls(urls).join('\n');
  ModuleDom.setValueToElementById(urls, 'inputUrls');
}


function showOrHideRuleOrRules() {
  browser.storage.local.get(new ModuleButtons.ButtonOpenRules().buttonIdStorage).then((result) => {
    if (result[new ModuleButtons.ButtonOpenRules().buttonIdStorage]){
      ModuleDom.setHiddenElementById('divInputRule');
      ModuleDom.setUnhiddenElementById('divInputRules');
    } else {
      ModuleDom.setUnhiddenElementById('divInputRule');
      ModuleDom.setHiddenElementById('divInputRules');
    }
  }, console.error);
}


function reportError(error) {
  console.error(`Error: ${error}`);
}

/* Get Lazy Loading time value at the storage.
:param: no param.
:return: int.
*/
async function getStorageLazyLoading(){
  let lazyLoadingTime = 0;
  let resultGetStorage = {};
  try {
    resultGetStorage = await browser.storage.local.get('idLazyLoadingTime');
  } catch(e) {
    console.error(e)
  }
  if ( (typeof resultGetStorage.idLazyLoadingTime == 'undefined') ){
    console.log('Not previous stored lazy loading time value stored');
  } else{
    lazyLoadingTime = resultGetStorage.idLazyLoadingTime;
  }
  console.log('Lazy loading time to use: ' + lazyLoadingTime);
  return lazyLoadingTime;
}


// Display info.
function showStoredInfo(eValues) {
  // Display box.
  var entry = document.createElement('div');
  var entryDisplay = document.createElement('div');
  var entryValue = document.createElement('p');
  var editBtn = document.createElement('button');
  var deleteBtn = document.createElement('button');
  var clearFix = document.createElement('div'); // for background color and correct position
  deleteBtn.textContent = 'Delete';
  deleteBtn.innerHTML = '<img src="/icons/trash.png"/>';
  editBtn.textContent = 'Edit';
  editBtn.innerHTML = '<img src="/icons/edit.png"/>';
  clearFix.setAttribute('class','clearfix');
  deleteBtn.setAttribute('title','Delete');
  deleteBtn.setAttribute('class','floatLeft button');
  editBtn.setAttribute('title','Edit');
  editBtn.setAttribute('class','floatLeft button');
  entryValue.setAttribute('style','margin-left: 75px');
  entry.appendChild(entryDisplay);
  entryDisplay.appendChild(deleteBtn);
  entryDisplay.appendChild(editBtn);
  entryDisplay.appendChild(entryValue);
  entryDisplay.appendChild(clearFix);

  entryValue.textContent = eValues[0] + ' ---> ' + eValues[1];
  ModuleDom.getInfoContainer().appendChild(entry);

  // edit box
  var cancelBtn = document.createElement('button');
  var clearFix2 = document.createElement('div');
  var entryEdit = document.createElement('div');
  var entryEditInputOldValue = document.createElement('input');
  var entryEditInputNewValue = document.createElement('input');
  var updateBtn = document.createElement('button');
  cancelBtn.innerHTML = '<img src="/icons/cancel.png"/>';
  cancelBtn.setAttribute('title','Cancel update');
  cancelBtn.setAttribute('class','floatLeft button');
  clearFix2.setAttribute('class','clearfix');
  entry.appendChild(entryEdit);
  entryEdit.appendChild(entryEditInputOldValue);
  entryEdit.appendChild(entryEditInputNewValue);
  entryEdit.appendChild(updateBtn);
  entryEdit.appendChild(cancelBtn);
  entryEdit.appendChild(clearFix2);
  entryEditInputOldValue.setAttribute('class','input');
  entryEditInputOldValue.setAttribute('style','width:30%');
  entryEditInputNewValue.setAttribute('class','input');
  entryEditInputNewValue.setAttribute('style','width:30%');
  updateBtn.innerHTML = '<img src="/icons/ok.png"/>';
  updateBtn.setAttribute('title','Update');
  updateBtn.setAttribute('class','floatLeft button');

  entryEdit.style.display = 'none';
  entryEditInputOldValue.value = eValues[0];
  entryEditInputNewValue.value = eValues[1];

  // set up listener for the delete functionality
  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove([rules.ruleType+'_old_'+eValues[0], rules.ruleType+'_new_'+eValues[0]]);
    rules.deleteRuleTransformation(new ModuleUrlsModifier.RuleTransformation(eValues[0], eValues[1]))
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
    var eKeys2change = [rules.ruleType + '_old_' + eValues[0], rules.ruleType + '_new_' + eValues[0]];
    var values2save = [entryEditInputOldValue.value, entryEditInputNewValue.value];
    var ids2save = [rules.ruleType + '_old_' + values2save[0], rules.ruleType + '_new_' + values2save[0]];
    var gettingItem = browser.storage.local.get(ids2save[0]);
    gettingItem.then((storedItem) => { // result: empty object if the searched value is not stored
      var searchInStorage = Object.keys(storedItem); // array with the searched value if it is stored
      if( (searchInStorage.length < 1) || ( (eKeys2change[0] == ids2save[0]) && (eValues[1] != values2save[1]) ) ) { // searchInStorage.length < 1 -> no stored
        updateValue(eKeys2change, ids2save, values2save);
        rules.updateRuleTransformation(
          new ModuleUrlsModifier.RuleTransformation(eValues[0], eValues[1]),
          new ModuleUrlsModifier.RuleTransformation(values2save[0], values2save[1])
        )
        entry.parentNode.removeChild(entry);
        showStoredInfo(values2save);
      }
    });

    function updateValue(ids2change, ids2save, values2save) {
      for (var i = 0; i < 2; i++) {
        browser.storage.local.remove(ids2change[i]);
        var storingInfo = browser.storage.local.set({ [ids2save[i]] : values2save[i] });
        storingInfo.then(() => {
        }, reportError);
      }
    }
  });

}

function showStoredRulesType(){
  console.log('Init showStoredRulesType()')
  var gettingAllStoredItems = browser.storage.local.get(null);
  gettingAllStoredItems.then((storedItems) => {
    console.log('storedItems:')
    console.log(storedItems)
    // Get keys of the dictionary for the current rule type
    // (ofuscation or deofuscation) with the terms 
    // (last part of each key) that must be replaced.
    var keysRuleTypeOld = Object.keys(storedItems).filter(key => key.includes(rules.ruleType+'_old')); //array
    console.log('keysRuleTypeOld:')
    console.log(keysRuleTypeOld)
    // Get values of the dictionary to replace last term 
    // of the previous keys.
    var valuesRuleTypeOld = keysRuleTypeOld.map(keysRuleTypeOld => storedItems[keysRuleTypeOld]); // array
    console.log('valuesRuleTypeOld:')
    console.log(valuesRuleTypeOld)
    for (var i = 0; i < valuesRuleTypeOld.length; i+=1) {
      var values2show = [valuesRuleTypeOld[i], storedItems[rules.ruleType+'_new_'+valuesRuleTypeOld[i]]];
      console.log('values2show:')
      console.log(values2show)
      showStoredInfo(values2show);
    }
    console.log('valuesRuleNewFormat:')
    console.log(storedItems[rules.ruleTypeNew]);
  }, reportError);
}

/* If the URL has not got protocol, add one.
:param url: str, url to check.
:return url: str, url with protocol.
*/
function getUrlWithProtocol(url){
  if (url.substring(0, 4).toLowerCase() != 'http'){
    return PROTOCOL_DEFAULT + url;
  }
  return url;
}

/* Get all URLs quitting last part path until no more parts available.
Example. For 'http://github.com/CarlosAMolina' two URLs will be 
created: 'http://github.com/CarlosAMolina' and 'http://github.com'.
:param urls: list of strings, URLs to work with.
:return urls_paths: list of strings, all possible URLs omitting
  parts of the paths.
*/
function getUrlsWithPaths(urls){
  // Variable with results.
  var urls_paths = []
  for (let url of urls) {
    // Quit last slash.
    if (url.slice(-1) == '/'){
      url = url.substring(0, url.length -1);
    }
    // Loop all parts of the path until no more parts.
    while (url.slice(-1) != '/') {
      url = getUrlWithProtocol(url)
      urls_paths.push(url)
      if ( url.indexOf('/') != -1 ){
        // Quit last path parth.
        url = url.slice(0, url.lastIndexOf('/'));
      }
      else {
        // Character to stop the while loop.
        url = '/';
      }
    }
  }
  console.log('URLs with all paths: ' + urls_paths)
  return urls_paths;
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
  const lazyLoadingTime = await getStorageLazyLoading();
  // Get URLs at the input box.
  let urls = ModuleDom.getValueElementById('inputUrls').split('\n');
  console.log('URLs at the input box: ' + urls)
  if (ModuleDom.isCheckedElementById(new ModuleButtons.ButtonOpenPaths().buttonIdHtml)){
    urls = getUrlsWithPaths(urls);
  }
  // Open URLs.
  var urlsLength = urls.length;
  for (var i = 0; i < urlsLength; i++) { 
    var url = urls[i];
    console.log('Init url ' + (i + 1) + '/' + urlsLength + ': \'' + url + '\'');
    // Check if an empty string was provided.
    // It can have the protocol, example added by the 
    // getUrlsWithPaths function.
    if (url == '' || url == PROTOCOL_DEFAULT){
      console.log('Not URL provided. Omitting');
    } else {
      url = getUrlWithProtocol(url);
      // Only wait between URLs.
      if (i != 0){
        console.log('Init. Wait miliseconds: ' + lazyLoadingTime);
        await ModuleSleep.sleepMs(lazyLoadingTime);
        console.log('Done. Wait miliseconds: ' + lazyLoadingTime);
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


/*Get and save Lazy Loading wait time.
:param lazyLoadingTimeToSave.
:return false: bool, function not done correctly.
        true: bool, function done correctly.
*/
function saveLazyLoading(lazyLoadingTimeToSave){
  console.log('Saving loading time: \'' + lazyLoadingTimeToSave + '\'');
  // Save value to the local storage.
  var storingInfo = browser.storage.local.set({['idLazyLoadingTime']:lazyLoadingTimeToSave});
  storingInfo.then(() => {
  }, reportError);
  return true;
}

// Save input boxes info.
async function saveRules(){

  var valuesRules = getValues();
  valuesRules = new ModuleUrlsModifier.RulesParser().getValuesRulesWithCorrectFormat(valuesRules);
  for (let [valueOld, valueNew] of valuesRules.entries()) {
    saveRule([valueOld, valueNew]);
    rules = await ModuleUrlsModifier.getRules(rules);
  }

  saveRulesNewFormat(valuesRules); // TODO replace saveRule() with this function.

  function getValues(){
    if (ModuleDom.isCheckedElementById(new ModuleButtons.ButtonOpenRules().buttonIdHtml)){
      return ModuleDom.getValueElementById('inputRules').split('\n');
    } else {
      return [ModuleDom.getValueElementById('inputValueOld'), ModuleDom.getValueElementById('inputValueNew')];
    }
  }

  function saveRule(values2save){

    var ids2save = [rules.ruleType + '_old_' + values2save[0], rules.ruleType + '_new_' + values2save[0]];
    var gettingItem = browser.storage.local.get(ids2save[0]);
    gettingItem.then((result) => { // result: empty object if the searched value is not stored
      var searchInStorage = Object.keys(result); // array with the searched value if it is stored
      if(searchInStorage.length < 1) { // searchInStorage.length < 1 -> no stored
        saveInfo(ids2save,values2save);
        showStoredInfo(values2save);
      }
    }, reportError);

    function saveInfo(ids2save, values2save) {
      console.log('Init saveInfo(). ids2save \'' + ids2save + '\', values2save \'' + values2save +'\'')
      for (var i = 0; i < ids2save.length; i++) {
        var storingInfo = browser.storage.local.set({[ids2save[i]]:values2save[i]});
        storingInfo.then(() => {
        }, reportError);
      }
    }

  }

  function saveRulesNewFormat(valuesRules) {
    var gettingRulesType = browser.storage.local.get(rules.ruleTypeNew);
    gettingRulesType.then((storedRulesType) => {
      console.log("Init get rulesNewFormat: ");
      let rulesNew = storedRulesType[rules.ruleTypeNew];
      if (typeof rulesNew === 'undefined'){
        rulesNew = new Map();
      }
      console.log(rulesNew);
      for (let [valueOld, valueNew] of valuesRules.entries()) {
        rulesNew.set(valueOld, valueNew);
      }
      console.log(`Init saveInfoNewFormat(). Key: ${rules.ruleTypeNew}. Values:`)
      console.log(rules)
      var storingInfo = browser.storage.local.set({[rules.ruleTypeNew]:rulesNew});
      storingInfo.then(() => {
      }, reportError);
    }, reportError);
  }

}


// clear display/storage
async function clearStorageInfo() {

  var gettingAllStoredItems = browser.storage.local.get(null);
  gettingAllStoredItems.then((storedItems) => {
    deleteAllRulesType(storedItems);
  }, reportError);
  rules = await ModuleUrlsModifier.getRules(rules);

  function deleteAllRulesType(storedItems){
    var keysUrl = Object.keys(storedItems).filter(key => key.includes(rules.ruleType+'_')); //array
    for (const keyUrl of keysUrl) {
      browser.storage.local.remove(keyUrl);
    }
    notShowRules();
  }

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
  if(!ModuleDom.isCheckedElementById(new ModuleButtons.ButtonOpenRules().buttonIdHtml)){
    new ModuleButtons.ButtonOpenRules().switchStyleAndStorageOnOff();
  }
  ModuleDom.setValueToElementById(rules.ruleTransformationsToUseStringRepresentation, 'inputRules');
  copy2clipboard ('inputRules');
}


class ButtonConfigurationLazyLoading extends ModuleButtons.ButtonClicked {

  constructor() {
    super('buttonConfigLazyLoading');
  } 

  get run() {
    this.runAsync();
  }

  async runAsync(){
    const lazyLoadingTime = await getStorageLazyLoading();
    ModuleDom.showOrHideArrayElementsById(['menuLazyLoading']);
    ModuleDom.setValueToElementById(lazyLoadingTime, 'inputLazyLoading');
  }

}

class ButtonConfigurationRules extends ModuleButtons.ButtonClicked {

  constructor() {
    super('buttonConfigRules');
  } 

  get run() {
    ModuleDom.showOrHideArrayElementsById(['menuRules']);
  }

}

class ButtonConfiguration extends ModuleButtons.ButtonClicked {

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

class ButtonCopy extends ModuleButtons.ButtonClicked {

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

class ButtonCleanUrl extends ModuleButtons.ButtonClicked {
  
  constructor() {
    super('buttonCleanUrl');
  } 

  get run() {
    this.logButtonName;
    let urlsModifier = null;
    rules.setRuleTypeDeobfuscate();
    if (ModuleDom.isCheckedElementById(new ModuleButtons.ButtonDecodeUrls().buttonIdHtml)){
      console.log('Choosen option: decode')
      urlsModifier = ModuleUrlsModifier.urlsModifier();
    } else {
      console.log('Choosen option: deofuscation')
      urlsModifier = ModuleUrlsModifier.urlsModifier(rules.ruleTransformationsInstanceToUse);
    }
    modifyText(urlsModifier);
  }

}

class ButtonObfuscate extends ModuleButtons.ButtonClicked {
  
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

class ButtonOpenUrls extends ModuleButtons.ButtonClicked {

  constructor() {
    super('buttonOpenUrls');
  } 

  get run() {
    this.logButtonName;
    openUrls();
  }

}

class ButtonInputObfuscation extends ModuleButtons.ButtonClicked {

  constructor() {
    super('buttonInputObfuscation');
  } 

  get run() {
    rules.setRuleTypeObfuscate();
    notShowRules();
    showStoredRulesType();
    ModuleDom.setEnabledArrayElementsById(['pInputOld','pInputNew','inputValueOld','inputValueNew','inputRules','buttonAddRule','buttonClearAllRules']);
  }

}

class ButtonInputDeobfuscation extends ModuleButtons.ButtonClicked {

  constructor() {
    super('buttonInputDeobfuscation');
  } 

  get run() {
    rules.setRuleTypeDeobfuscate();
    notShowRules();
    showStoredRulesType();
    ModuleDom.setEnabledArrayElementsById(['pInputOld','pInputNew','inputValueOld','inputValueNew','inputRules','buttonAddRule','buttonClearAllRules']);
  }

}

class ButtonAddLazyLoading extends ModuleButtons.ButtonClicked {

  constructor() {
    super('buttonAddLazyLoading');
  } 

  get run() {
    const lazyLoadingTimeToSave = getValidLazyLoadingTimeToSaveAndNotifyBadValue();
    if (lazyLoadingTimeToSave !== false) {
      saveLazyLoading(lazyLoadingTimeToSave);
    }
  }

}

class ButtonAddRule extends ModuleButtons.ButtonClicked {

  constructor() {
    super('buttonAddRule');
  } 

  get run() {
    saveRules();
  }

}

class ButtonClearAllRules extends ModuleButtons.ButtonClicked {

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
    case new ModuleButtons.ButtonOpenPaths().buttonIdHtml:
      return new ModuleButtons.ButtonOpenPaths();
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
    case new ModuleButtons.ButtonDecodeUrls().buttonIdHtml:
      return new ModuleButtons.ButtonDecodeUrls();
    case new ModuleButtons.ButtonOpenRules().buttonIdHtml:
      return new ModuleButtons.ButtonOpenRules();
    case new ButtonAddRule().buttonIdHtml:
      return new ButtonAddRule();
    case new ButtonClearAllRules().buttonIdHtml:
      return new ButtonClearAllRules();    
    default:
      return false;
  }
}


async function popupMain() {

  rules = await ModuleUrlsModifier.getRules(rules);
  new ModuleButtons.ButtonDecodeUrls().setStylePrevious();
  new ModuleButtons.ButtonOpenPaths().setStylePrevious();
  new ModuleButtons.ButtonOpenRules().setStylePrevious();

  document.addEventListener('click', (e) => {
    const buttonIdHtml = getIdHtmlOfClickedButtonOrImageFromEventClick(e);
    const buttonClicked = createClickedButton(buttonIdHtml)
    if (buttonClicked){
      buttonClicked.run;
      showOrHideRuleOrRules();
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
  getStorageLazyLoading,
  modifyText,
  popupMain,
  reportError,
  reportExecuteScriptError,
  showStoredInfo,
};
