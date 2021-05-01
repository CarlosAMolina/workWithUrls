class RulesParser {

  /*
  :param valuesRules: array of strings.
  :return Map().
  */
  getValuesRulesWithCorrectFormat(valuesRules) {
    let valuesRulesFormatted = new Map();
    for (let i = 0; i < valuesRules.length; i+=2) {
      const valueOld = valuesRules[i];
      const valueNew = isNewValueSpecified(valuesRules[i+1]) ? valuesRules[i+1] : '';
      valuesRulesFormatted.set(valueOld, valueNew);
    }
    return valuesRulesFormatted;

    /*
    :param newValue: str.
    :return: bool.
    */
    function isNewValueSpecified(newValue) {
      return typeof newValue !== 'undefined';
    }
  }

}

export {
  RulesParser
}

