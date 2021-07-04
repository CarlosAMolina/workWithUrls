import * as ModuleDom from '../dom.js';
import * as ModuleButtonsInterface from './buttonsInterface.js';


// https://www.scriptol.com/html5/button-on-off.php
class ButtonOnOff extends ModuleButtonsInterface.ButtonClicked {

  static get _buttonIdStorage() { throw TypeError("Not implemented"); }

  static get buttonIdStorage() { return this._buttonIdStorage; }

  get isOn() {
    return ModuleDom.isCheckedElementById(this.constructor.buttonIdHtml);
  }
  
  get run() {
    this.switchStyleAndStorageOnOff();
  }

  setStylePrevious() {
    browser.storage.local.get(this.constructor.buttonIdStorage).then((result) => {
      if (result[this.constructor.buttonIdStorage]){
        this.setStyleOn();
      } else {
        this.setStyleOff();
      }
    }, console.error);
  }

  switchStyleAndStorageOnOff() {
    if(this.isOn) {
      this.setStyleOff();
    } else {
      this.setStyleOn();
    }
    let storingInfo = browser.storage.local.set({[this.constructor.buttonIdStorage]:this.isOn});
    storingInfo.then(() => {
      console.log(`Stored ${this.constructor.buttonIdStorage}: ${this.isOn}`);
    }, console.error);
  }

  setStyleOff(){
    this.setStyleColorLabelChecked('gray', 'lightgray', 'off', false);
  }

  setStyleOn(){
    this.setStyleColorLabelChecked('green', 'lightgreen', 'on', true);
  }

  setStyleColorLabelChecked(style, color, label, checked) {
    ModuleDom.getElementById(this.constructor.buttonIdHtml).style.background = style;
    ModuleDom.getElementById(this.constructor.buttonIdHtml).style.color = color;
    ModuleDom.getElementById(this.constructor.buttonIdHtml).textContent = label;
    ModuleDom.getElementById(this.constructor.buttonIdHtml).checked = checked;
  }

}


class ButtonDecodeUrls extends ButtonOnOff {

  static get _buttonIdHtml() { return 'buttonDecodeUrls'; }
  static get _buttonIdStorage() { return 'buttonDecodeUrlsIsOn'; }

}


class ButtonOpenPaths extends ButtonOnOff {

  static get _buttonIdHtml() { return 'buttonOpenPaths'; }
  static get _buttonIdStorage() { return 'buttonOpenPathsIsOn'; }

}


class ButtonOpenRules extends ButtonOnOff {

  static get _buttonIdHtml() { return "buttonOpenRules"; }
  static get _buttonIdStorage() { return 'buttonOpenRulesIsOn'; }


  // TODO use ModuleStorageGeneral.isKeyStored()
  showOrHideRuleOrRules() {
    browser.storage.local.get(this.constructor.buttonIdStorage).then((result) => {
      if (result[this.constructor.buttonIdStorage]){
	ModuleDom.setHiddenElementById('divInputRule');
	ModuleDom.setUnhiddenElementById('divInputRules');
      } else {
	ModuleDom.setUnhiddenElementById('divInputRule');
	ModuleDom.setHiddenElementById('divInputRules');
      }
    }, console.error);
  }

}


export {
  ButtonDecodeUrls,
  ButtonOpenPaths, 
  ButtonOpenRules 
};
