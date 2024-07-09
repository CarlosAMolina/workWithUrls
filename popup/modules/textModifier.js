import * as ModuleDom from "./dom.js";

/*
param urlsModifier: module urlsModifier class urlsModifier instance.
*/
function modifyText(urlsModifier) {
  let urls = ModuleDom.getValueElementById("urlsInput").split("\n");
  urls = urlsModifier.modifyUrls(urls).join("\n");
  ModuleDom.setValueToElementById(urls, "urlsInput");
}

export { modifyText };
