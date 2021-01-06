import fs from "fs";
import jsdom from 'jsdom';
import path from "path";


//https://stackoverflow.com/questions/32126003/node-js-document-is-not-defined
function mockDomDocument(){
  global.document = window.document;
}

function mockDomWindow(html){
  const { JSDOM } = jsdom;
  global.window = new JSDOM(html).window;
}

function readFile(path) {
  try {
    const data = fs.readFileSync(path, 'utf8')
    return data
  } catch (exception) {
    console.error(exception)
    return exception
  }
}

// Main.
const __dirname = path.resolve();
const popupHtmlPath = path.resolve(__dirname, 'popup/popup.html');
const popupHtml = readFile(popupHtmlPath);
mockDomWindow(popupHtml);
mockDomDocument();
