import * as ModuleExceptionsNotImplemented from '../exceptions/notImplemented.js';
import * as ModuleDom from '../dom.js';


class ReaderInterface {
  get rules() {
    throw new ModuleExceptionsNotImplemented.NotImplementedException();
  }
}


class OneRuleReader extends ReaderInterface {
  get rules() {
    return [ModuleDom.getValueElementById('inputValueOld'), ModuleDom.getValueElementById('inputValueNew')];
  }
}


class MultipleRulesReader extends ReaderInterface {
  get rules() {
    return ModuleDom.getValueElementById('inputRules').split('\n');
  }
}

/*
param readMultipleRules: bool.
*/
function getReader(readMultipleRules) {
  if (readMultipleRules) {
    return new MultipleRulesReader()
  } else {
    return new OneRuleReader()
  }
}

export {
  getReader
}

