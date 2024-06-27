// TODO rename this file drop New
import * as ModuleButtonsFactory from "../../../popup/modules/buttons/buttonsFactoryNew.js";
import * as ModuleDom from "../../../popup/modules/dom.js";
import * as ModuleRule from "../../../popup/modules/rules/rule.js";
import * as ModuleStorageGeneral from "../../../popup/modules/storage/general.js";
import * as ModuleStorageRules from "../../../popup/modules/storage/rules.js";

/*
:param rules: Rules.
*/
async function showStoredRulesType(rules) {
  console.log(`Init showStoredRulesType() of type ${rules.ruleType}`);
  rules = await ModuleStorageRules.getRules(rules);
  console.log(`Rules of type ${rules.ruleType}:`);
  console.log(rules.ruleTransformationsToUseStringRepresentation);
  for (let rule of rules.ruleTransformationsToUse) {
    await showMenuStoredRule(rule, rules);
  }
}

function showMenuStoredRule(rule, rules) {
  console.log("Init showMenuStoredRule");
  const ruleMenu = _getRuleMenu(rule);
  ModuleDom.getInfoContainer().appendChild(ruleMenu.element);

  function _getRuleMenu(rule) {
    const buttons = _getButtons();
    const menu = document.createElement("div");
    menu.setAttribute("class", "section configRule");
    // TODO? drop menuSummary
    const menuSummary = document.createElement("div");
    const menuEdit = document.createElement("div");
    const editInputValueOld = new EditInputValue().entry;
    const editInputValueNew = new EditInputValue().entry;
    menu.appendChild(buttons.delete);
    menu.appendChild(buttons.edit);
    const ruleValue = new RuleValue(rule).entry;
    menu.appendChild(ruleValue);
    menuEdit.appendChild(editInputValueOld);
    menuEdit.appendChild(editInputValueNew);
    menuEdit.appendChild(buttons.update);
    menuEdit.appendChild(buttons.cancel);
    menuEdit.appendChild(new ElementClearFix().element);
    menuEdit.style.display = "none";
    editInputValueOld.value = rule.valueOld;
    editInputValueNew.value = rule.valueNew;
    menu.appendChild(menuSummary);
    menu.appendChild(menuEdit);
    return {
      buttons: buttons,
      element: menu,
      summary: {
        element: menuSummary,
        ruleValue: ruleValue,
      },
      edit: {
        element: menuEdit,
        inputValueOld: editInputValueOld,
        inputValueNew: editInputValueNew,
      },
    };
  }

  function _getButtons() {
    return {
      cancel: ModuleButtonsFactory.getButton("cancel"),
      delete: ModuleButtonsFactory.getButton("delete"),
      edit: ModuleButtonsFactory.getButton("edit"),
      update: ModuleButtonsFactory.getButton("update"),
    };
  }

  ruleMenu.buttons.delete.addEventListener("click", (e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(
      evtTgt.parentNode.parentNode,
    );
    storageRemoveRule(rule, rules.ruleType);
    rules.deleteRule(rule);
  });

  ruleMenu.summary.ruleValue.addEventListener("click", () => {
    ruleMenu.summary.element.style.display = "none";
    ruleMenu.edit.element.style.display = "block";
  });

  ruleMenu.buttons.edit.addEventListener("click", () => {
    ruleMenu.summary.element.style.display = "none";
    ruleMenu.edit.element.style.display = "block";
  });

  ruleMenu.buttons.cancel.addEventListener("click", () => {
    ruleMenu.summary.element.style.display = "block";
    ruleMenu.edit.element.style.display = "none";
  });

  ruleMenu.buttons.update.addEventListener("click", () => {
    const ruleNew = new ModuleRule.Rule(
      ruleMenu.edit.inputValueOld.value,
      ruleMenu.edit.inputValueNew.value,
    );
    _updateRule(rule, ruleNew, rules.ruleType, ruleMenu);
  });

  async function _updateRule(rule, ruleNew, ruleType, ruleMenu) {
    const storageKeysRuleNew = new ModuleStorageRules.StorageKeysRule(
      ruleNew,
      ruleType,
    );
    if (
      (await ModuleStorageGeneral.isKeyStored(storageKeysRuleNew.keyOld)) ===
        false ||
      (rule.valueOld == ruleNew.valueOld && rule.valueNew != ruleNew.valueNew)
    ) {
      storageRemoveRule(rule, ruleType);
      storageSaveRuleIfNew(ruleNew, ruleType);
      rules.updateRule(rule, ruleNew);
      ruleMenu.element.parentNode.removeChild(ruleMenu.element);
      showMenuStoredRule(ruleNew, rules);
    }
  }

  async function storageRemoveRule(rule, ruleType) {
    await ModuleStorageRules.removeRule(rule, ruleType);
  }

  async function storageSaveRuleIfNew(rule, ruleType) {
    await ModuleStorageRules.saveRuleIfNew(rule, ruleType);
  }
}

class RuleValue {
  /*
  :param rule: Rule.
  */
  constructor(rule) {
    this._rule = rule;
  }

  get entry() {
    let entry = document.createElement("p");
    entry.textContent = this._rule.valueOld + " ---> " + this._rule.valueNew;
    return entry;
  }
}

class EditInputValue {
  get entry() {
    let entry = document.createElement("input");
    entry.setAttribute("class", "input");
    entry.setAttribute("style", "width:30%");
    return entry;
  }
}

class ElementClearFix {
  get element() {
    let element = document.createElement("div"); // for background color and correct position
    element.setAttribute("class", "clearfix");
    return element;
  }
}

export { showMenuStoredRule, showStoredRulesType };
