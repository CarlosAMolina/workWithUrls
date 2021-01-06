class DomManager {

  constructor(){
    this._styleBoxShadowError = "0 0 2px #FF0000";
  }

  get styleBoxShadowError() {return this._styleBoxShadowError;};

  getHashPlusString(string){
    return '#'+string
  }

  getElementById(elementId){
    return document.querySelector(this.getHashPlusString(elementId));
  }
  
  getValueElementById(elementId){
    return this.getElementById(elementId).value;
  }

  setValueToElementById(value, elementId){
    this.getElementById(elementId).value = value;
  }
 
  getInfoContainer(){
    return document.querySelector('.info-container');
  }

  setHiddenElementById(elementId){
    this.getElementById(elementId).classList.add('hidden');
  }

  setUnhiddenElementById(elementId){
    this.getElementById(elementId).classList.remove('hidden');
  }

  setCheckedElementById(elementId){
    this.getElementById(elementId).checked = true;
  }

  setUncheckedElementById(elementId){
    this.getElementById(elementId).checked = false;
  }

  /*
  return: bool.
  */
  isCheckedElementById(elementId){
    return this.getElementById(elementId).checked;
  }

  /*
  return: bool.
  */
  isHiddenElementById(elementId){
    return this.getElementById(elementId).classList.contains('hidden');
  }

  setEnabledElementById(elementId){
    this.getElementById(elementId).disabled = false;
  }

  setStyleBoxErrorToElementById(elementId){
    this.getElementById(elementId).style.boxShadow = this.styleBoxShadowError;
  }

  unsetStyleBoxErrorToElementById(elementId){
    this.getElementById(elementId).style.removeProperty("box-shadow");
  }

}


function getDomManager(){
  return new DomManager();
}


export {
  getDomManager
};
