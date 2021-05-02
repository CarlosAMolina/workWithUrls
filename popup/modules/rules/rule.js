class Rule {
  constructor(valueOld, valueNew) {
    this._values = {valueOld: valueOld, valueNew: valueNew};
  }
  get valueOld() { return this._values.valueOld;}
  get valueNew() { return this._values.valueNew;}
  get stringRepresentation() {
    return `Rule(valueOld='${this._values.valueOld}', valueNew='${this._values.valueNew}')`
  }
}

export {
  Rule 
}
