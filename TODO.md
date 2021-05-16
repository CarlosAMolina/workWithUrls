## dom.js
Move to folder dom

## Private methods

Try use private methods at:

- urlsModifier.js
  - assertRuleTypeConfigured()
  - removeTrailingNewLine()
  - ruleTransformationsInstanceToUse()
  - formationsInstanceToUse()

## Not use global constant rules.

## Set more than one rule: use json instead of one rule condition per line

## Set default rules if no others stored.

## Fix HTML
- Main menu buttons with different hight.

## Tests: use beforeEach

## Refactor: use map instead for loops

## Save more than one rule grey if no type of rule has been selected

If no type of rule has been selected and the on-off button of save more than one rule is on, the box musn't be white.

## Filenames convention
Use always the same convention. Example:
- fileName.js 
- file-name.js
- file_name.js

## Not use local storage always 

Avoid the following code that is repeated multiple times:

```js
ModuleUrlsModifier.Rules.setInstance(
  await ModuleStorageRules.getRules(ModuleUrlsModifier.Rules.getInstance())
);
```

Instead request the local storage, try to work with the rules attributes.
