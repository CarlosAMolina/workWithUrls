import chai from 'chai';

import * as ModuleExceptionsNotImplemented from '../popup/modules/exceptions/notImplemented.js';


describe("Check script notImplemented.js: ", function() {
  describe("Check function NotImplementedException: ", function() {
    it("Check exception is raised: ", function() {
      try {
        throw new ModuleExceptionsNotImplemented.NotImplementedException();
        throw 'An exception should be raised';
      } catch(exception) {
        if (exception.name !== ModuleExceptionsNotImplemented.NotImplementedException.name
          || exception.message !== new ModuleExceptionsNotImplemented.NotImplementedException().message
        ) {
          throw exception
        }
      }
    });
  });
});

