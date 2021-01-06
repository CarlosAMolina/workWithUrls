class Dom {

  getHashPlusString(string){
    return '#'+string
  }
  
  getValueElementById(elementId){
    return document.querySelector(this.getHashPlusString(elementId)).value;
  }

  setValueToElementById(value, elementId){
    document.querySelector(this.getHashPlusString(elementId)).value = value;
  }
 
  getInfoContainer(){
    return document.querySelector('.info-container');
  }

  setHiddenElementById(elementId){
    document.querySelector(this.getHashPlusString(elementId)).classList.add('hidden');
  }

  setUnhiddenElementById(elementId){
    document.querySelector(this.getHashPlusString(elementId)).classList.remove('hidden');
  }

  setCheckedElementById(elementId){
    document.querySelector(this.getHashPlusString(elementId)).checked = true;
  }

  setUncheckedElementById(elementId){
    document.querySelector(this.getHashPlusString(elementId)).checked = false;
  }

  /*
  return: bool.
  */
  isCheckedElementById(elementId){
    return document.querySelector(this.getHashPlusString(elementId)).checked;
  }

  /*
  return: bool.
  */
  isHiddenElementById(elementId){
    return document.querySelector(this.getHashPlusString(elementId)).classList.contains('hidden');
  }

}


function getDom(){
  return new Dom();
}


export {
  getDom
};
