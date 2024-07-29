/* https://eslint.org/docs/latest/use/configure/language-options#specifying-globals */
/* global browser */
/* global global */

import { beforeEach } from "mocha";
import { describe } from "mocha";
import { it } from "mocha";
import chai from "chai";

import * as ModuleStorageGeneral from "../popup/modules/storage/general.js";

function mockBrowserStorageLocalGet() {
  global.browser = {};
  browser.storage = {};
  browser.storage.local = storageMockGet();
}

// Storage Mock
// https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests
function storageMockGet() {
  return {
    get: function () {
      return new Promise(function (resolve) {
        resolve(new Object({ key1: "value1" }));
      });
    },
  };
}

describe("Check script storage/general.js:", function () {
  describe("Check function isKeyStored:", function () {
    beforeEach(function () {
      mockBrowserStorageLocalGet();
    });
    it("Check key exists:", async function () {
      chai
        .expect(await ModuleStorageGeneral.isKeyStored("key1"))
        .to.equal(true);
    });
    it("Check key does not exist:", async function () {
      chai
        .expect(await ModuleStorageGeneral.isKeyStored("invented"))
        .to.equal(false);
    });
  });
});
