/* https://eslint.org/docs/latest/use/configure/language-options#specifying-globals */
/* global browser */

/* References.
/*
:param key: str.
:return bool.
*/
async function isKeyStored(key) {
  console.log(`Init isKeyStored('${key}')`);
  let storedItems = {};
  try {
    storedItems = await browser.storage.local.get(key);
  } catch (e) {
    console.error(e);
    return false;
  }
  if (storedItems[key] === undefined) {
    console.log(`isKeyStored('${key}'): no`);
    return false;
  } else {
    console.log(`isKeyStored('${key}'): yes`);
    return true;
  }
}

export { isKeyStored };
