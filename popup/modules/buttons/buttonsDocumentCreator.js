class ButtonCancel {
  get button() {
    let button = document.createElement('button');
    button.innerHTML = '<img src="/icons/cancel.png"/>';
    button.setAttribute('title','Cancel update');
    button.setAttribute('class','floatLeft button');
    return button;
  }
}

class ButtonDelete {
  get button() {
    let button = document.createElement('button');
    button.textContent = 'Delete';
    button.innerHTML = '<img src="/icons/trash.png"/>';
    button.setAttribute('title','Delete');
    button.setAttribute('class','floatLeft button');
    return button;
  }
}

class ButtonEdit {
  get button() {
    let button = document.createElement('button');
    button.textContent = 'Edit';
    button.innerHTML = '<img src="/icons/edit.png"/>';
    button.setAttribute('title','Edit');
    button.setAttribute('class','floatLeft button');
    return button;
  }
}

class ButtonUpdate {
  get button() {
    let button = document.createElement('button');
    button.innerHTML = '<img src="/icons/ok.png"/>';
    button.setAttribute('title','Update');
    button.setAttribute('class','floatLeft button');
    return button;
  }
}

/*
param buttonName: str.
*/
function getButton(buttonName) {
  //console.log(`Button name: ${buttonName}`) //Only for development
  switch (buttonName) {
    case "cancel":
      return new ButtonCancel().button;
    default:
      throw new ButtonNameInvalidException(`Invalid buttonName: ${buttonName}`);
  }
}

function ButtonNameInvalidException(message) {
  this.message = message;
  this.name = ButtonNameInvalidExceptionName;
}

const ButtonNameInvalidExceptionName = "ButtonNameInvalidException"


export {
  getButton,
  ButtonCancel,
  ButtonDelete,
  ButtonEdit,
  ButtonNameInvalidExceptionName,
  ButtonUpdate
};
