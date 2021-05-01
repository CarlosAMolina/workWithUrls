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

export {
  OneRuleReader,
  MultipleRulesReader
}

