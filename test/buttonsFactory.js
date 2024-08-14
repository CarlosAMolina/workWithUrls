import { describe } from "mocha";
import { it } from "mocha";
import chai from "chai";

import * as ModuleButtonsFactory from "../popup/modules/buttons/buttonsFactory.js";
import * as ModuleButtonsExceptions from "../popup/modules/buttons/buttonsExceptions.js";
import * as ModuleMockDom from "./mockDom.js";

ModuleMockDom.run();

describe("Check script buttonsFactory.js and buttonsExceptions.js: ", function () {
  describe("Check function getButton: ", function () {
    it("Check get invalid button name: ", function () {
      try {
        ModuleButtonsFactory.getButton("invalidName");
        throw "An exception should be raised";
      } catch (exception) {
        if (
          exception.name !==
          ModuleButtonsExceptions.ButtonNameInvalidException.name
        ) {
          throw exception;
        }
      }
    });
    it("Check get valid button name: ", function () {
      const button = ModuleButtonsFactory.getButton("cancel");
      chai.expect(button.title).to.equal("Cancel update");
    });
  });
});
