import * as ModuleDom from '../../../popup/modules/dom.js';


class ButtonInterface {

  constructor(config) {
    this._configDefault = {
      'tag': 'button',
      'innerHTML': undefined,
      'attributes': {
        'title': undefined,
        'class': 'floatLeft button'
      }
    }
    this._config = this._updateConfig(config);
  }

  get button() {
    return new ModuleDom.DocumentModifier().createElement(this._config);
  }

  _updateConfig(config) {
    let result = this._configDefault;
    result.innerHTML = config.innerHTML;
    result.attributes.title = config.attributes.title;
    return result;
  }

}


class ButtonCancel extends ButtonInterface {

  constructor() {
    const config = {
      'innerHTML': '<img src="/icons/cancel.png"/>',
      'attributes': {
        'title': 'Cancel update',
      }
    }
    super(config);
  }
}


class ButtonDelete extends ButtonInterface{

  constructor() {
    const config = {
      'innerHTML': '<img src="/icons/trash.png"/>',
      'attributes': {
        'title': 'Delete',
      }
    }
    super(config);
  }
}


class ButtonEdit extends ButtonInterface{

  constructor() {
    const config = {
      'innerHTML': '<img src="/icons/edit.png"/>',
      'attributes': {
        'title': 'Edit',
      }
    }
    super(config);
  }
}


class ButtonUpdate extends ButtonInterface {

  constructor() {
    const config = {
      'innerHTML': '<img src="/icons/ok.png"/>',
      'attributes': {
        'title': 'Update',
      }
    }
    super(config);
  }
}


export {
  ButtonCancel,
  ButtonDelete,
  ButtonEdit ,
  ButtonUpdate
};

