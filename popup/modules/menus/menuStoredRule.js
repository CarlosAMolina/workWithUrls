// TODO rename this file drop New
import * as ModuleButtonsFactory from "../../../popup/modules/buttons/buttonsFactory.js";
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
    const menuSummary = document.createElement("div");
    menuSummary.setAttribute("class", "section configRule");
    const buttons = _getButtons();
    menuSummary.appendChild(buttons.delete);
    menuSummary.appendChild(buttons.edit);
    const ruleValue = new RuleValue(rule).entry;
    menuSummary.appendChild(ruleValue);
    const menuEdit = document.createElement("div");
    menuEdit.setAttribute("class", "section configRule hidden");
    menuEdit.appendChild(buttons.update);
    menuEdit.appendChild(buttons.cancel);
    const menu = document.createElement("div");
    menu.appendChild(menuSummary);
    menu.appendChild(menuEdit);
    const editInputValueOld = new EditInputValue().entry;
    menuEdit.appendChild(editInputValueOld);
    editInputValueOld.value = rule.valueOld;
    const editInputValueNew = new EditInputValue().entry;
    menuEdit.appendChild(editInputValueNew);
    editInputValueNew.value = rule.valueNew;
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
    _hideRuleElement(ruleMenu.summary.element);
    ruleMenu.edit.element.setAttribute("class", "section configRule");
  });

  ruleMenu.buttons.edit.addEventListener("click", () => {
    _hideRuleElement(ruleMenu.summary.element);
    ruleMenu.edit.element.setAttribute("class", "section configRule");
  });

  ruleMenu.buttons.cancel.addEventListener("click", () => {
    ruleMenu.summary.element.setAttribute("class", "section configRule");
    _hideRuleElement(ruleMenu.edit.element);
  });

  function _hideRuleElement(element) {
    element.setAttribute("class", "section configRule hidden");
  }

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
    entry.setAttribute("type", "text");
    return entry;
  }
}

export { showMenuStoredRule, showStoredRulesType };
