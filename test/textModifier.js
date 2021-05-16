import * as ModuleMockDom from './mockDom.js'; // Global mocks.
import * as ModuleTextModifier from '../popup/modules/textModifier.js';
import chai from 'chai';


function mockDomInputUrls(valueToMock){
  document.getElementById('inputUrls').value = valueToMock;
}


describe("Check script textModifier.js: ", function() {
  const inputUrlsTest = 'test1.com\ntest2.com';
  describe("Check function modifyText: ", function() {
    it("Check function runs without exceptions: ", function() {
      mockDomInputUrls(inputUrlsTest);
      class MockUrlsRuleApplicator { modifyUrls(){ return ['url1.com', 'url2.com'] } };
      const mockUrlsRuleApplicator = new MockUrlsRuleApplicator();
      const result = ModuleTextModifier.modifyText(mockUrlsRuleApplicator);
      chai.expect(result).to.equal(undefined);
    });
  });
});

