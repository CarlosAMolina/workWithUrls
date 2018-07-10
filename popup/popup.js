var idElement2Change;
var infoContainer = document.querySelector('.info-container');
var openPaths = 0;
function rule(type, valueOld, valueNew) {
  this.type = type;
  this.valuesOld = valueOld;
  this.valuesNew = valueNew;
}
var ruleDeobfuscate = 'rd';
var ruleObfuscate = 'ro';
var ruleType = '';
var ruleTypes = [ruleObfuscate,ruleDeobfuscate];
var rules = [];
var urls = [];

function popupMain() {

  initializePopup();
  
  function initializePopup() {

    // get value of the open paths option 
    function getOpenPaths(){
      var gettingItem = browser.storage.local.get('idOpenPaths');
      gettingItem.then((result) => { // result: empty object if the searched value is not stored
        if ( (typeof result.idOpenPaths != 'undefined') && (result.idOpenPaths == 1) ){ // undefined -> open paths option has never been used
          // on/off openPaths switch
          document.getElementById('boxPaths').checked = true;
        } else {
          document.getElementById('boxPaths').checked = false;
        }
      }, reportError);
    }
   
    getOpenPaths();
    getRules();
  }

  function getRules(){
    var gettingAllStoredItems = browser.storage.local.get(null);
    gettingAllStoredItems.then((storedItems) => { // storedItems: object of keys and values
      rules = []; // initialize
      ruleTypes.forEach(function(ruleType){
        var keysRuleOld = Object.keys(storedItems).filter(key => key.includes(ruleType+'_old_')); //array
        var rules2SaveOld = keysRuleOld.map(keysRuleOld => storedItems[keysRuleOld]); // array
        var keysRuleNew = Object.keys(storedItems).filter(key => key.includes(ruleType+'_new_')); //array
        var rules2SaveNew = keysRuleNew.map(keysRuleNew => storedItems[keysRuleNew]); // array
        var result = new rule(ruleType, rules2SaveOld, rules2SaveNew); 
        rules.push(result);
      });
    }, reportError);
  }

  // error
  function reportError(error) {
    console.error(`Error: ${error}`);
  }

  // display info
  function showStoredInfo(eValues) {
    // display box
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
    infoContainer.appendChild(entry);

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
      browser.storage.local.remove([ruleType+'_old_'+eValues[0], ruleType+'_new_'+eValues[0]]);
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

      var eKeys2change = [ruleType + '_old_' + eValues[0], ruleType + '_new_' + eValues[0]];
      var values2save = [entryEditInputOldValue.value, entryEditInputNewValue.value];
      var ids2save = [ruleType + '_old_' + values2save[0], ruleType + '_new_' + values2save[0]];
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

    function showOrHideInfo(){

      function hideInfo(){
        document.querySelector('#'+idElement2Change).classList.add('hidden');
      }

      function showTagsInfo(){
        document.querySelector('#'+idElement2Change).classList.remove('hidden');
      }

      if (document.getElementById(idElement2Change).classList.contains('hidden')){
        showTagsInfo();
      } else {
        hideInfo();
      }
    }

    function enableElements(idElements2Change){
      idElements2Change.forEach(function(arrayValue){
        document.getElementById(arrayValue).disabled = false;
      });
    }

    function showStoredRulesType(){
      var gettingAllStoredItems = browser.storage.local.get(null);
      gettingAllStoredItems.then((storedItems) => {
        var keysRuleType = Object.keys(storedItems).filter(key => key.includes(ruleType+'_')); //array
        var rulesType2Save = keysRuleType.map(keysRuleType => storedItems[keysRuleType]); // array
        for (var i = 0; i < Object.keys(keysRuleType).length; i+=2) {
          var values2show = [rulesType2Save[i], rulesType2Save[i+1]];
          var keysRuleType2show = [keysRuleType[i], keysRuleType[i+1]];
          showStoredInfo(values2show);
        }
      }, reportError);
    }

    function modifyText(){
      var ruleValues = rules[ruleTypes.indexOf(ruleType)];
      if (ruleValues.valuesOld.length != 0){
        var urlsFinal = '';
        urls = document.querySelector('textarea[id="inputUrls"]').value.split('\n');
        urls.forEach( function(url2Change) {
          for (var i = 0; i < ruleValues.valuesOld.length; i++) {
            var regex = new RegExp(ruleValues.valuesOld[i], "g");
            url2Change = url2Change.replace(regex, ruleValues.valuesNew[i]);
          }
          urlsFinal += url2Change + '\n';
        });
        urlsFinal = urlsFinal.replace(/\n$/, ""); // remove the last \n
        document.getElementById('inputUrls').value = urlsFinal;
      }
    }

    function openUrls(){

      function openPaths(urls){
        urls.forEach( function(url) {
          if (url.slice(-1) == '/'){
            url = url.substring(0, url.length -1);
          }
          while (url.slice(-1) != '/') {
            openUrl(url);
            if ( url.indexOf('/') != -1 ){
              url = url.slice(0, url.lastIndexOf('/'));
            }
            else {
              url = '/';
            }
          }
        });
      }
  
      function openUrl(url){

        function checkProtocol(url){
          if (url.substring(0, 4).toLowerCase() != 'http'){
            return 'http://'+url;
          }
          return url;
        }

        try{
          window.open(checkProtocol(url));
        }
        catch(error){
          reportError(error);
        }
      }

      urls = document.querySelector('textarea[id="inputUrls"]').value.split('\n');
      if (document.getElementById('boxPaths').checked == true){
        openPaths(urls);
      }
      else {
        urls.forEach( function(url) {
          openUrl(url);
        });
      }
    }

    // save input boxes info
    function saveRule(){
      
      function saveInfo(ids2save,values2save) {
        for (var i = 0; i < ids2save.length; i++) {
          var storingInfo = browser.storage.local.set({[ids2save[i]]:values2save[i]});
          storingInfo.then(() => {
          }, reportError);
        }
      }
         
      var values2save = [document.querySelector('div.backGroundGrey input[id="inputValueOld"]').value, document.querySelector('div.backGroundGrey input[id="inputValueNew"]').value];
      var ids2save = [ruleType + '_old_' + values2save[0], ruleType + '_new_' + values2save[0]];
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

    // clear display/storage
    function clearStorageInfo() {
  
      function deleteAllRulesType(storedItems){
        var keysUrl = Object.keys(storedItems).filter(key => key.includes(ruleType+'_')); //array
        keysUrl.forEach(function(keyUrl){
          browser.storage.local.remove(keyUrl);
        });
        getRules();
        notShowRules();
      }

      var gettingAllStoredItems = browser.storage.local.get(null);
      gettingAllStoredItems.then((storedItems) => {
        deleteAllRulesType(storedItems);
      }, reportError);
    }

    function notShowRules(){
      while (infoContainer.firstChild) {
        infoContainer.removeChild(infoContainer.firstChild);
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

    if (e.target.classList.contains('showConfig')){
      idElement2Change='menuConfig';
      showOrHideInfo();
    } else if (e.target.classList.contains('copy')){
      document.getElementById('inputUrls').select();
      document.execCommand('copy');
    } else if (e.target.classList.contains('deobfuscate')){
      ruleType = ruleDeobfuscate;
      modifyText();
    } else if (e.target.classList.contains('obfuscate')){
      ruleType = ruleObfuscate;
      modifyText();
    } else if (e.target.classList.contains('openUrls')) {
      openUrls();
    } else if (e.target.classList.contains('openPaths')){
      saveOpenPaths();
    } else if (e.target.classList.contains('inputObfuscation')){
      ruleType = ruleObfuscate;
      notShowRules();
      showStoredRulesType();
      enableElements(['pInput','inputValueOld','inputValueNew','buttonAdd','buttonClearAll']);
    } else if (e.target.classList.contains('inputDeobfuscation')){
      ruleType = ruleDeobfuscate;
      notShowRules();
      showStoredRulesType();
      enableElements(['pInput','inputValueOld','inputValueNew','buttonAdd','buttonClearAll']);
    } else if (e.target.classList.contains('addRule')){
      saveRule();
    } else if (e.target.classList.contains('clearAllInfo')){
      browser.tabs.query({active: true, currentWindow: true})
        .then(clearStorageInfo)
        .catch(reportError)
    }
  });

}

// there was an error executing the script.
// display the pop-up's error message, and hide the normal UI.
function reportExecuteScriptError(error) {
  document.querySelector('#popup-content').classList.add('hidden');
  document.querySelector('#error-content').classList.remove('hidden');
  console.error(`Error: ${error.message}`);
}

try {
  popupMain();
}
catch (error){
  reportExecuteScriptError(error);
}