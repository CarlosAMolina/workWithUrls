import * as ModuleDom from '../../modules/dom.js';

function notShowRules(){
  while (ModuleDom.getInfoContainer().firstChild) {
    ModuleDom.getInfoContainer().removeChild(ModuleDom.getInfoContainer().firstChild);
  }   
}

export {
  notShowRules,
}
