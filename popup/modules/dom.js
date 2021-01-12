const STYLE_BOX_SHADOW_ERROR = "0 0 2px #FF0000";

function getHashPlusString(string){
  return '#'+string
}

function getElementById(elementId){
  return document.querySelector(getHashPlusString(elementId));
}

function getValueElementById(elementId){
  return getElementById(elementId).value;
}

function setValueToElementById(value, elementId){
  getElementById(elementId).value = value;
}

function getInfoContainer(){
  return document.querySelector('.info-container');
}

function setHiddenElementById(elementId){
  getElementById(elementId).classList.add('hidden');
}

function setUnhiddenElementById(elementId){
  getElementById(elementId).classList.remove('hidden');
}

function setCheckedElementById(elementId){
  getElementById(elementId).checked = true;
}

function setUncheckedElementById(elementId){
  getElementById(elementId).checked = false;
}

/*
return: bool.
*/
function isCheckedElementById(elementId){
  return getElementById(elementId).checked;
}

/*
return: bool.
*/
function isHiddenElementById(elementId){
  return getElementById(elementId).classList.contains('hidden');
}

function setEnabledElementById(elementId){
  getElementById(elementId).disabled = false;
}

function setStyleBoxErrorToElementById(elementId){
  getElementById(elementId).style.boxShadow = STYLE_BOX_SHADOW_ERROR;
}


function unsetStyleBoxErrorToElementById(elementId){
  getElementById(elementId).style.removeProperty("box-shadow");
}

/*
param idElements2Change: array
*/
function showOrHideArrayElementsById(idElements2Change) {
  for (const idElement2Change of idElements2Change) {
    if (isHiddenElementById(idElement2Change)) {
      setUnhiddenElementById(idElement2Change);
    } else {
      setHiddenElementById(idElement2Change);
    }
  }
}

/*
param idElements2Change: array
*/
function setEnabledArrayElementsById(idElements2Change) {
  for (const idElement2Change of idElements2Change){
    setEnabledElementById(idElement2Change);
  }
}

export {
  getElementById,
  getInfoContainer,
  getValueElementById,
  isCheckedElementById,
  isHiddenElementById,
  setCheckedElementById,
  setEnabledArrayElementsById,
  setEnabledElementById,
  setHiddenElementById,
  setStyleBoxErrorToElementById,
  setUncheckedElementById,
  setUnhiddenElementById,
  setValueToElementById,
  showOrHideArrayElementsById,
  STYLE_BOX_SHADOW_ERROR,
  unsetStyleBoxErrorToElementById
};
