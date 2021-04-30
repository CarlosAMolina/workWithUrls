class ButtonClicked {

  constructor(buttonIdHtml) {
    this._buttonIdHtml = buttonIdHtml;
  }

  get buttonIdHtml() {
    return this._buttonIdHtml;
  }

  get run() {
    throw TypeError("Not implemented: method run")
  }

  get logButtonName() {
    console.log('Clicked button ID Html: ' + this.buttonIdHtml);
  }

}


export {
  ButtonClicked
};
