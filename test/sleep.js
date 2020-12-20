const assert = require("chai").assert;
const sleep = require('../popup/modules/sleep.js');


describe("Check script sleep.js: ", function() {
  describe("Check function sleep: ", function() {
    it("Check function runs without exceptions: ", function() {
      result = sleep.sleepMs(2);
      assert.typeOf(result, "Promise");
    });
  });
});

