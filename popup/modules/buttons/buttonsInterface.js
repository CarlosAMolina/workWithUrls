class ButtonClicked {

  static _buttonIdHtml;

  static get buttonIdHtml() { return this._buttonIdHtml };

  get run() {
    throw TypeError("Not implemented: method run")
  }

  get logButtonName() {
    console.log(`Clicked button ID Html: ${this.constructor.buttonIdHtml}`);
  }

}


export {
  ButtonClicked
};
