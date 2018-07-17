# Work with URLs

Firefox add-on to work with URLs:
- Open, you can open all paths
- Obfuscate
- Deobfuscate
- Copy
<br/>

**Open all paths**

To open all the paths of the given URLs, the option 'Open all paths' in the configuration menu must be activated.  

Example. With the following URLs:  
https://github.com/CarlosAMolina  
www.example.com/a/b/  

The add-on will open these URLs in new tabs:  
https://github.com/CarlosAMolina  
https://github.com  
http://www.example.com/a/b  
http://www.example.com/a  
http://www.example.com/  
<br/>

**(De)obfuscation**

The (de)obfuscation rules use regular expressions. Example:  
- Obfuscation rules:  
http ---> hXXp  
: ---> [:]  
\\. ---> [.]<br/><br/>
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
\\[\\.\\] ---> .<br/><br/>
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
<br/>

**Download link**  
<p>https://addons.mozilla.org/addon/urls-open-paths-and-obfuscate/
<br/>
<br/>

**Resources**
- Code  
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension  
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_second_WebExtension  
https://github.com/mdn/webextensions-examples (bookmark-it, find-across-tabs, quicknote...)  
Toggle Switch https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_switch  

- Images  
See icons/LICENSE
