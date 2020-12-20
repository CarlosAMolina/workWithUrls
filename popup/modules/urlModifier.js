// Global variables.
// Protocol to add if no one provided.
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


function modifyText(){

  function workWithObfuscation(){
    var ruleValues = rules[ruleTypes.indexOf(ruleType)];
    if (ruleValues.valuesOld.length != 0){
      urls.forEach( function(url2Change) {
        for (var i = 0; i < ruleValues.valuesOld.length; i++) {
          var regex = new RegExp(ruleValues.valuesOld[i], "g");
          url2Change = url2Change.replace(regex, ruleValues.valuesNew[i]);
        }
        urlsFinal += url2Change + '\n';
      });
      urlsFinal = urlsFinal.replace(/\n$/, ""); // remove the last \ns
    }
    return urlsFinal;
  }

  function workWithCodification(){
    urls.forEach( function(url2Change) {
      try{
        url2Change = decodeURIComponent(url2Change);
      } catch(e) { // URIError: malformed URI sequence
        url2Change = e;
      }
      urlsFinal += url2Change + '\n';
    });
    urlsFinal = urlsFinal.replace(/\n$/, ""); // remove the last \n
    return urlsFinal;
  }

  var urlsFinal = '';
  urls = document.getElementById('inputUrls').value.split('\n');
  if ((document.getElementById('boxDecode').checked == true) && (ruleType == ruleDeobfuscate)){
    urlsFinal = workWithCodification();
  } else {
    urlsFinal = workWithObfuscation();
  }
  if (urlsFinal == ''){
    urlsFinal = document.getElementById('inputUrls').value;
  }
  document.getElementById('inputUrls').value = urlsFinal;
}

  //TODO: created only for testing.
  popupMain.getRules = getRules; 
  popupMain.getStorageLazyLoading = getStorageLazyLoading;
  popupMain.initializePopup = initializePopup; 
  popupMain.reportError = reportError; 
  popupMain.showStoredInfo = showStoredInfo;
}

//TODO: created only for testing.
module.exports = { popupMain, reportExecuteScriptError }
