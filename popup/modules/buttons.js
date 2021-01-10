import * as ModuleDom from './dom.js';


// https://www.scriptol.com/html5/button-on-off.php
class ButtonOnOff {

  constructor(buttonIdHtml, buttonIdStorage) {
    this._buttonIdHtml = buttonIdHtml;
    this._buttonIdStorage = buttonIdStorage;
  }

  get buttonIdHtml() { return this._buttonIdHtml; }
  get buttonIdStorage() { return this._buttonIdStorage; }
  
  setStylePrevious() {
    browser.storage.local.get(this.buttonIdStorage).then((result) => {
      if (result[this.buttonIdStorage]){
        this.setStyleOn();
      } else {
        this.setStyleOff();
      }
    }, console.error);
  }

  switchStyleAndStorageOnOff() {
    let buttonOn = false;
    if(ModuleDom.isCheckedElementById(this.buttonIdHtml)) {
      this.setStyleOff();
      buttonOn = false;
    } else {
      this.setStyleOn();
      buttonOn = true;
    }
    let storingInfo = browser.storage.local.set({[this.buttonIdStorage]:buttonOn});
    storingInfo.then(() => {
      console.log('Stored ' + this.buttonIdStorage + ': ' + buttonOn);
    }, console.error);
  }

  setStyleOff(){
    this.setStyleColorLabelChecked('gray', 'lightgray', 'off', false);
  }

  setStyleOn(){
    this.setStyleColorLabelChecked('green', 'lightgreen', 'on', true);
  }

  setStyleColorLabelChecked(style, color, label, checked) {
    ModuleDom.getElementById(this.buttonIdHtml).style.background = style;
    ModuleDom.getElementById(this.buttonIdHtml).style.color = color;
    ModuleDom.getElementById(this.buttonIdHtml).innerHTML = label;
    ModuleDom.getElementById(this.buttonIdHtml).checked = checked;
  }

}

class ButtonTest extends ButtonOnOff {

  constructor() {
    const buttonIdHtml = "buttonTestOnOff";
    const buttonIdStorage = "buttonTestOnOffIsOn";
    super(buttonIdHtml, buttonIdStorage);
  }

}

export {
  ButtonTest
};
