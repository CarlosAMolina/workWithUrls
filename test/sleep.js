import * as ModuleSleep from '../popup/modules/sleep.js';
import pkgChai from 'chai';

const {assert: assert} = pkgChai;


describe("Check script sleep.js: ", function() {
  describe("Check function sleep: ", function() {
    it("Check function runs without exceptions: ", function() {
      const result = ModuleSleep.sleepMs(2); 
      assert.typeOf(result, "Promise");
    });
  });
});

