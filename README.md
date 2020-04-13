# Work with URLs

Firefox add-on to work with URLs:
- Open, you can open all paths.
- Obfuscate.
- Deobfuscate and decode.
- Copy.
- Lazy loading.
<br>

## Requirements

### Disable pop-up blocker

To allow the addon to open multiple URLs, navigate to 'about:preferences#privacy' and, under the 'Permissions' section uncheck te box next to 'Block pop-up windows'.

https://support.mozilla.org/en-US/kb/pop-blocker-settings-exceptions-troubleshooting#w_pop-up-blocker-settings

## Addon options

**Open all paths**

To open all the paths of the given URLs, the option 'Open all paths' in the addon's configuration menu must be activated.  

Example. With the following URLs:  
https://github.com/CarlosAMolina  
www.example.com/a/b/  

The add-on will open these URLs in new tabs:  
https://github.com/CarlosAMolina  
https://github.com  
http://www.example.com/a/b  
http://www.example.com/a  
http://www.example.com/  
<br>

**(De)obfuscation and decoding**

The (de)obfuscation rules use regular expressions. Example:  
- Obfuscation rules:  
http ---> hXXp  
: ---> [:]  
\\. ---> [.]<br><br>
Note. You can activate the 'Save more than one rule' option to save all these rules at once:  
http  
hXXp  
:  
[:]  
\\.  
[.]  
- Obfuscation result:  
https://github.com/CarlosAMolina --> hXXps[:]//github[.]com/CarlosAMolina  

- Deobfuscation rules:  
hXXp ---> http  
\\[\\:\\] ---> :  
\\[\\.\\] ---> .<br><br>
Note. You can activate the 'Save more than one rule' option to save all these rules at once:  
hXXp  
http  
\\[\\:\\]  
:  
\\[\\.\\]  
.  
- Deobfuscation result:  
hXXps[:]//github[.]com/CarlosAMolina --> https://github.com/CarlosAMolina  

These rules are stored and can be modified.  

To decode URLs, click on the 'Configuration' button and the 'Decode URLs' box, after that, use the 'Clean URLs' button.  

This options uses the JavaScript's decodeURIComponent() function.  

- Decoding result:  
http%3A%2F%2Fexample.com%2Fabcd%3Flanguage%3DEN --> http://example.com/abcd?language=EN 
<br>

**Copy**  

The 'Copy' button allows you to:  
- Copy the contents of the URLs box.  
- Copy stored rules.  
To copy the stored rules, the URLs box must be empty and you have to select a rule type (deobfuscation or obfuscation). Then, the deobfuscation or obfuscation rules are stored in the clipboard with this format:  
vale to change 1  
new value 1  
value to change 2  
new value 2  
...  
<br>

**Lazy loading**

You can configure a time to wait between each URL oppened by the addon.

To set this time, click on the 'Configuration' button at the addon's popup, select the 'Lazy loading configuration' button and specify the desired miliseconds, save this value clicking on the 'Update' button.
<br>

**Download link**  
<p>https://addons.mozilla.org/addon/workwithurls/
<br>
<br>

**Project's code**  
https://github.com/CarlosAMolina/workWithUrls
<br>

**Resources**
- Code  
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension  
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_second_WebExtension  
https://github.com/mdn/webextensions-examples (bookmark-it, find-across-tabs, quicknote...)  
Toggle Switch https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_switch  

- Images  
See icons/LICENSE

## How work with this project

If you want to improve or test this project on your pc, please follow these steps.

1. Clone the project.

~~~
git clone git@github.com:CarlosAMolina/workWithUrls
~~~

2. Run the addon.

After modify the project, test it with Firefox.

First, package the extension:

https://extensionworkshop.com/documentation/publish/package-your-extension/

Install the addon, read 'Trying it out' section of the following URL:

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Trying_it_out
