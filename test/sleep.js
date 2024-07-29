import { describe } from "mocha";
import { it } from "mocha";
import pkgChai from "chai";

import * as ModuleSleep from "../popup/modules/sleep.js";

const { assert: assert } = pkgChai;

describe("Check script sleep.js: ", function () {
  describe("Check function sleep: ", function () {
    it("Check function runs without exceptions: ", function () {
      const result = ModuleSleep.sleepMs(2);
      assert.typeOf(result, "Promise");
    });
  });
});
