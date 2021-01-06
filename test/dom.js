import * as ModuleDom from '../popup/modules/dom.js';
import pkgChai from 'chai';


describe("Check script dom.js: ", function() {
  const {assert: assert} = pkgChai;
  describe("Check class Dom: ", function() {
    const dom = ModuleDom.getDomManager();
    it("Check function getValueElementById and setValueToElementById: ", function() {
      const elementId = 'inputUrls';
      const inputUrlsNew = 'new1.com\nnew2.com';
      dom.setValueToElementById(inputUrlsNew, elementId);
      assert.equal(dom.getValueElementById(elementId), inputUrlsNew);
    });
    it("Check function setCheckedElementById, setUncheckedElementById and isCheckedElementById: ", function() {
      const elementId = 'boxDecode';
      dom.setCheckedElementById(elementId);
      assert.isTrue(dom.isCheckedElementById(elementId));
      dom.setUncheckedElementById(elementId);
      assert.isFalse(dom.isCheckedElementById(elementId));
    });
    it("Check function getInfoContainer: ", function() {
      const result = dom.getInfoContainer();
      assert.typeOf(result, "HTMLDivElement");
    });
    it("Check function setHiddenElementById, setUnhiddenElementById and isHiddenElementById: ", function() {
      const elementId = 'popup-content';
      dom.setHiddenElementById(elementId);
      assert.isTrue(dom.isHiddenElementById(elementId));
      dom.setUnhiddenElementById(elementId);
      assert.isFalse(dom.isHiddenElementById(elementId));
    });
    it("Check function setEnabledElementById: ", function() {
      const elementId = 'popup-content';
      dom.setEnabledElementById(elementId);
      assert.isFalse(dom.getElementById(elementId).disabled);
    });
    it("Check function setErrorStyleBoxToElementById and unsetStyleBoxErrorToElementById: ", function() {
      const elementId = 'inputLazyLoading';
      dom.setStyleBoxErrorToElementById(elementId);
      assert.equal(dom.getElementById(elementId).style.boxShadow, dom.styleBoxShadowError);
      dom.unsetStyleBoxErrorToElementById(elementId);
      assert.equal(dom.getElementById(elementId).style.boxShadow, '');
    });
  });
});

