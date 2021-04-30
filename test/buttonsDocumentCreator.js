import * as ModuleButtons from '../popup/modules/buttons/buttonsDocumentCreator.js';
import chai from 'chai';

describe("Check script buttonsDocumentCreator.js: ", function() {
  describe("Check function getButton: ", function() {
    it("Check get invalid button name: ", function() {
      try {
        ModuleButtons.getButton("invalidName");
        throw ('An exception should be raised');
      } catch(exception) {
        if (exception.name !== ModuleButtons.ButtonNameInvalidExceptionName) {
          throw exception
        }
      }
    });
    it("Check get valid button name: ", function() {
      const button = ModuleButtons.getButton("cancel");
      chai.expect(button.title).to.equal('Cancel update');
    });
  });
});

