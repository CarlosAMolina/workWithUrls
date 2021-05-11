import * as ModuleDom from '../../../popup/modules/dom.js';


class ButtonInterface {

  constructor(config) {
    this._configDefault = {
      'tag': 'button',
      'attributes': {
        'title': undefined,
        'class': 'floatLeft button'
      },
      'style': {
        'width': '30px',
        'height': '30px',
        'background': undefined
      }
    }
    this._config = this._updateConfig(config);
  }

  get button() {
    return new ModuleDom.DocumentModifier().createElement(this._config);
  }

  _updateConfig(config) {
    let result = this._configDefault;
    result.attributes.title = config.attributes.title;
    result.style.background = `url('${config.style.backgroundUrlSrc}') no-repeat center`
    return result;
  }

}


class ButtonCancel extends ButtonInterface {

  constructor() {
    const config = {
      'attributes': {
        'title': 'Cancel update',
      },
      'style': {
        'backgroundUrlSrc': '/icons/cancel.png'
      }

    }
    super(config);
  }
}


class ButtonDelete extends ButtonInterface{

  constructor() {
    const config = {
      'attributes': {
        'title': 'Delete',
      },
      'style': {
        'backgroundUrlSrc': '/icons/trash.png'
      }
    }
    super(config);
  }
}


class ButtonEdit extends ButtonInterface{

  constructor() {
    const config = {
      'attributes': {
        'title': 'Edit',
      },
      'style': {
        'backgroundUrlSrc': '/icons/edit.png'
      }
    }
    super(config);
  }
}


class ButtonUpdate extends ButtonInterface {

  constructor() {
    const config = {
      'attributes': {
        'title': 'Update',
      },
      'style': {
        'backgroundUrlSrc': '/icons/ok.png'
      }
    }
    super(config);
  }
}


export {
  ButtonCancel,
  ButtonDelete,
  ButtonEdit,
  ButtonUpdate
};

