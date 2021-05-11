import * as ModuleDom from '../popup/modules/dom.js';
import pkgChai from 'chai';
import chai from 'chai';


describe("Check script dom.js: ", function() {
  const {assert: assert} = pkgChai;
  describe("Check class DocumentModifier: ", function() {
    it("Check function createElement: ", function() {
      const config = {
        'tag': 'button',
        'attributes': {
          'title': 'Update',
          'class': 'floatLeft button'
        },
        'style': {
          'width': '30px',
          'height': '30px',
          'background': "url('/icons/ok.png') no-repeat center"
        }
      }
      const result = new ModuleDom.DocumentModifier().createElement(config);
      chai.expect(result.title).to.equal('Update');
      chai.expect(result.style.background).to.equal('url(/icons/ok.png) no-repeat center');
    });
  });
  describe("Check class Dom: ", function() {
    it("Check function getValueElementById and setValueToElementById: ", function() {
      const elementId = 'inputUrls';
      const inputUrlsNew = 'new1.com\nnew2.com';
      ModuleDom.setValueToElementById(inputUrlsNew, elementId);
      assert.equal(ModuleDom.getValueElementById(elementId), inputUrlsNew);
    });
    it("Check function setCheckedElementById, setUncheckedElementById and isCheckedElementById: ", function() {
      const elementId = 'buttonDecodeUrls';
      ModuleDom.setCheckedElementById(elementId);
      assert.isTrue(ModuleDom.isCheckedElementById(elementId));
      ModuleDom.setUncheckedElementById(elementId);
      assert.isFalse(ModuleDom.isCheckedElementById(elementId));
    });
    it("Check function getInfoContainer: ", function() {
      const result = ModuleDom.getInfoContainer();
      assert.typeOf(result, "HTMLDivElement");
    });
    it("Check function setHiddenElementById, setUnhiddenElementById and isHiddenElementById: ", function() {
      const elementId = 'popup-content';
      ModuleDom.setHiddenElementById(elementId);
      assert.isTrue(ModuleDom.isHiddenElementById(elementId));
      ModuleDom.setUnhiddenElementById(elementId);
      assert.isFalse(ModuleDom.isHiddenElementById(elementId));
    });
    it("Check function setEnabledElementById: ", function() {
      const elementId = 'popup-content';
      ModuleDom.setEnabledElementById(elementId);
      assert.isFalse(ModuleDom.getElementById(elementId).disabled);
    });
    it("Check function setErrorStyleBoxToElementById and unsetStyleBoxErrorToElementById: ", function() {
      const elementId = 'inputLazyLoading';
      ModuleDom.setStyleBoxErrorToElementById(elementId);
      assert.equal(ModuleDom.getElementById(elementId).style.boxShadow, ModuleDom.STYLE_BOX_SHADOW_ERROR);
      ModuleDom.unsetStyleBoxErrorToElementById(elementId);
      assert.equal(ModuleDom.getElementById(elementId).style.boxShadow, '');
    });
    it("Check function showOrHideArrayElementsById: ", function() {
      const elementId = 'menuLazyLoading';
      assert.isTrue(ModuleDom.isHiddenElementById(elementId));
      ModuleDom.showOrHideArrayElementsById([elementId]);
      assert.isFalse(ModuleDom.isHiddenElementById(elementId));
    });
    it("Check function setEnabledArrayElementsById: ", function() {
      const elementId = ['pInputOld'];
      ModuleDom.setEnabledElementById([elementId]);
      assert.isFalse(ModuleDom.getElementById(elementId).disabled);
    });
  });
});

