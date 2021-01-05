
/* References.
- Local storage.
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local
*/

import * as ModuleSleep from '../popup/modules/sleep.js';
import * as ModuleUrlsModifier from './modules/urlsModifier.js';

// Global constants.
const rules = new ModuleUrlsModifier.Rules();

// Global variables.
var lazyLoadingTime = 0;
var openPaths = 0;
var PROTOCOL_DEFAULT = 'http://'
var urls = [];
// Variable to save the result of window.open()
// https://developer.mozilla.org/en-US/docs/Web/API/Window/open
var windowObjectReference = null;


class Dom {
  
  // return: object, strings.
  getUrls(){
    return document.getElementById('inputUrls').value;
  }

  setUrls(urls){
    document.getElementById('inputUrls').value = urls;
  }

  isCheckedBoxDecode(){
    return document.getElementById('boxDecode').checked == true
  }
  
  getInfoContainer(){
    return document.querySelector('.info-container');
  }

}

const dom = new Dom();


/*
param ruleTransformations: RuleTransformations instance.
param functionModifyUrls: function reference.
return: string.
*/
function modifyText(functionModifyUrls){
  let urlsNew = '';
  const urls = dom.getUrls().split('\n');
  urlsNew = functionModifyUrls(urls);
  if (urlsNew.length == 0){
    urlsNew = dom.getUrls();
  } else {
    urlsNew = urlsNew.join('\n');
  }
  dom.setUrls(urlsNew);
}


function popupMain() {

  initializePopup();
  
  function initializePopup() {

    // Get value of the open paths option at the storage.
    function getOpenPaths(){
      console.log('Init getOpenPaths()')
      var gettingItem = browser.storage.local.get('idOpenPaths');
      // Object result: empty object if the searched value is not stored.
      gettingItem.then((result) => {
        // Undefined -> open paths option has never been used.
        if ( (typeof result.idOpenPaths != 'undefined') && (result.idOpenPaths == 1) ){
          // On/off openPaths switch.
          document.getElementById('boxPaths').checked = true;
        } else {
          document.getElementById('boxPaths').checked = false;
        }
      }, reportError);
    }
   
    getOpenPaths();
    getRules();
    getStorageLazyLoading();
  }

  function getRules(){
    console.log('Init getRules()')
    var gettingAllStoredItems = browser.storage.local.get(null);
    gettingAllStoredItems.then((storedItems) => { // storedItems: object of keys and values
      rules.initializeRules();
      for (ruleType of rules.ruleTypes) {
        var keysRuleOld = Object.keys(storedItems).filter(key => key.includes(ruleType+'_old_')); //array
        var rules2SaveOld = keysRuleOld.map(keysRuleOld => storedItems[keysRuleOld]); // array
        var keysRuleNew = Object.keys(storedItems).filter(key => key.includes(ruleType+'_new_')); //array
        var rules2SaveNew = keysRuleNew.map(keysRuleNew => storedItems[keysRuleNew]); // array
        let ruleTransformations = new ModuleUrlsModifier.RuleTransformations(rules2SaveOld, rules2SaveNew); 
        rules.addTypeAndRule(ruleType, ruleTransformations);
        console.log('Rules:')
        console.log(result)
      }
    }, reportError);
  }

  /* Get Lazy Loading time value at the storage.
  :param: no param.
  :return: no value, value saved at global variable lazyLoadingTime.
  */
  function getStorageLazyLoading(){
    console.log('Init getStorageLazyLoading()')
    var gettingItem = browser.storage.local.get('idLazyLoadingTime');
    // Object result: empty object if the searched value is not stored.
    gettingItem.then((result) => {
      // Undefined -> Lazy Loading time value option has never been set.
      if ( (typeof result.idLazyLoadingTime != 'undefined') ){
        lazyLoadingTime = result.idLazyLoadingTime;
        console.log('Stored lazy loading time (type ' + typeof(lazyLoadingTime) + '): \'' + lazyLoadingTime + '\'');
      } else{
        lazyLoadingTime = 0;
        console.log('Not previous stored lazy loading time value. Return (type ' + typeof(lazyLoadingTime) + '): \'' + lazyLoadingTime + '\'');
      }
    // Set value at the popup.
    document.getElementById('inputLazyLoading').value = lazyLoadingTime;
    }, reportError);
  }


  // Error.
  function reportError(error) {
    console.error(`Error: ${error}`);
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
    dom.getInfoContainer().appendChild(entry);

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
      getRules();
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

      function updateValue(ids2change, ids2save, values2save) {
        for (var i = 0; i < 2; i++) {
          browser.storage.local.remove(ids2change[i]);
          var storingInfo = browser.storage.local.set({ [ids2save[i]] : values2save[i] });
          storingInfo.then(() => {
          }, reportError);
        }
      }

      var eKeys2change = [rules.ruleType + '_old_' + eValues[0], rules.ruleType + '_new_' + eValues[0]];
      var values2save = [entryEditInputOldValue.value, entryEditInputNewValue.value];
      var ids2save = [rules.ruleType + '_old_' + values2save[0], rules.ruleType + '_new_' + values2save[0]];
      var gettingItem = browser.storage.local.get(ids2save[0]);
      gettingItem.then((storedItem) => { // result: empty object if the searched value is not stored
        var searchInStorage = Object.keys(storedItem); // array with the searched value if it is stored
        if( (searchInStorage.length < 1) || ( (eKeys2change[0] == ids2save[0]) && (eValues[1] != values2save[1]) ) ) { // searchInStorage.length < 1 -> no stored
          updateValue(eKeys2change, ids2save, values2save);
          getRules()
          entry.parentNode.removeChild(entry);
          showStoredInfo(values2save);
        }
      });
    });
 
  }

  // listen to clicks on the buttons
  document.addEventListener('click', (e) => {

    function hideInfo(idElement2Change){
      document.querySelector('#'+idElement2Change).classList.add('hidden');
    }

    function showOrHideInfo(idElements2Change){ // idElements2Change: array

      function showTagsInfo(idElement2Change){
        document.querySelector('#'+idElement2Change).classList.remove('hidden');
      }
      for (const idElement2Change of idElements2Change){
        if (document.getElementById(idElement2Change).classList.contains('hidden')){
          showTagsInfo(idElement2Change);
        } else {
          hideInfo(idElement2Change);
        }
      }
    }

    function enableElements(idElements2Change){
      for (const arrayValue of idElements2Change){
        document.getElementById(arrayValue).disabled = false;
      }
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
      }, reportError);
    }

    /* Open URLs and its paths if option checked.
    :param: null.
    :return: null.
    */
    async function openUrls(){

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

      /* Open an url and catches possible exception.
      :param url: str, url to check.
      :return null.
      */
      function openUrl(url){
        try{
          windowObjectReference = window.open(url);
          console.log('Done open url \'' + url + '\'. Window object reference: ' + windowObjectReference)
        }
        catch(error){
          reportError(error);
        }
      }

      // Get URLs at the input box.
      urls = dom.getUrls().split('\n');

      console.log('URLs at the input box: ' + urls)
      if (document.getElementById('boxPaths').checked == true){
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

    /*Get and save Lazy Loading wait time.
    :param: not required.
    :return false: bool, function not done correctly.
            true: bool, function done correctly.
    */
    function saveLazyLoading(){
      var lazyLoadingTime = document.getElementById('inputLazyLoading').value;
      console.log('Lazy loading time: \'' + lazyLoadingTime + '\'');
      // Convert input to type number.
      // Example: 1a -> 1, 1.1 -> 1, a1 -> Nan
      lazyLoadingTime = parseInt(lazyLoadingTime);
      // Update input box value with the modified value.
      document.querySelector('#inputLazyLoading').value = lazyLoadingTime;
      // Check value is a number.
      if (isNaN(lazyLoadingTime)) {
        console.log('Error. Lazy loading time is not a number');
        document.querySelector('#inputLazyLoading').style.boxShadow = "0 0 2px #FF0000";
        return false;
      }
      else {
        // Quit possible previous red error border.
        document.querySelector('#inputLazyLoading').style.removeProperty("box-shadow");
      }
      // Set value >= 0. Type number.
      lazyLoadingTime = Math.abs(lazyLoadingTime)
      // Save value to the local storage.
      var storingInfo = browser.storage.local.set({['idLazyLoadingTime']:lazyLoadingTime});
      storingInfo.then(() => {
      }, reportError);
      // Set value at the popup.
      document.getElementById('inputLazyLoading').value = lazyLoadingTime;
      return true;
    }

    // Save input boxes info.
    function saveRules(){

      function saveRule(values2save){

        function saveInfo(ids2save,values2save) {
          console.log('Init saveInfo(). ids2save \'' + ids2save + '\', values2save \'' + values2save +'\'')
          for (var i = 0; i < ids2save.length; i++) {
            var storingInfo = browser.storage.local.set({[ids2save[i]]:values2save[i]});
            storingInfo.then(() => {
            }, reportError);
          }
        }

        var ids2save = [rules.ruleType + '_old_' + values2save[0], rules.ruleType + '_new_' + values2save[0]];
        var gettingItem = browser.storage.local.get(ids2save[0]);
        gettingItem.then((result) => { // result: empty object if the searched value is not stored
          var searchInStorage = Object.keys(result); // array with the searched value if it is stored
          if(searchInStorage.length < 1) { // searchInStorage.length < 1 -> no stored
            saveInfo(ids2save,values2save);
            showStoredInfo(values2save);
            getRules();
          }
        }, reportError);
      }

      function getValues(){
        if (document.getElementById('boxRules').checked == false){
          return [document.getElementById('inputValueOld').value, document.getElementById('inputValueNew').value];
        } else {
          return document.getElementById('inputRules').value.split('\n');
        }
      }

      var valuesRules = getValues();
      for (var i = 0; i < valuesRules.length; i+=2) {
        if (typeof valuesRules[i+1] != 'undefined'){
          saveRule([valuesRules[i],valuesRules[i+1]]);
        } else {
          saveRule([valuesRules[i],'']);
        }
      }
    }

    // clear display/storage
    function clearStorageInfo() {
  
      function deleteAllRulesType(storedItems){
        var keysUrl = Object.keys(storedItems).filter(key => key.includes(rules.ruleType+'_')); //array
        for (keyUrl of keysUrl) {
          browser.storage.local.remove(keyUrl);
        }
        getRules();
        notShowRules();
      }

      var gettingAllStoredItems = browser.storage.local.get(null);
      gettingAllStoredItems.then((storedItems) => {
        deleteAllRulesType(storedItems);
      }, reportError);
    }

    function notShowRules(){
      while (dom.getInfoContainer().firstChild) {
        dom.getInfoContainer().removeChild(dom.getInfoContainer().firstChild);
      }   
    }

    // open paths option
    function saveOpenPaths(){
      if (document.getElementById('boxPaths').checked == true){
        openPaths = 1;
      } else {
        openPaths = 0;
      }
      var storingInfo = browser.storage.local.set({['idOpenPaths']:openPaths});
      storingInfo.then(() => {
      });
    }

    function copy2clipboard (idWithInfo){
      document.getElementById(idWithInfo).select();
      document.execCommand('copy');
    }

    function copyRules(){
      document.getElementById('boxRules').checked = true;
      document.querySelector('#divInputRule').classList.add('hidden');
      document.querySelector('#divInputRules').classList.remove('hidden');
      document.getElementById('inputRules').value = rules.ruleTransformationsToUseStringRepresentation;
      copy2clipboard ('inputRules');


    }

    // Detect popup's clicked buttons.
    if (e.target.classList.contains('showConfig')){
      console.log('Clicked button: showConfig')
      showOrHideInfo(['menuConfig']);
      if (document.getElementById('menuRules').classList.contains('hidden') == false){
        hideInfo('menuRules');
      }
    } else if (e.target.classList.contains('configLazyLoading')){
      showOrHideInfo(['menuLazyLoading']);
    } else if (e.target.classList.contains('configRules')){
      showOrHideInfo(['menuRules']);
    } else if (e.target.classList.contains('openRules')){
      showOrHideInfo(['divInputRule','divInputRules']);
    } else if (e.target.classList.contains('copy')){
      console.log('Clicked button: copy')
      if (dom.getUrls() !== ''){
        copy2clipboard('inputUrls');
      } else if (rules.isRuleTypeConfigured()){
        copyRules();
      }
    } else if (e.target.classList.contains('cleanUrl')){
      console.log('Clicked button: cleanUrl')
      rules.setRuleTypeDeobfuscate();
      if (dom.isCheckedBoxDecode()){
        console.log('Choosen option: decode')
        const functionModifyUrls = ModuleUrlsModifier.urlsDecoder();
      } else {
        console.log('Choosen option: deofuscation')
        const functionModifyUrls = ModuleUrlsModifier.urlsRuleApplicator(rules.ruleTransformationsToUse);
      }
      modifyText(functionModifyUrls);
    } else if (e.target.classList.contains('obfuscate')){
      console.log('Clicked button: obfuscate')
      rules.setRuleTypeObfuscate();
      const functionModifyUrls = ModuleUrlsModifier.urlsRuleApplicator(rules.ruleTransformationsToUse);
      modifyText(functionModifyUrls);
    } else if (e.target.classList.contains('openUrls')) {
      console.log('Clicked button: openUrls')
      openUrls();
    } else if (e.target.classList.contains('openPaths')){
      saveOpenPaths();
    } else if (e.target.classList.contains('inputObfuscation')){
      rules.setRuleTypeObfuscate();
      notShowRules();
      showStoredRulesType();
      enableElements(['pInputOld','pInputNew','inputValueOld','inputValueNew','inputRules','buttonAdd','buttonClearAll']);
    } else if (e.target.classList.contains('inputDeobfuscation')){
      rules.setRuleTypeDeobfuscate();
      notShowRules();
      showStoredRulesType();
      enableElements(['pInputOld','pInputNew','inputValueOld','inputValueNew','inputRules','buttonAdd','buttonClearAll']);
    } else if (e.target.classList.contains('addLazyLoading')){
      saveLazyLoading();
      // The following line is important to apply the new value without close and open the addons' pop-up.
      getStorageLazyLoading();
    } else if (e.target.classList.contains('addRule')){
      saveRules();
    } else if (e.target.classList.contains('clearAllInfo')){
      browser.tabs.query({active: true, currentWindow: true})
        .then(clearStorageInfo)
        .catch(reportError)
    }

  });

  //TODO: created only for testing.
  popupMain.getRules = getRules; 
  popupMain.getStorageLazyLoading = getStorageLazyLoading;
  popupMain.initializePopup = initializePopup; 
  popupMain.reportError = reportError; 
  popupMain.showStoredInfo = showStoredInfo;
}

// There was an error executing the script.
// Display the pop-up's error message, and hide the normal UI.
function reportExecuteScriptError(error) {
  //TODO document.querySelector('#popup-content').classList.add('hidden');
  //TODO document.querySelector('#error-content').classList.remove('hidden');
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
  Dom,
  modifyText,
  popupMain,
  reportExecuteScriptError
};
