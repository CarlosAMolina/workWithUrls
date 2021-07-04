import * as ModuleButtonsInterface from '../../modules/buttons/buttonsInterface.js';
import * as ModuleDom from '../../modules/dom.js';
import * as ModuleStorageLazyLoading from '../../modules/storage/lazyLoading.js';


class ButtonConfigurationLazyLoading extends ModuleButtonsInterface.ButtonClicked {

  static get _buttonIdHtml() { return 'buttonConfigLazyLoading'; }

  get run() {
    this.runAsync();
  }

  async runAsync(){
    const lazyLoadingTime = await ModuleStorageLazyLoading.getStorageLazyLoading();
    ModuleDom.showOrHideArrayElementsById(['menuLazyLoading']);
    ModuleDom.setValueToElementById(lazyLoadingTime, 'inputLazyLoading');
  }

}


class ButtonAddLazyLoading extends ModuleButtonsInterface.ButtonClicked {

  static get _buttonIdHtml() { return 'buttonAddLazyLoading'; }

  get run() {
    const lazyLoadingTimeToSave = _getValidLazyLoadingTimeToSaveAndNotifyBadValue();
    if (lazyLoadingTimeToSave !== false) {
      ModuleStorageLazyLoading.setStorageLazyLoading(lazyLoadingTimeToSave);
    }
  }

}

/*
return number int or false.
*/
function _getValidLazyLoadingTimeToSaveAndNotifyBadValue(){
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


export {
  ButtonAddLazyLoading,
  ButtonConfigurationLazyLoading,
}
