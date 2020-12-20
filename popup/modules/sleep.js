/* Module to pause the execution for a specified time.
*/

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleepMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { sleepMs }
